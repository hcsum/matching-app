import { RequestHandler } from "express";
import crypto from "crypto";
import axios from "axios";
import random from "string-random";
const WX_BASE_URL = "https://api.weixin.qq.com/cgi-bin";
const APP_ID = process.env.TENCENT_WECHAT_APP_ID;
const APP_SECRET = process.env.TENCENT_WECHAT_APP_SECRET;

function generateSHA1(input: string) {
  const hash = crypto.createHash("sha1");
  hash.update(input);
  return hash.digest("hex");
}

/**
 * 获取Access token
 * 参考：<https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html>
 * 注意运行该方法的电脑ip要加到微信公众号后台的IP白名单中
 */
const getAccessToken = async (appId: string, appSecret: string) => {
  if (!appId || !appSecret) return;
  const result = await axios.get(
    `/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`,
    { baseURL: WX_BASE_URL }
  );
  return result.data.access_token;
};

interface GetSignatureResponse {
  nonceStr: string;
  timestamp: number;
  signature: string;
  appId: string;
}

const getAuthTicket = async (url: string): Promise<{ ticket: string }> => {
  if (!url) return;
  lastFetchedAt = new Date().getTime();
  const accessToken = await getAccessToken(APP_ID, APP_SECRET);
  console.log("accessToken", accessToken);
  const getticketResult = await axios.get(
    `/ticket/getticket?access_token=${accessToken}&type=jsapi`,
    { baseURL: WX_BASE_URL }
  );

  return getticketResult.data;
};

let lastFetchedAt: number | undefined;
let jsapiTicket: string | undefined;
const TICKET_VALID_DURATION_IN_MILLI = 7200 * 1000;

// https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#62
export const getWechatSignature: RequestHandler = async (req, res, next) => {
  const { url } = req.body;

  jsapiTicket =
    jsapiTicket &&
    lastFetchedAt > new Date().getTime() - TICKET_VALID_DURATION_IN_MILLI
      ? jsapiTicket
      : (await getAuthTicket(url)).ticket;

  console.log("jsapiTicket", jsapiTicket);

  const nonceStr = random(16);
  const timestamp = new Date().getTime();
  const str = `jsapi_ticket=${jsapiTicket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;
  // const str =
  // "jsapi_ticket=sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg&noncestr=Wm3WZYTPz0wzccnW&timestamp=1414587457&url=http://mp.weixin.qq.com?params=value";
  const signature = generateSHA1(str);

  res.json({
    nonceStr,
    timestamp,
    signature,
    appId: APP_ID,
  });
};

