import {
  Box,
  Divider,
  IconButton,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { User } from "../api/user";
import CosImage from "./CosImage";
import { MatchedUser } from "../api/matching-event";

type Prop = { user: MatchedUser };

const UserSmallProfile = ({
  user: { id, name, age, jobTitle, photoUrl },
}: Prop) => {
  return (
    <Box>
      <CosImage cosLocation={photoUrl} style={{ width: "200px" }} />
      <Typography>{name}</Typography>
      <Typography>{jobTitle}</Typography>
    </Box>
  );
};

export default UserSmallProfile;
