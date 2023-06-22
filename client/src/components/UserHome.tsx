import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { userApi } from "../api";
import Paths from "../paths";
import { Avatar, Box, Typography } from "@mui/material";
import { MatchingEvent } from "../api/matching-event";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const UserHome = () => {
  const { userId = "" } = useParams();
  const userQuery = useQuery(["getUser", userId], () =>
    userApi.getUser({ id: userId })
  );
  const matchingEventsQuery = useQuery(
    ["getMatchingEventsByUser", userId],
    () => userApi.getMatchingEventsByUser(userId)
  );

  const events = useMemo(() => {
    const result: { ended: MatchingEvent[]; ongoing: MatchingEvent[] } = {
      ended: [],
      ongoing: [],
    };

    for (const event of matchingEventsQuery.data || []) {
      if (event.phase !== "result") {
        result.ongoing.push(event);
      } else {
        result.ended.push(event);
      }
    }

    return result;
  }, [matchingEventsQuery.data]);

  if (matchingEventsQuery.isLoading || userQuery.isLoading) return <>加载中</>;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& > *": { marginBottom: "1em" },
      }}
    >
      <Avatar src="../../../asset/user-circle.png" />
      <Typography variant="body1">正在进行的活动：</Typography>
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
    </Box>
  );
};

export default UserHome;
