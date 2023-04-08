import React, { useCallback, useState } from "react";
import _ from "lodash";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { matchingEventApi, pickingApi, userApi } from "../api";
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

  return <Box>matching phase</Box>;
};

export default PhaseMatching;
