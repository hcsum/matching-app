import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../routes";
import { useAuthState } from "./AuthProvider";
import { useDialogs } from "./DialogsProvider";
import { useGlobalState } from "./GlobalContext";
import VerticalLinearStepper from "./EventProcessStepper";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useMutation } from "react-query";
import { joinPrepaidMatchingEventByUserAndEvent } from "../api/matching-event";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";

const EventCover = () => {
  const navigate = useNavigate();
  const { wechatLogin, user, isParticipant, refetchMe } = useAuthState();
  const { openPaymentPromptDialog } = useDialogs();
  const { matchingEvent } = useGlobalState();
  const { eventId } = useParams();
  const joinPrepaidMutation = useMutation(
    () =>
      joinPrepaidMatchingEventByUserAndEvent({
        userId: user!.id,
        eventId: eventId!,
      }),
    {
      onSuccess: async () => {
        await refetchMe();
        navigate(routes.eventHome(eventId));
      },
    }
  );

  if (!matchingEvent)
    return (
      <>
        <Typography variant="h1">
          🤷🏼没有找到对应的活动，请检查链接是否正确
        </Typography>
        <Button onClick={() => navigate("/")}>点此进入最近一期活动</Button>
      </>
    );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "column",
        alignItems: "center",
        "& > *, .MuiTypography-root": {
          marginBottom: "2em",
        },
      }}
    >
      <Typography variant="h1">{matchingEvent.title}</Typography>
      <Typography>
        本活动属于创意脱单系列，兼具线下和线上，融合72小时cp，照骗互选活动的特点，又融入了新的元素，而且对于问卷把控会前所未有的严格，脱单的事情都如此敷衍，划水回答，诡异的照片，是习惯了社会的毒打，想让人感同身受吗？
      </Typography>
      <Typography>
        其实不管朋友或者情侣，多多出门，多多参加活动，机会总会是大点的!
      </Typography>
      <Typography variant="h2" sx={{ alignSelf: "flex-start" }}>
        活动进程
      </Typography>
      <VerticalLinearStepper event={matchingEvent} />
      {!user ? (
        <Button variant="contained" sx={{ width: "30%" }} onClick={wechatLogin}>
          微信登陆
        </Button>
      ) : (
        <LoadingButton
          variant="contained"
          loading={joinPrepaidMutation.isLoading}
          onClick={() =>
            isParticipant
              ? navigate(routes.eventHome(eventId))
              : matchingEvent.isPrepaid
              ? joinPrepaidMutation.mutateAsync()
              : openPaymentPromptDialog()
          }
        >
          进入活动
          <ArrowForwardIosIcon sx={{ ml: 1 }} />
        </LoadingButton>
      )}
    </Box>
  );
};

export default EventCover;
