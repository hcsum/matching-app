import {
  Box,
  Divider,
  IconButton,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import CosImage from "./CosImage";
import { MatchedUser } from "../api/matching-event";

type Prop = { user: MatchedUser };

const UserSmallProfile = ({
  user: { id, name, age, jobTitle, photoUrl },
}: Prop) => {
  return (
    <Box sx={{ width: "60%", margin: "auto", mb: 4 }}>
      <CosImage cosLocation={photoUrl} />
      <Typography>{name}</Typography>
      <Typography>{jobTitle}</Typography>
    </Box>
  );
};

export default UserSmallProfile;
