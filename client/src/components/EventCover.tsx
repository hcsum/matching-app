import { Box, Button, Typography } from "@mui/material";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { matchingEventApi } from "../api";
import { routes } from "../routes";
import { useAuthState } from "./AuthProvider";
import { useDialogs } from "./DialogsProvider";

const EventCover = () => {
  const navigate = useNavigate();
  const { wechatLogin, user, isParticipant } = useAuthState();
  const { openPaymentPromptDialog } = useDialogs();
  const { eventId } = useParams();
  const matchingEventQuery = useQuery(
    ["matching-event", eventId],
    () =>
      eventId
        ? matchingEventApi.getMatchingEventById(eventId)
        : matchingEventApi.getLatestMatchingEvent(),
    {
      onSuccess(data) {
        if (!data) return;
        navigate(routes.eventCover(data.id));
      },
      retry: false,
    }
  );

  if (matchingEventQuery.isLoading) return <div>加载中。。。</div>;

  if (!matchingEventQuery.data)
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
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        "& > *, .MuiTypography-root": {
          marginBottom: "2em",
        },
      }}
    >
      <Typography variant="h1">{matchingEventQuery.data?.title}</Typography>
      <Typography>
        本活动属于创意脱单系列，兼具线下和线上，融合72小时cp，照骗互选活动的特点，又融入了新的元素，而且对于问卷把控会前所未有的严格，脱单的事情都如此敷衍，划水回答，诡异的照片，是习惯了社会的毒打，想让人感同身受吗？
      </Typography>
      <Typography>
        其实不管朋友或者情侣，多多出门，多多参加活动，机会总会是大点的!
      </Typography>
      {user ? (
        <Button
          variant="contained"
          onClick={() =>
            isParticipant
              ? navigate(routes.eventHome(eventId))
              : openPaymentPromptDialog()
          }
        >
          进入活动
        </Button>
      ) : (
        <Button variant="contained" onClick={wechatLogin}>
          微信登陆
        </Button>
      )}
    </Box>
  );
};

export default EventCover;
