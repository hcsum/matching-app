import React from "react";
import { useQuery } from "react-query";
import { matchingEventApi } from "../api";
import { useParams } from "react-router-dom";
import ProfilePhasePage from "./PhaseEnrolling";
import PickingPhasePage from "./PhaseChoosing";

const EventHome = () => {
  const { userId = "", eventId = "" } = useParams();
  const matchingEventQuery = useQuery(
    ["getMatchingEventForUser", eventId, userId],
    () => matchingEventApi.getMatchingEventForUser(eventId, userId)
  );

  if (matchingEventQuery.isLoading) return <>加载中</>;

  if (matchingEventQuery.data?.phase === "enrolling") {
    return <ProfilePhasePage />;
  }

  if (matchingEventQuery.data?.phase === "choosing") {
    return <PickingPhasePage />;
  }

  if (matchingEventQuery.data?.phase === "matching") {
    return <>将收得到配对结果，以及进行反选与坚持</>;
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
