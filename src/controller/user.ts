import { RequestHandler } from "express";
import { User, UserInitParams, UserUpdateParams } from "../domain/user/model";

import PhotoRepository from "../domain/photo/repository";
import { Photo } from "../domain/photo/model";
import UserRepository from "../domain/user/repo";
import { getPrivateDownloadUrl, qnUpload } from "../utils/qiniu";
import { unlink } from "node:fs";
// import STS from 'qcloud-cos-sts'
const STS = require("qcloud-cos-sts");
// login or signup
export const upsertUser: RequestHandler = async (req, res, next) => {
  const { name, jobTitle, age, phoneNumber, gender } =
    req.body as UserInitParams;

  let user = await UserRepository.findOneBy({ phoneNumber });
  if (user) return res.json(user);

  user = User.init({ name, age, gender, phoneNumber, jobTitle });
  const result = await UserRepository.save(user).catch(next);
  res.status(201).json(result);
};

export const getUser: RequestHandler = async (req, res, next) => {
  const user = await UserRepository.findOneBy({ id: req.params.userId });
  res.json(user);
};

export const updateUser: RequestHandler = async (req, res, next) => {
  const user = await UserRepository.findOneBy({ id: req.params.userId });
  const values = req.body as UserUpdateParams;
  user.update(values);
  await UserRepository.save(user).catch(next);
  res.json(user);
};

export const uploadUserPhoto: RequestHandler = async (req, res, next) => {
  const { userId, cosLocation } = req.body;

  try {
    const user = await UserRepository.findOneBy({ id: userId });
    if(user === null){ console.error(`user not found with id: ${userId}`); res.sendStatus(500); }
    const newPhoto = Photo.init({ url: cosLocation, user });
    // await UserRepository.save(user).catch(next);
    await PhotoRepository.save(newPhoto).catch(next);
    // const user1 = await UserRepository.find({
    //   relations: {
    //     photos: true,
    //   },
    // });
    // console.log("updated", user1);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

// uploadUserPhoto
// export const uploadUserPhoto: RequestHandler = async (req, res, next) => {
//   const file = req.file;
//   const imgName = Buffer.from(`${file.originalname}`, "utf8").toString(
//     "base64url"
//   );
//   const key = `images/${imgName}`;
//   const localFile = file.path;

//   try {
//     const qnResponse = await qnUpload(key, localFile);

//     const user = await UserRepository.findOneBy({ id: req.body.userId });
//     // TODO: Sum does not like this way？
//     if (Array.isArray(user.photos)) {
//       user.photos.push(qnResponse.key);
//     } else {
//       user.photos = [qnResponse.key];
//     }
//     await UserRepository.save(user).catch(next);

//     unlink(localFile, (err) => {
//       if (err) throw err;
//     });
//     const privateDownloadUrl = getPrivateDownloadUrl(key);
//     res.json({ url: `http://${privateDownloadUrl}` });
//   } catch (error) {
//     console.error(error);
//     res.sendStatus(500);
//   }
// };

// 项目规模 65/人，60-80人/event，1-2 event/月。event纯线上。
// 72小时CP挑战，外卖，下午茶，语音，自拍，画像等等互动游戏/任务。
// 线上直接匹配
// no any

const config = {
  secretId: process.env.SECRETID,
  secretKey: process.env.SECRETKEY,
  bucket: process.env.BUCKET,
  region: process.env.REGION,
  proxy: process.env.Proxy,
  durationSeconds: 1800,

  // 允许操作（上传）的对象前缀，可以根据自己网站的用户登录态判断允许上传的目录，例子： user1/* 或者 * 或者a.jpg
  // 请注意当使用 * 时，可能存在安全风险，详情请参阅：https://cloud.tencent.com/document/product/436/40265
  // allowPrefix: '_ALLOW_DIR_/*',
  allowPrefix: "images/*",
  // 密钥的权限列表
  allowActions: [
    // 所有 action 请看文档 https://cloud.tencent.com/document/product/436/31923
    // 简单上传
    "name/cos:PutObject",
    "name/cos:PostObject",
    // 分片上传
    "name/cos:InitiateMultipartUpload",
    "name/cos:ListMultipartUploads",
    "name/cos:ListParts",
    "name/cos:UploadPart",
    "name/cos:CompleteMultipartUpload",
    //下载对象
    "name/cos:GetObject",
    // 查询对象列表
    "name/cos:GetBucket",
  ],
  // condition条件限定，关于 condition 的详细设置规则和COS支持的condition类型可以参考https://cloud.tencent.com/document/product/436/71306
  // condition:{
  //   // 比如限制该ip才能访问cos
  //   'ip_equal': {
  //       'qcs:ip': '192.168.1.1'
  //   }
  // }
};

// sts handler
export const getCosCredential: RequestHandler = async (req, res, next) => {
  // TODO 这里根据自己业务需要做好放行判断
  // if (config.allowPrefix === '_ALLOW_DIR_/*') {
  //     res.send({error: '请修改 allowPrefix 配置项，指定允许上传的路径前缀'});
  //     return;
  // }

  // 获取临时密钥
  // var AppId = config.bucket.substr(config.bucket.lastIndexOf("-") + 1);
  const AppId = config.bucket?.slice(config.bucket.lastIndexOf("-") + 1);
  // 数据万象DescribeMediaBuckets接口需要resource为*,参考 https://cloud.tencent.com/document/product/460/41741
  const policy = {
    version: "2.0",
    statement: [
      {
        action: config.allowActions,
        effect: "allow",
        resource: [
          "qcs::cos:" +
            config.region +
            ":uid/" +
            AppId +
            ":" +
            config.bucket +
            "/" +
            config.allowPrefix,
        ],
      },
    ],
  };
  var startTime = Math.round(Date.now() / 1000);

  STS.getCredential(
    {
      secretId: config.secretId,
      secretKey: config.secretKey,
      proxy: config.proxy,
      region: config.region, // TODO: .td文件出错
      durationSeconds: config.durationSeconds,
      // endpoint: 'sts.internal.tencentcloudapi.com', // 支持设置sts内网域名
      policy: policy,
    },
    function (err: any, tempKeys: any) {
      if (tempKeys) tempKeys.startTime = startTime;
      res.send(err || tempKeys);
    }
  );
};
