import { AlipayFormData, AlipaySdk } from "alipay-sdk";
import fs from "fs";

class AlipayAdapter {
  private alipaySdk: AlipaySdk;

  constructor({
    appId,
    privateKey,
    alipayPublicKey,
  }: {
    appId: string;
    privateKey: string;
    alipayPublicKey: string;
  }) {
    this.alipaySdk = new AlipaySdk({
      appId,
      privateKey,
      alipayPublicKey,
      // encryptKey: "oBcmw8PPZQ5LmK2FXfsWSQ==",
      // keyType: "PKCS1",
      // endpoint: "https://openapi.alipay.com/gateway.do",
    });
  }

  async test() {
    const result = await this.alipaySdk.curl(
      "POST",
      "/v3/alipay/user/deloauth/detail/query",
      {
        body: {
          date: "20230102",
          offset: 20,
          limit: 1,
        },
      }
    );
    console.log("alipay test", result);

    return result;
  }

  async createAlipayOrder(params: {
    eventId: string;
    orderId: string;
    amount: string;
    subject: string;
  }): Promise<string> {
    try {
      const result = await this.alipaySdk.sdkExecute("alipay.trade.wap.pay", {
        bizContent: {
          out_trade_no: params.orderId,
          subject: params.subject,
          total_amount: params.amount,
          product_code: "QUICK_WAP_WAY",
        },
        // notifyUrl: `https://match.kobonation.xyz/api/alipay/notify`,
        notifyUrl: `https://ludigi.work/api/alipay/notify`,
        returnUrl: `https://ludigi.work/matching-event/${params.eventId}/check-participant`,
        quitUrl: `https://ludigi.work/matching-event/${params.eventId}?alipayResult=quit`,
      });

      return result as unknown as string;
    } catch (error) {
      console.error("Error creating Alipay order:", error);
      throw error;
    }
  }
}

export default AlipayAdapter;

