import { Box, Typography } from "@mui/material";
import React from "react";
import CosImage from "./CosImage";
import { EventUser } from "../api/matching-event";

type Prop = { user: EventUser; children?: React.ReactNode };

const UserSmallProfile = ({
  user: { id, name, age, jobTitle, photos, graduatedFrom },
  children,
}: Prop) => {
  return (
    <Box sx={{ width: "60%", margin: "auto", mb: 6 }}>
      <CosImage cosLocation={photos[0]?.cosLocation} />
      <Typography>{name}</Typography>
      <Typography>{age}</Typography>
      <Typography>{jobTitle}</Typography>
      <Typography>{graduatedFrom}</Typography>
      {children}
    </Box>
  );
};

export default UserSmallProfile;
