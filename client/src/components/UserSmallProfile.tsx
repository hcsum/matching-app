import { Box, Typography } from "@mui/material";
import React from "react";
import CosImage from "./CosImage";
import { MatchedUser } from "../api/matching-event";

type Prop = { user: MatchedUser; children?: React.ReactNode };

const UserSmallProfile = ({
  user: { id, name, age, jobTitle, photoUrl, isInsisted },
  children,
}: Prop) => {
  return (
    <Box sx={{ width: "60%", margin: "auto", mb: 6 }}>
      <CosImage cosLocation={photoUrl} />
      <Typography>{name}</Typography>
      <Typography>{jobTitle}</Typography>
      {children}
    </Box>
  );
};

export default UserSmallProfile;
