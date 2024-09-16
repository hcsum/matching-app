import { Link, useNavigate, useParams } from "react-router-dom";
import { matchingEventApi, userApi } from "../api";
import { routes } from "../routes";
import { Box, Button, Typography, styled } from "@mui/material";
import { toChineseDateTime } from "../utils/get-formatted-date-time-string";

type Props = {
  matchingEvent: matchingEventApi.MatchingEvent;
};

const PhaseEnrolling = ({ matchingEvent }: Props) => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const startAtString = matchingEvent.startChoosingAt
    ? toChineseDateTime(matchingEvent.startChoosingAt)
    : "---";

  return (
    <div style={{ padding: "0 3em" }}>
      <Typography variant="h5" style={{ marginBottom: "1em" }}>
        完善资料阶段
      </Typography>
      <Typography variant="body1">活动将于{startAtString}开始</Typography>
      <Typography variant="body1">互选开始前，可随时修改，补充资料</Typography>
      <Box
        sx={{
          marginTop: "3em",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Button
          sx={{ mb: 3 }}
          variant="contained"
          onClick={() => navigate(routes.userProfile(eventId))}
        >
          基本资料
        </Button>
        <Button
          sx={{ mb: 3 }}
          variant="contained"
          onClick={() => navigate(routes.userBio(eventId))}
        >
          个性展示
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate(routes.userPhotos(eventId))}
        >
          上传照片
        </Button>
      </Box>
    </div>
  );
};

export default PhaseEnrolling;
