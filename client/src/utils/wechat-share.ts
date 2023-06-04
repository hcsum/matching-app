import wx from "weixin-js-sdk";

export const shareApp = (
  params: Pick<
    wx.IupdateAppMessageShareData,
    "title" | "desc" | "link" | "imgUrl"
  >
) => {
  const { title, desc, link, imgUrl } = params;
  // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
  wx.updateAppMessageShareData({
    title, // 分享标题
    desc, // 分享描述
    link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl, // 分享图标
    success: function () {
      // 设置成功
      console.log("分享给朋友配置成功");
    },
  });

  // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
  wx.updateTimelineShareData({
    title, // 分享标题
    link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl, // 分享图标
    success: function () {
      // 设置成功
      console.log("分享朋友圈配置成功");
    },
  });

  // 获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
  wx.onMenuShareWeibo({
    title, // 分享标题
    desc, // 分享描述
    link, // 分享链接
    imgUrl, // 分享图标
    success: function () {
      // 用户确认分享后执行的回调函数
      console.log("分享到腾讯微博成功");
    },
    cancel: function () {
      // 用户取消分享后执行的回调函数
      console.log("取消分享到腾讯微博");
    },
  });
};
