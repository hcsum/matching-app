// 参考：<https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html>
import wx from "weixin-js-sdk";

type WechatInitParams = {
  appId: string; // 必填，公众号的唯一标识
  timestamp: number; // 必填，生成签名的时间戳
  nonceStr: string; // 必填，生成签名的随机串
  signature: string; // 必填，签名，见附录1
};

/**
 * 通过config接口注入权限验证配置
 * 请在前端页面调用
 * @param {Object} params
 */
export const wechatInit = async (
  params: WechatInitParams & { onReady?: () => void; onError?: () => void }
) => {
  const { appId, timestamp, nonceStr, signature, onReady, onError } = params;
  wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId, // 必填，公众号的唯一标识
    timestamp, // 必填，生成签名的时间戳
    nonceStr, // 必填，生成签名的随机串
    signature, // 必填，签名
    // 必填，需要使用的JS接口列表，具体可以查看JS接口列表：<https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#63>
    jsApiList: ["updateAppMessageShareData", "updateTimelineShareData"],
  });
  // 通过ready接口处理成功验证
  wx.ready(function () {
    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    console.log("wx ready");
    onReady?.();
    // wx.updateAppMessageShareData(shareConfig);
    // wx.updateTimelineShareData(shareConfig);
  });

  // 通过error接口处理失败验证
  wx.error(function (res) {
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    console.error("wx error", res);
    onError?.();
    // throw Error(res);
  });
};

export const isWechat = /MicroMessenger/i.test(navigator.userAgent);
