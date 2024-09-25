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
import SubmittedSvg from "../assets/submitted.svg";
import { toChineseDateTime } from "../utils/get-formatted-date-time-string";

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

  if (participantQuery.isLoading) return <>加载中</>;

  const { event, participant } = participantQuery.data!;

  if (event.phase === "ENROLLING") {
    return <PhaseEnrolling choosingStartsAt={event.choosingStartsAt} />;
  }

  if (event.phase === "CHOOSING" && !participant?.hasValidProfile) {
    return (
      <PhaseEnrolling
        choosingStartsAt={event.choosingStartsAt}
        isSubmissionOverdue
      />
    );
  }

  if (participant.hasConfirmedPicking && event.phase !== "MATCHING") {
    return (
      <Box>
        {/* todo: show picked users */}
        <img src={SubmittedSvg} alt="已提交" />
        <Typography variant="h2" mb={2}>
          你已经提交选择
        </Typography>
        <Typography variant="body1">
          互选阶段将于{toChineseDateTime(event.matchingStartsAt)}
          结束，届时你将收到匹配结果
        </Typography>
      </Box>
    );
  }

  if (event.phase === "CHOOSING") {
    return (
      <PhaseChoosing
        participants={event.participantsToPick}
        matchingStartsAt={event.matchingStartsAt}
      />
    );
  }

  if (event.phase === "MATCHING") {
    return (
      <PhaseMatching
        postMatchingAction={participant.postMatchingAction}
        hasPerformedPostMatchingAction={
          participant.hasPerformedPostMatchingAction
        }
      />
    );
  }

  if (event.phase === "FINISHED") {
    return <>已结束</>;
  }

  return (
    <Box>
      <Typography>未开放</Typography>
    </Box>
  );
};

export default EventHome;
