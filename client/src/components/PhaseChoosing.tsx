import React, { useState } from "react";
import _ from "lodash";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { matchingEventApi, pickingApi, userApi } from "../api";
import Paths from "../paths";
import {
  AppBar,
  Box,
  Chip,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import UserProfileForChoosing from "./UserProfileForChoosing";
import { User } from "../api/user";

const PhaseChoosing = () => {
  const { userId = "", eventId = "" } = useParams();
  const theme = useTheme();
  const matchingEventQuery = useQuery(
    ["getMatchingEventForUser", userId, eventId],
    () => matchingEventApi.getMatchingEventForUser(eventId, userId)
  );
  const getPickingQuery = useQuery(
    ["getPickingsByUserAndEvent", userId, eventId],
    () =>
      pickingApi.getPickingsByUserAndEvent({
        madeByUserId: userId,
        matchingEventId: eventId,
      })
  );

  const participantMap = React.useMemo(() => {
    return _.keyBy(matchingEventQuery.data?.participants, "id");
  }, [matchingEventQuery.data?.participants]);

  const pickingMap = React.useMemo(() => {
    return _.keyBy(getPickingQuery.data, "pickedUserId");
  }, [getPickingQuery.data]);

  if (matchingEventQuery.isLoading || getPickingQuery.isLoading)
    return <>加载中</>;

  return (
    <>
      <Typography variant="h5">互选中</Typography>
      <Box sx={{ marginBottom: "100px" }}>
        {matchingEventQuery.data?.participants.map((user) => (
          <UserProfileForChoosing
            key={user.id}
            user={user}
            isPicked={Boolean(pickingMap[user.id])}
            // todo: modify cache instead of to refetch, which will cause whole list rerender
            onTogglePick={() => getPickingQuery.refetch()}
          />
        ))}
      </Box>
      <AppBar position="fixed" sx={{ top: "auto", bottom: 0 }}>
        <Toolbar>
          {getPickingQuery.data?.map((picked) => (
            <Chip
              sx={{
                backgroundColor: theme.palette.action.selected,
                color: theme.palette.common.white,
                marginRight: "10px",
              }}
              key={picked.id}
              label={participantMap[picked.pickedUserId].name}
            />
          ))}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default PhaseChoosing;
