import Button from "@mui/material/Button";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useCallback } from "react";

const SCENE_MAP = {
  startChoosing: 0,
  matchResult: 1,
  insist: 2,
  insistResponded: 3,
  reverse: 4,
  finished: 5,
} as const;

const WechatNotificationButton = ({
  scene,
}: {
  scene: keyof typeof SCENE_MAP;
}) => {
  const handleClick = useCallback(() => {
    const ACTION = "get_confirm";
    const SCENE = SCENE_MAP[scene];
    const TEMPLATE_ID = "_9_Skn-gUGTsUc4-TGg1ulxr7f2SIo1n6Zrs_q7CWlY";
    const APPID = process.env.REACT_APP_WECHAT_APP_ID;
    const RESERVED = "test";
    const REDIRECT_URI = encodeURIComponent(`${window.location.href}`);
    const url = `https://mp.weixin.qq.com/mp/subscribemsg?action=${ACTION}&appid=${APPID}&scene=${SCENE}&template_id=${TEMPLATE_ID}&redirect_url=${REDIRECT_URI}&reserved=${RESERVED}#wechat_redirect`;
    window.location.href = url;
  }, [scene]);

  return (
    <Button onClick={handleClick}>
      <NotificationsIcon />
      订阅通知
    </Button>
  );
};

export default WechatNotificationButton;
