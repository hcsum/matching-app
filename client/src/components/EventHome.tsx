import React from "react";
import { useQuery } from "react-query";
import { matchingEventApi } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import PhaseMatching from "./PhaseMatching";
import PhaseChoosing from "./PhaseChoosing";
import PhaseEnrolling from "./PhaseEnrolling";
import Paths from "../paths";
import PhaseMatchingInsist from "./PhaseMatchingInsist";
import { Box, Typography } from "@mui/material";
import PhaseMatchingReverse from "./PhaseMatchingReverse";

const EventHome = () => {
  const { userId = "", eventId = "" } = useParams();
  const matchingEventQuery = useQuery(
    ["getMatchingEventForUser", eventId, userId],
    () => matchingEventApi.getMatchingEventForUser(eventId, userId)
  );
  const participantQuery = useQuery(
    ["getParticipantByUserAndEvent", eventId, userId],
    () => matchingEventApi.getParticipantByUserAndEvent({ eventId, userId })
  );
  const navigate = useNavigate();

  if (matchingEventQuery.isLoading || participantQuery.isLoading)
    return <>加载中</>;

  if (matchingEventQuery.data?.phase === "enrolling") {
    return <PhaseEnrolling matchingEventQuery={matchingEventQuery} />;
  }

  if (
    participantQuery.data?.hasConfirmedPicking &&
    matchingEventQuery.data?.phase !== "matching"
  ) {
    return (
      <Box>
        <Typography variant="body1">你已经提交选择</Typography>
        <Typography variant="body1">
          请等待选择阶段结束，就能查看配对结果
        </Typography>
      </Box>
    );
  }

  if (matchingEventQuery.data?.phase === "choosing") {
    return <PhaseChoosing matchingEventQuery={matchingEventQuery} />;
  }

  if (matchingEventQuery.data?.phase === "matching") {
    // 这段逻辑有点烦，前后端都有点
    // 这里移到PhaseMatching可能更好
    if (participantQuery.data?.postMatchAction) {
      if (participantQuery.data?.postMatchAction === "insist")
        return <PhaseMatchingInsist />;
      if (participantQuery.data?.postMatchAction === "reverse")
        return <PhaseMatchingReverse />;
    }
    return (
      <PhaseMatching
        matchingEventQuery={matchingEventQuery}
        participantQuery={participantQuery}
      />
    );
  }

  if (matchingEventQuery.data?.phase === "ended") {
    return <>已结束</>;
  }

  return (
    <div>
      <h1>未开放</h1>
    </div>
  );
};

export default EventHome;
