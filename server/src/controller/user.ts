/* eslint-disable consistent-return */

import { RequestHandler } from "express";
import { User, UserInitParams, UserUpdateParams } from "../domain/user/model";

import PhotoRepository from "../domain/photo/repository";
import { Photo } from "../domain/photo/model";
import UserRepository from "../domain/user/repo";

// import STS from 'qcloud-cos-sts'
const STS = require("qcloud-cos-sts");

// login or signup
export const upsertUser: RequestHandler = async (req, res, next) => {
  const { name, jobTitle, age, phoneNumber, gender } =
    req.body as UserInitParams;

  let user = await UserRepository.findOneBy({ phoneNumber });
  if (user) return res.json(user);

  user = User.init({
    name,
    age,
    gender,
    phoneNumber,
    jobTitle,
  });
  const result = await UserRepository.save(user).catch(next);
  res.status(201).json(result);
};

export const getUser: RequestHandler = async (req, res) => {
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
    if (user === null) {
      console.error(`user not found with id: ${userId}`);
      res.sendStatus(500);
    }
    const newPhoto = Photo.init({ url: cosLocation, user });
    await PhotoRepository.save(newPhoto).catch(next);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const config = {
  secretId: process.env.SECRET_ID,
  secretKey: process.env.SECRET_KEY,
  bucket: process.env.BUCKET,
  region: process.env.REGION,
  proxy: process.env.Proxy,
  durationSeconds: 1800,
  allowPrefix: "images/*",
  // 密钥的权限列表
  allowActions: [
    // 所有 action 请看文档 https://cloud.tencent.com/document/product/436/31923
    // 关于 condition 的详细设置规则和COS支持的condition类型可以参考https://cloud.tencent.com/document/product/436/71306
    // 简单上传
    "name/cos:PutObject",
    "name/cos:PostObject",
    // 分片上传
    "name/cos:InitiateMultipartUpload",
    "name/cos:ListMultipartUploads",
    "name/cos:ListParts",
    "name/cos:UploadPart",
    "name/cos:CompleteMultipartUpload",
    // 下载对象
    "name/cos:GetObject",
    // 查询对象列表
    "name/cos:GetBucket",
  ],
};

// sts handler
export const getCosCredential: RequestHandler = async (req, res) => {
  // TODO
  // if (config.allowPrefix === '_ALLOW_DIR_/*') {
  //     res.send({error: '请修改 allowPrefix 配置项，指定允许上传的路径前缀'});
  //     return;
  // }

  // 获取临时密钥
  const AppId = config.bucket?.slice(config.bucket.lastIndexOf("-") + 1);
  const policy = {
    version: "2.0",
    statement: [
      {
        action: config.allowActions,
        effect: "allow",
        resource: [
          `qcs::cos:${config.region}:uid/${AppId}:${config.bucket}/${config.allowPrefix}`,
        ],
      },
    ],
  };
  const startTime = Math.round(Date.now() / 1000);
  STS.getCredential(
    {
      secretId: config.secretId,
      secretKey: config.secretKey,
      proxy: config.proxy,
      region: config.region, // TODO: .td文件出错
      durationSeconds: config.durationSeconds,
      policy,
    },
    (err: any, tempKeys: any) => {
      const tempKeysRes = {} as any;
      if (tempKeys) tempKeysRes.startTime = startTime;
      res.send(err || tempKeysRes);
    }
  );
};
