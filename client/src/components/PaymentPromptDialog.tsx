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
        setRedirectUrl(data.form);
        onClose();
      },
    }
  );

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
