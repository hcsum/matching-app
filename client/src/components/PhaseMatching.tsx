import React, { useCallback, useState } from "react";
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
import { User } from "../api/user";

type Props = {
  matchingEventQuery: UseQueryResult<matchingEventApi.MatchingEvent, unknown>;
};

const PhaseMatching = ({ matchingEventQuery }: Props) => {
  const { userId = "", eventId = "" } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const matchingsQuery = useQuery(
    ["getMatchingsByUserAndEvent", userId, eventId],
    () => matchingEventApi.getMatchingsByUserAndEvent({ userId, eventId }),
    {
      enabled: matchingEventQuery.data?.phase === "matching",
    }
  );

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

  if (matchingsQuery.isLoading) return <>加载中</>;

  if (matchingsQuery.data?.length === 0)
    return (
      <>
        <Typography>
          没有配对成功，但不要灰心，你还可以尝试反选或者坚持✊
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
