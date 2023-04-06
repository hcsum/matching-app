import React from "react";
import { useQuery } from "react-query";
import { matchingEventApi } from "../api";
import { useParams } from "react-router-dom";

const EventPage = () => {
  const { userId = "", eventId = "" } = useParams();
  const matchingEventQuery = useQuery(
    ["getMatchingEventForUser", eventId, userId],
    () => matchingEventApi.getMatchingEventForUser(eventId, userId)
  );

  if (matchingEventQuery.isLoading) return <>加载中</>;

  if (matchingEventQuery.data?.phase === "enrolling") {
    return <>互选中</>;
  }

  if (matchingEventQuery.data?.phase === "choosing") {
    return <>填写资料中</>;
  }

  if (matchingEventQuery.data?.phase === "matching") {
    return <>匹配中</>;
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

export default EventPage;
