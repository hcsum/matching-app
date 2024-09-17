import { RequestHandler } from "express";

const STS = require("qcloud-cos-sts");

const config = {
  secretId: process.env.TENCENT_COS_SECRET_ID,
  secretKey: process.env.TENCENT_COS_SECRET_KEY,
  bucket: process.env.TENCENT_COS_BUCKET,
  region: process.env.TENCENT_COS_REGION,
  proxy: process.env.Proxy,
  durationSeconds: 1800,
  allowPrefix: "images/*",
  // 密钥的权限列表
  allowActions: [
    // 所有 action 请看文档 https://cloud.tencent.com/document/product/436/31923
    // 关于 condition 的详细设置规则和COS支持的condition类型可以参考https://cloud.tencent.com/document/product/436/71306
    "name/cos:PutObject",
    "name/cos:PostObject",
    "name/cos:InitiateMultipartUpload",
    "name/cos:ListMultipartUploads",
    "name/cos:ListParts",
    "name/cos:UploadPart",
    "name/cos:CompleteMultipartUpload",
    "name/cos:GetObject",
    "name/cos:GetBucket",
    "name/cos:DeleteObject",
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
      const result = JSON.stringify(err || tempKeys) || "";
      res.send(result);
    }
  );
};

