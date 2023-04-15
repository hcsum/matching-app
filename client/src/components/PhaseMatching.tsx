import React, { useCallback, useMemo, useState } from "react";
import _ from "lodash";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UseQueryResult, useMutation, useQuery } from "react-query";
import { matchingEventApi, userApi } from "../api";
import Paths from "../paths";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import UserProfileForChoosing from "./UserProfileForChoosing";
import { Photo, User } from "../api/user";

type Props = {
  matchingEventQuery: UseQueryResult<matchingEventApi.MatchingEvent, unknown>;
};

const PhaseMatching = ({ matchingEventQuery }: Props) => {
  const { userId = "", eventId = "" } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const matchingsQuery = useQuery(
    ["getMatchingsByUserAndEvent", userId, eventId],
    async () => {
      const matchings = await matchingEventApi.getMatchingsByUserAndEvent({
        userId,
        eventId,
      });

      return matchings;
    },
    {
      enabled: matchingEventQuery.data?.phase === "matching",
    }
  );
  const pickedUsersQuery = useQuery(
    ["getPickedUsersByUserAndEvent", userId, eventId],
    () =>
      matchingEventApi.getPickedUsersByUserAndEvent({
        madeByUserId: userId,
        matchingEventId: eventId,
      })
  );

  if (matchingsQuery.isLoading || pickedUsersQuery.isLoading)
    return <>加载中</>;

  if (matchingEventQuery.data?.phase !== "matching") {
    return (
      <Box>
        <Typography variant="body1">你已经提交选择</Typography>
        <Typography variant="body1">
          请等待选择阶段结束，就能查看配对结果
        </Typography>
      </Box>
    );
  }

  if (matchingsQuery.data?.length === 0)
    return (
      <>
        <Typography variant="body1">
          没有配对成功，但不要灰心，你还可以尝试反选或者坚持
        </Typography>
        <Typography variant="body1" fontWeight={"700"}>
          坚持: 从以下你选择的人中挑选一位，然后点击“坚持”按钮
        </Typography>
        {pickedUsersQuery.data?.map((user) => {
          return (
            <div key={user.id}>
              <Typography>{user.name}</Typography>
              <Typography>{user.jobTitle}</Typography>
              <img src={user.photoUrl} alt={user.name} />
            </div>
          );
        })}
        <Typography variant="body1" fontWeight={"700"}>
          反选: 从以下选择了你的人中挑选一位，然后点击“反选”按钮
        </Typography>
      </>
    );

  return (
    <>
      <Typography>恭喜，配对成功</Typography>
      {matchingsQuery.data?.map((user) => {
        return (
          <div>
            <Typography>{user.name}</Typography>
            <Typography>{user.jobTitle}</Typography>
          </div>
        );
      })}
    </>
  );
};

export default PhaseMatching;
