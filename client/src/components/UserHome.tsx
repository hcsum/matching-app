import React, { useMemo } from "react";
import { useFormik } from "formik";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { matchingEventApi, userApi } from "../api";
import Paths from "../paths";
import { Typography } from "@mui/material";
import { MatchingEvent } from "../api/matching-event";

const UserHome = () => {
  const { userId } = useParams();
  const userQuery = useQuery(["user", userId], () =>
    userApi.getUser({ id: userId || "" })
  );
  const matchingEventsQuery = useQuery(["matching-event", userId], () =>
    matchingEventApi.getMatchingEventsByUserId(userId || "")
  );

  const events = useMemo(() => {
    const result: { ended: MatchingEvent[]; ongoing: MatchingEvent[] } = {
      ended: [],
      ongoing: [],
    };

    for (const event of matchingEventsQuery.data || []) {
      if (event.phase !== "ended") {
        result.ongoing.push(event);
      } else {
        result.ended.push(event);
      }
    }

    return result;
  }, [matchingEventsQuery.data]);

  if (matchingEventsQuery.isLoading || userQuery.isLoading) return <>加载中</>;

  return (
    <>
      <Typography variant="h5">用户主页</Typography>
      <div>正在进行的活动：</div>
      {events.ongoing.map((event) => (
        <div key={event.id}>
          <Link to={Paths.eventHome(event.id, userId)}>{event.title}</Link>
        </div>
      ))}
      <div>你参加过的活动：</div>
      {events.ended.map((event) => (
        <div key={event.id}>
          <Link to={Paths.eventHome(event.id, userId)}>{event.title}</Link>
        </div>
      ))}
    </>
  );
};

export default UserHome;
