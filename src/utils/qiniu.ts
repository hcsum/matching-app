import qiniu from "qiniu";


const qnConfig = {
  accessKey: process.env.QN_ACCESS_KEY,
  secretKey: process.env.QN_SECRET_KEY,
  bucket: process.env.QN_BUCKET,
};

qiniu.conf.ACCESS_KEY = qnConfig.accessKey;
qiniu.conf.SECRET_KEY = qnConfig.secretKey;
const bucket = qnConfig.bucket;

// qiniu upload
export const qnUpload = (key: string | null, localFile: string) => {
  const putPolicy = new qiniu.rs.PutPolicy({ scope: bucket });
  const token = putPolicy.uploadToken();

  const formUploader = new qiniu.form_up.FormUploader();
  const putExtra = new qiniu.form_up.PutExtra();

  return new Promise<any>((resolve, reject) => {
    formUploader.putFile(
      token,
      key,
      localFile,
      putExtra,
      (err: any, body: any, info: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(body);
        }
      }
    );
  });
};

// 返回一个可以下载图片的url
// 私有空间测试域名： rqd05ef4z.hn-bkt.clouddn.com, 30天过期
const privateBucketDomain = "rqd05ef4z.hn-bkt.clouddn.com";

export const getPrivateDownloadUrl = (key: string) => {
  const mac = new qiniu.auth.digest.Mac(
    qiniu.conf.ACCESS_KEY,
    qiniu.conf.SECRET_KEY
  );
  const config = new qiniu.conf.Config();
  const bucketManager = new qiniu.rs.BucketManager(mac, config);
  const deadline = parseInt(`${Date.now() / 1000}`) + 3600; // 1小时过期
  return bucketManager.privateDownloadUrl(privateBucketDomain, key, deadline);
};
