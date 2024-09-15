import { useQuery } from "react-query";
import FullscreenLoader from "./FullScreenLoader";
import { checkParticipantByUserAndEvent } from "../api/matching-event";
import { useAuthState } from "./AuthProvider";
import { useNavigate, useParams } from "react-router-dom";
import { useRef } from "react";
import { useSnackbarState } from "./GlobalContext";
import { routes } from "../routes";

const CheckParticipant = () => {
  const { user } = useAuthState();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { setSnackBarContent } = useSnackbarState();
  const checkCount = useRef(0);
  useQuery(
    ["checkParticipant", user?.id, eventId],
    async () =>
      checkParticipantByUserAndEvent({
        userId: user!.id,
        eventId: eventId!,
      }),
    {
      refetchInterval: 500,
      onSuccess: (data) => {
        checkCount.current += 1;
        if (checkCount.current > 10) {
          setSnackBarContent("检测状态超时, 请稍后访问页面再试");
          navigate(routes.userHome(eventId));
        }
        if (data.isParticipant) {
          setSnackBarContent("欢迎加入");
          navigate(routes.eventHome(eventId));
        }
      },
    }
  );

  return <FullscreenLoader loading content="检测支付状态中" />;
};

export default CheckParticipant;
