import { useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { userApi } from "../api";
import { routes } from "../routes";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { MatchingEvent } from "../api/matching-event";
import { useAuthState } from "./AuthProvider";

const UserHome = () => {
  const { user, logout } = useAuthState();
  const navigate = useNavigate();
  const userQuery = useQuery(["getUserByAccessToken"], () =>
    userApi.getUserByAccessToken()
  );
  const matchingEventsQuery = useQuery(["getMatchingEventsByUser"], () =>
    userApi.getMatchingEventsByUser()
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
    navigate(routes.userProfile());
  }, [navigate]);

  const onLogout = useCallback(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

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
        <Button variant="outlined" onClick={onUpdateProfile}>
          修改基本信息
        </Button>
      </Box>
      <Typography variant="body1">正在进行的活动：</Typography>
      {events.ongoing.map((event) => (
        <div key={event.id}>
          <Link to={routes.eventHome(event.id)}>{event.title}</Link>
        </div>
      ))}
      <div>你参加过的活动：</div>
      {events.ended.map((event) => (
        <div key={event.id}>
          <Link to={routes.eventHome(event.id)}>{event.title}</Link>
        </div>
      ))}
      <Button sx={{ mt: 6 }} variant="outlined" onClick={onLogout}>
        退出登陆
      </Button>
    </Box>
  );
};

export default UserHome;
