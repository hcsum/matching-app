// tencent cloud

import COS from 'cos-js-sdk-v5'

export const cos = new COS({
  // getAuthorization 必选参数
  getAuthorization: function (options: any, callback: any) {
    // 异步获取临时密钥
    // TODO: webpack webserver proxy
    var url = 'http://localhost:4000/api/user/123/sts'; // url 替换成您自己的后端服务
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function (e: Event) {
      try {
        var data = JSON.parse((e.target as XMLHttpRequest).responseText);
        var credentials = data.credentials;
      } catch (e) {
      }
      if (!data || !credentials) {
        return console.error('credentials invalid:\n' + JSON.stringify(data, null, 2))
      };
      callback({
        TmpSecretId: credentials.tmpSecretId,
        TmpSecretKey: credentials.tmpSecretKey,
        SecurityToken: credentials.sessionToken,
        // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
        StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
        ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000000
      });
    };
    xhr.send();
  }
});


// 上传到腾讯云
export async function uploadToCos(params: COS.UploadFileParams) {
  try {
    var data = await cos.uploadFile({
      ...params,
      // SliceSize: 1024 * 1024 * 5,     /* 触发分块上传的阈值，超过5MB使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */
      // onProgress: function (progressData) {
      //   console.log(JSON.stringify(progressData));
      // },
    });
    return { err: null, data: data };
  } catch (err) {
    return { err: err, data: null };
  }
}



export function getPhotoUrl({
  bucket, region, key
}: any) {
  return new Promise<string>((res, rej) => {
    cos.getObjectUrl(
      {
        Bucket: bucket,
        Region: region,
        Key: key,
        Sign: true,
      },
      function (err, data) {
        if (err) { console.log(err); rej(err) }
        /* 通过指定 response-content-disposition=attachment 实现强制下载 */
        const downloadUrl =
          data.Url +
          (data.Url.indexOf("?") > -1 ? "&" : "?") +
          "response-content-disposition=inline";
        /* 可拼接 filename 来实现下载时重命名 */
        /* downloadUrl += ';filename=myname'; */
        // （推荐使用 window.open()方式）这里是新窗口打开 url，如果需要在当前窗口打开，可以使用隐藏的 iframe 下载，或使用 a 标签 download 属性协助下载
        //  console.log('downloadUrl',downloadUrl)
        // window.open(downloadUrl)
        // http://cpchallenge-1258242169.cos.ap-guangzhou.myqcloud.com/images/81962b1f-765d-44fb-a9dd-012f7b144007/y3_1%2520%282%29_%25E5%2589%25AF%25E6%259C%25AC.jpg
        // ?q-sign-algorithm=sha1&q-ak=AKIDtU9fixRxRxgQg4Wz1rZtJoEBdxZeDT8XoSOrycOuzbodBoVqPEgvwMt1nDZo3ySo&q-sign-time=1677598203;1677600003&q-key-time=1677598203;1677600003&q-header-list=host&q-url-param-list=&q-signature=aa09d947ace4479e9b72a2447f302e63a56b7a43&x-cos-security-token=644f1OSalRsHdM65ecHyl1luiLBuiada237de9dda0d3d09b07c065172da34e82CZfHki7NeHQlpxVdLvPPAF9-i-08pGI9CroXY76oKo051zn-GlJB6ysm2vlOL4QLkPN5WQHMwIaBoQrS-qKjiNxExPTQh4xqt4Eq8V1nBFWlMpTsXSJ-gACzIxkC1O9f876Vn2AqwgpqkyQVqdk_EIs_DcQTDOEIRP35XGz1b_YY49MaE0TLtk83tB98dPCd6llvvFBjKho2c-n-e_4QqpN8na0-OElf3VHp72ohnINX2a-bBIk0QN_EYPBIET9V51YiqexnWUfYM9JfJjIUE1joF2wopZKnW-L890_nWmZm4K6SP6w2yNoxaX8-cROTr4fkL3tXsB3_6Ll9g3nOMiRjlJ5dumDxH6YPZN8LxQqcjF1rhHyHowT3xSGkaS6QL8GjA--7OGcKbRc7OuhKcTOaUjM8VIYwEZ1BEssHo8tKMuEaza1N7fU89h8_EDqUOSo1vbhsGXeBlNbMWq4p-h8a7NzEj-QnzL9JnkCnjjkAqgRTNym7jxj6ZGC_MnIWqYaNqJJ0u0RoMzGPE6gla1fNB5qUfaiaehoMSIlE5FwGIhJATjfbpWOQxVF0Hry5oDhu8G58HxkjujgYz_7Am8n9sSA0zq3ON03OlQVJbg0NZn4z7mGiobXUwDkxof23vjjvWc3WlXUrlABZgrJ_qg&response-content-disposition=inline

        res(downloadUrl)
      }
    );
  })
}

