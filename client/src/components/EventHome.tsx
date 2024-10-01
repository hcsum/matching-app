import React from "react";
import { useQuery } from "react-query";
import { matchingEventApi } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import PhaseMatching from "./PhaseMatching";
import PhaseChoosing from "./PhaseChoosing";
import PhaseEnrolling from "./PhaseEnrolling";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { useAuthState } from "./AuthProvider";
import { routes } from "../routes";
import { useGlobalState } from "./GlobalContext";

const EventHome = () => {
  const { eventId = "" } = useParams();
  const { user } = useAuthState();
  const { matchingEvent: event } = useGlobalState();
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

  if (participantQuery.isLoading)
    return (
      <Stack spacing={1} p={3}>
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="rectangular" width={210} height={60} />
        <Skeleton variant="rounded" width={210} height={60} />
      </Stack>
    );

  const { participant, participantsToPick } = participantQuery.data!;

  if (event!.phase === "ENROLLING") {
    return <PhaseEnrolling choosingStartsAt={event!.choosingStartsAt} />;
  }

  if (
    event!.phase === "CHOOSING" &&
    (!user!.isBioComplete ||
      !user!.isPhotosComplete ||
      !user!.isProfileComplete)
  ) {
    return (
      <PhaseEnrolling
        choosingStartsAt={event!.choosingStartsAt}
        isSubmissionOverdue
      />
    );
  }

  if (participant.hasConfirmedPicking && event!.phase !== "MATCHING") {
    return (
      <PhaseChoosing
        hasConfirmedPicking
        participants={participantsToPick}
        matchingStartsAt={event!.matchingStartsAt}
      />
    );
  }

  if (event!.phase === "CHOOSING") {
    return (
      <PhaseChoosing
        participants={participantsToPick}
        matchingStartsAt={event!.matchingStartsAt}
      />
    );
  }

  if (event!.phase === "MATCHING") {
    return (
      <PhaseMatching
        postMatchingAction={participant.postMatchingAction}
        hasPerformedPostMatchingAction={
          participant.hasPerformedPostMatchingAction
        }
      />
    );
  }

  if (event!.phase === "FINISHED") {
    return <>已结束</>;
  }

  return (
    <Box>
      <Typography>未开放</Typography>
    </Box>
  );
};

export default EventHome;
