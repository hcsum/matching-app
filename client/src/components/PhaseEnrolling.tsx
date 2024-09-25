import { Link, useNavigate, useParams } from "react-router-dom";
import { routes } from "../routes";
import { Box, Button, Typography, styled } from "@mui/material";
import WechatNotificationButton from "./WechatNotificationButton";

type Props = {
  choosingStartsAt: string;
  isSubmissionOverdue?: boolean;
};

const PhaseEnrolling = ({ choosingStartsAt, isSubmissionOverdue }: Props) => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ padding: "0 3em" }}>
      {isSubmissionOverdue ? (
        <>
          <Typography variant="h1" style={{ marginBottom: "1em" }}>
            😨互选阶段已开始，但你的资料还不完整
          </Typography>
          <Typography variant="body1">
            其他用户已经开始互选了，请尽快补全资料，进入互选页面。
          </Typography>
          <Typography variant="body1">
            在资料完善前，你的资料不会被其他用户看到。
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="h1" style={{ marginBottom: "1em" }}>
            完善资料阶段
          </Typography>
          <Typography variant="body1">
            活动将于<b>{choosingStartsAt}</b>开始，
            {/* 可点击下方订阅按钮，公众号将在活动开始前提醒你。 */}
          </Typography>
          {/* <WechatNotificationButton scene="startChoosing" /> */}
          <Typography variant="body1">
            互选开始前，可随时修改，补充资料
          </Typography>
        </>
      )}
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
