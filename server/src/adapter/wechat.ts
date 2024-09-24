import axios from "axios";
import random from "string-random";
import crypto from "crypto";

const TICKET_VALID_DURATION_IN_MILLI = 7200 * 1000;
// const TICKET_VALID_DURATION_IN_MILLI = 0;

type WeChatUserInfo = {
  openid: string;
  nickname: string;
  sex: number;
  language: string;
  city: string;
  province: string;
  country: string;
  headimgurl: string;
  privilege: any[];
};

class WechatAdapter {
  private appid: string;
  private appsecret: string;
  private baseUrl: string;
  private lastFetchedAt: number | undefined;
  private jsapiTicket: string | undefined;

  constructor({ appid, appsecret }: { appid: string; appsecret: string }) {
    this.appid = appid;
    this.appsecret = appsecret;
    this.baseUrl = "https://api.weixin.qq.com";
    this.lastFetchedAt = undefined;
    this.jsapiTicket = undefined;
  }

  async getSignature({ url }: { url: string }) {
    this.jsapiTicket =
      this.lastFetchedAt &&
      new Date().getTime() - this.lastFetchedAt < TICKET_VALID_DURATION_IN_MILLI
        ? this.jsapiTicket
        : (await this.getJsApiTicket()).ticket;

    // console.log("jsapiTicket", this.jsapiTicket);
    // console.log("lastFetchedAt", this.lastFetchedAt);

    const nonceStr = random(16);
    const timestamp = new Date().getTime();
    const str = `jsapi_ticket=${this.jsapiTicket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;
    // console.log("str", str);
    // const str =
    //   "jsapi_ticket=sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg&noncestr=Wm3WZYTPz0wzccnW&timestamp=1414587457&url=http://mp.weixin.qq.com?params=value";
    const signature = generateSHA1(str);

    return {
      nonceStr,
      timestamp,
      signature,
      appId: this.appid,
    };
  }

  private async getJsApiTicket(): Promise<{ ticket: string }> {
    const accessToken = await this.getAccessToken(this.appid, this.appsecret);
    console.log("wechat accessToken", accessToken);
    const getticketResult = await axios.get(
      `/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`,
      { baseURL: this.baseUrl }
    );
    if (!getticketResult.data.ticket)
      throw new Error(getticketResult.data.errmsg);
    this.lastFetchedAt = new Date().getTime();

    return getticketResult.data;
  }

  /**
   * 获取Access token
   * 参考：<https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html>
   * 注意运行该方法的电脑ip要加到微信公众号后台的IP白名单中
   */
  private async getAccessToken(appId: string, appSecret: string) {
    const result = await axios.get(
      `/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`,
      { baseURL: this.baseUrl }
    );
    if (!result.data.access_token) throw new Error(result.data.errmsg);
    return result.data.access_token;
  }

  async getUserAccessToken(code: string) {
    const accessTokenUrl = `${this.baseUrl}/sns/oauth2/access_token`;
    const resp: {
      data: {
        access_token: string;
        expires_in: number;
        refresh_token: string;
        openid: string;
        scope: string;
        is_snapshotuser: number;
        unionid: string;
      };
    } = await axios.get(accessTokenUrl, {
      params: {
        appid: this.appid,
        secret: this.appsecret,
        code,
        grant_type: "authorization_code",
      },
    });
    return resp.data;
  }

  async getUserInfo(
    accessToken: string,
    openid: string
  ): Promise<WeChatUserInfo> {
    const userInfoUrl = `${this.baseUrl}/sns/userinfo`;
    const resp: {
      data: WeChatUserInfo;
    } = await axios.get(userInfoUrl, {
      params: {
        access_token: accessToken,
        openid,
      },
    });

    return resp.data;
  }
}

function generateSHA1(input: string) {
  const hash = crypto.createHash("sha1");
  hash.update(input);
  return hash.digest("hex");
}

export default WechatAdapter;

