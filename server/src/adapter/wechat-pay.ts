import axios from "axios";
import crypto from "crypto";

interface WeChatPayConfig {
  appId: string;
  mchId: string;
  apiKey: string;
  notifyUrl: string;
}

interface OrderParams {
  orderId: string;
  amount: number;
  description: string;
  ip: string;
}

class WeChatPayAdapter {
  private config: WeChatPayConfig;

  constructor(config: WeChatPayConfig) {
    this.config = config;
  }

  private generateNonceStr(): string {
    return Math.random().toString(36).substr(2, 15);
  }

  private generateSign(params: Record<string, string | number>): string {
    const sortedParams =
      Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join("&") + `&key=${this.config.apiKey}`;

    return crypto
      .createHash("md5")
      .update(sortedParams)
      .digest("hex")
      .toUpperCase();
  }

  private async parseXml(xml: string): Promise<Record<string, string>> {
    return new Promise((resolve) => {
      const result: Record<string, string> = {};
      xml.replace(/<(\w+)>([^<]+)<\/\1>/g, (_, key, value) => {
        result[key] = value;
        return "";
      });
      resolve(result);
    });
  }

  public async createOrder(orderParams: OrderParams): Promise<string> {
    const params: Record<string, string | number> = {
      appid: this.config.appId,
      mch_id: this.config.mchId,
      nonce_str: this.generateNonceStr(),
      body: orderParams.description,
      out_trade_no: orderParams.orderId,
      total_fee: Math.floor(orderParams.amount * 100), // 将元转换为分
      spbill_create_ip: orderParams.ip,
      notify_url: this.config.notifyUrl,
      trade_type: "MWEB",
    };

    params.sign = this.generateSign(params);

    const xmlData = Object.keys(params)
      .map((key) => `<${key}>${params[key]}</${key}>`)
      .join("");

    const finalXml = `<xml>${xmlData}</xml>`;

    try {
      const response = await axios.post(
        "https://api.mch.weixin.qq.com/pay/unifiedorder",
        finalXml,
        {
          headers: { "Content-Type": "text/xml" },
        }
      );

      const result = await this.parseXml(response.data);

      if (
        result.return_code === "SUCCESS" &&
        result.result_code === "SUCCESS"
      ) {
        return result.mweb_url;
      } else {
        throw new Error(result.return_msg || "创建订单失败");
      }
    } catch (error) {
      console.error("创建订单错误:", error);
      throw new Error("创建订单失败");
    }
  }

  // 可以在这里添加其他微信支付相关的方法，如查询订单、关闭订单等
}

export default WeChatPayAdapter;
