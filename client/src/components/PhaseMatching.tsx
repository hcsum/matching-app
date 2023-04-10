import React, { useCallback, useState } from "react";
import _ from "lodash";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
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

const PhaseMatching = () => {
  const { userId = "", eventId = "" } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="body1">你已经提交选择</Typography>
      <Typography variant="body1">
        请等待选择阶段结束，就能查看配对结果啦
      </Typography>
    </Box>
  );
};

export default PhaseMatching;
