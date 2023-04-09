import React from "react";
import { useQuery } from "react-query";
import { matchingEventApi } from "../api";
import { useParams } from "react-router-dom";
import PhaseMatching from "./PhaseMatching";
import PhaseChoosing from "./PhaseChoosing";
import PhaseEnrolling from "./PhaseEnrolling";

const EventHome = () => {
  const { userId = "", eventId = "" } = useParams();
  const matchingEventQuery = useQuery(
    ["getMatchingEventForUser", eventId, userId],
    () => matchingEventApi.getMatchingEventForUser(eventId, userId)
  );

  if (matchingEventQuery.isLoading) return <>加载中</>;

  if (matchingEventQuery.data?.phase === "enrolling") {
    return <PhaseEnrolling matchingEventQuery={matchingEventQuery} />;
  }

  if (matchingEventQuery.data?.phase === "choosing") {
    return <PhaseChoosing matchingEventQuery={matchingEventQuery} />;
  }

  if (matchingEventQuery.data?.phase === "matching") {
    return <PhaseMatching />;
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
