import React, { useCallback, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { userApi } from "../api";
import Paths from "../paths";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { MatchingEvent } from "../api/matching-event";

const UserHome = () => {
  const { userId = "" } = useParams();
  const navigate = useNavigate();
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

  const onUpdateProfile = useCallback(() => {
    navigate(Paths.userProfile(userId));
  }, [navigate, userId]);

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          "& > *": { marginBottom: ".4em" },
        }}
      >
        <Avatar src="../../../asset/user-circle.png" />
        <Typography>{userQuery.data?.name}</Typography>
        <Button
          variant="text"
          sx={{ textDecoration: "underline" }}
          onClick={onUpdateProfile}
        >
          修改基本信息
        </Button>
      </Box>
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
