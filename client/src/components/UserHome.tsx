import { useCallback, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { userApi } from "../api";
import { routes } from "../routes";
import { Avatar, Box, Button, Divider, Typography } from "@mui/material";
import { MatchingEvent } from "../api/matching-event";
import { useAuthState } from "./AuthProvider";

const UserHome = () => {
  const { eventId } = useParams();
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
    navigate(routes.userProfile(eventId));
  }, [eventId, navigate]);

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
        <Avatar src="../../assets/user-circle.png" />
        <Typography>{userQuery.data?.name}</Typography>
      </Box>
      <Typography variant="h1" mb={2}>
        正在进行的活动：
      </Typography>
      {events.ongoing.map((event) => (
        <div key={event.id}>
          <Link to={routes.eventHome(event.id)}>{event.title}</Link>
        </div>
      ))}
      <Divider sx={{ width: "100%", my: 5 }} />
      <Typography variant="h1" mb={2}>
        你参加过的活动：
      </Typography>
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
