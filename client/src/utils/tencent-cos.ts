// tencent cloud

import COS, { GetObjectUrlParams } from "cos-js-sdk-v5";

export const cos = new COS({
  getAuthorization: function (options: any, callback: any) {
    // 异步获取临时密钥
    // TODO: webpack webserver proxy
    // TODO: userId
    var url = "http://localhost:4000/api/user/123/sts";
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
  },
});

// 上传到腾讯云
export async function uploadToCos(params: COS.UploadFileParams) {
  try {
    var data = await cos.uploadFile({
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

export function getPhotoUrl({ Bucket, Region, Key }: GetObjectUrlParams) {
  return new Promise<string>((res, rej) => {
    cos.getObjectUrl(
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
