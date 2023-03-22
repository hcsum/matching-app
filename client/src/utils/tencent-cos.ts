import COS, { GetObjectUrlParams } from "cos-js-sdk-v5";

export const cosConfig = {
  bucket: "cpchallenge-1258242169",
  region: "ap-guangzhou",
};

export class CosHelper {
  cos: COS;
  constructor() {
    this.cos = new COS({
      getAuthorization: this.getAuthorization,
    });
  }

  async uploadToCos(params: COS.UploadFileParams) {
    try {
      var data = await this.cos.uploadFile({
        ...params,
        SliceSize:
          1024 *
          1024 *
          5 /* 触发分块上传的阈值，超过5MB使用分块上传，小于5MB使用简单上传。 */,
        // onProgress: function (progressData) {
        //   console.log(JSON.stringify(progressData));
        // },
      });
      return { err: null, data: data };
    } catch (err) {
      return { err: err, data: null };
    }
  }

  getPhotoUrl({ Bucket, Region, Key }: GetObjectUrlParams) {
    return new Promise<string>((res, rej) => {
      this.cos.getObjectUrl(
        {
          Bucket,
          Region,
          Key,
          Sign: true,
        },
        function (err, data) {
          if (err) {
            console.log(err);
            rej(err);
          }
          const downloadUrl =
            data.Url +
            (data.Url.indexOf("?") > -1 ? "&" : "?") +
            "response-content-disposition=inline";
          res(downloadUrl);
        }
      );
    });
  }

  private getAuthorization(options: any, callback: any) {
    // 异步获取临时密钥
    var url = "http://localhost:4000/api/cos/sts";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function (e: Event) {
      try {
        var data = JSON.parse((e.target as XMLHttpRequest).responseText);
        var credentials = data.credentials;
      } catch (e) {}
      if (!data || !credentials) {
        return console.error(
          "credentials invalid:\n" + JSON.stringify(data, null, 2)
        );
      }
      callback({
        TmpSecretId: credentials.tmpSecretId,
        TmpSecretKey: credentials.tmpSecretKey,
        SecurityToken: credentials.sessionToken,
        StartTime: data.startTime,
        ExpiredTime: data.expiredTime,
      });
    };
    xhr.send();
  }

  getConfigFromCosLocation(cosLocation: string) {
    // location 存储桶访问地址，不带 https:// 前缀
    // 例如 examplebucket-1250000000.cos.ap-guangzhou.myqcloud.com/images/1.jpg
    // location 使用时需要decode，否则key会与原始key不一样
    const config = { bucket: "", serviceName: "", region: "", key: "" };
    const decodeLocation = decodeURI(cosLocation);
    const keyIndex = decodeLocation.indexOf("/");
    if (keyIndex === -1) return config;
    config.key = decodeLocation.slice(keyIndex);
    const res = decodeLocation.slice(0, keyIndex);
    const resArr = res.split(".");
    if (resArr.length < 3) return config;
    [config.bucket, config.serviceName, config.region] = resArr;
    return config;
  }
}
