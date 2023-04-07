import React, { useMemo } from "react";
import { useFormik } from "formik";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { matchingEventApi, userApi } from "../api";
import Paths from "../paths";
import { Box, Typography } from "@mui/material";

const EnrollingPhase = () => {
  const { userId, eventId } = useParams();
  const matchingEventQuery = useQuery(["matching-event", userId, eventId], () =>
    matchingEventApi.getMatchingEventForUser(eventId || "", userId || "")
  );

  if (matchingEventQuery.isLoading) return <>加载中</>;

  const startAtString = new Date(
    matchingEventQuery.data?.startChoosingAt || 0
  ).toLocaleString();

  return (
    <>
      <Typography variant="h5">完善资料阶段</Typography>
      <Typography variant="body1">活动将于{startAtString}开始</Typography>
      <Typography sx={{ marginTop: "10px" }} variant="body1">
        互选开始前，可随时修改，补充资料
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Link to={Paths.bio(eventId, userId)}>个性展示</Link>
        <Link to={Paths.uploadPhoto(eventId, userId)}>上传照片</Link>
      </Box>
    </>
  );
};

export default EnrollingPhase;
