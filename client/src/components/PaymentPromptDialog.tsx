import {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Dialog,
  Button,
} from "@mui/material";
import { useMutation } from "react-query";
import { joinMatchingEventByUserAndEvent } from "../api/matching-event";
import { useAuthState } from "./AuthProvider";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    AlipayJSBridge: any;
  }
}

const PaymentPromptDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { user } = useAuthState();
  const { eventId } = useParams();
  const [formHtml, setFormHtml] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const joinMutation = useMutation(
    () =>
      joinMatchingEventByUserAndEvent({ userId: user!.id, eventId: eventId! }),
    {
      onSuccess: (data) => {
        // setFormHtml(data.form);
        // setRedirectUrl(data.form);
        onClose();
      },
    }
  );

  useEffect(() => {
    function ready(callback: any) {
      // 如果jsbridge已经注入则直接调用
      if ((window as any).AlipayJSBridge!) {
        callback && callback();
      } else {
        // 如果没有注入则监听注入的事件
        document.addEventListener("AlipayJSBridgeReady", callback, false);
      }
    }
    ready(function () {
      const orderStrElement = document.querySelector(".orderstr");
      if (orderStrElement) {
        orderStrElement.addEventListener("click", function () {
          window.AlipayJSBridge.call(
            "tradePay",
            {
              orderStr:
                "timestamp=2016-12-27%2018%3A00%3A00&method=alipay.trade.app.pay&app_id=2014073000007292&sign_type=RSA&charset=utf-8&version=1.0&biz_content=%7B%22timeout_express%22%3A%2230m%22%2C%22seller_id%22%3A%222088411964605312%22%2C%22product_code%22%3A%22QUICK_MSECURITY_PAY%22%2C%22total_amount%22%3A0.01%2C%22subject%22%3A1%2C%22body%22%3A%22%E5%95%86%E5%93%81%E4%B8%AD%E6%96%87%E6%8F%8F%E8%BF%B0%E4%BF%A1%E6%81%AF%22%2C%22out_trade_no%22%3A%22ALIPAYTEST2016081622560194853%22%7D&sign=aueDw0PaUqVMvbiButPCmWy8VsNJIgNKRV4tDEz3mSgIpa5ODnZKVCd1GGCtu7hNzxnwLOiku%2BTRJUVM24aHkKWrdyBHECjkUBvrziWiZBESLCyJPwT1YHGnioRUhLvL1MqTTm85urPeqAUUir4UyxyWowHitjkxh3ru6nSLkLU%3D",
            },
            function (result: any) {
              alert(JSON.stringify(result));
            }
          );
        });
      }
    });
  }, []);

  useEffect(() => {
    if (formHtml) {
      // Extract the form ID from the HTML
      const formIdMatch = formHtml.match(/id="([^"]+)"/);
      if (formIdMatch && formIdMatch[1]) {
        const formId = formIdMatch[1];
        // Submit the form
        setTimeout(() => {
          const form = document.getElementById(
            formId
          ) as HTMLFormElement | null;
          if (form) {
            form.submit();
          }
        }, 0);
      }
    } else if (redirectUrl) {
      window.location.href = `https://openapi.alipay.com/gateway.do?${redirectUrl}`;
      // window.location.href = transformAlipayUrl(redirectUrl);
    }
  }, [formHtml, redirectUrl]);

  // if (formHtml) {
  //   return (
  //     <div>
  //       <h2 className="text-xl font-bold mb-4">Redirecting to Alipay...</h2>
  //       <div dangerouslySetInnerHTML={{ __html: formHtml }} />
  //     </div>
  //   );
  // }

  return (
    <Dialog open={open}>
      <DialogTitle>开启缘分之旅</DialogTitle>
      <DialogContent>
        <DialogContentText>支付59元后即可进入活动</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>再想想</Button>
        <Button onClick={() => joinMutation.mutateAsync()}>确定</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentPromptDialog;

function transformAlipayUrl(inputQuery: string): string {
  // Base URL for the transformed link
  const baseUrl = "https://ulink.alipay.com/?scheme=";

  // Encode the alipayclient part
  const alipayClientPart = encodeURIComponent("alipay://alipayclient/?");

  // Remove leading '?' if present
  const cleanQuery = inputQuery.startsWith("?")
    ? inputQuery.slice(1)
    : inputQuery;

  // Create the dataString by encoding the entire query string again
  const dataString = encodeURIComponent(cleanQuery);

  // Create the JSON object
  const jsonObject = {
    requestType: "SafePay",
    fromAppUrlScheme: "alipays",
    dataString,
    h5FromAppUrlScheme: "https",
    sourceSceneType: "h5Route",
  };

  // Encode the entire JSON object
  const encodedJsonObject = encodeURIComponent(JSON.stringify(jsonObject));

  // Construct the final URL
  return `${baseUrl}${alipayClientPart}${encodedJsonObject}`;
}
