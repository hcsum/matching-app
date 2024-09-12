import React from "react";
import { useQuery } from "react-query";
import { matchingEventApi } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import PhaseMatching from "./PhaseMatching";
import PhaseChoosing from "./PhaseChoosing";
import PhaseEnrolling from "./PhaseEnrolling";
import { Box, Typography } from "@mui/material";
import { useAuthState } from "./AuthProvider";
import { routes } from "../routes";

const EventHome = () => {
  const { eventId = "" } = useParams();
  const { user } = useAuthState();
  const navigate = useNavigate();
  const participantQuery = useQuery(
    ["getParticipantByUserAndEvent", eventId, user!.id],
    () =>
      matchingEventApi.getParticipantByUserAndEvent({
        eventId,
        userId: user!.id,
      }),
    {
      onSuccess: (data) => {
        if (data.participant === null) {
          navigate(routes.eventCover(eventId));
        }
      },
    }
  );

  if (participantQuery.isLoading || !participantQuery.data?.participant)
    return <>加载中</>;

  const { event, participant } = participantQuery.data!;

  if (event.phase === "enrolling") {
    return <PhaseEnrolling matchingEvent={event} />;
  }

  if (participant.hasConfirmedPicking && event.phase !== "matching") {
    return (
      <Box>
        <Typography variant="body1">你已经提交选择</Typography>
        <Typography variant="body1">
          请等待选择阶段结束，就能查看配对结果
        </Typography>
      </Box>
    );
  }

  if (event.phase === "choosing") {
    return <PhaseChoosing matchingEvent={event} />;
  }

  if (event.phase === "matching") {
    return (
      <PhaseMatching
        matchingEvent={event}
        participant={participantQuery.data!.participant}
      />
    );
  }

  if (event.phase === "result") {
    return <>已结束</>;
  }

  return (
    <div>
      <h1>未开放</h1>
    </div>
  );
};

export default EventHome;
