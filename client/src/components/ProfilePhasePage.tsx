import React, { useMemo } from "react";
import { useFormik } from "formik";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { matchingEventApi, userApi } from "../api";
import Paths from "../paths";
import { Box } from "@mui/material";

const ProfilePhasePage = () => {
  const { userId, eventId } = useParams();
  const matchingEventQuery = useQuery(["matching-event", userId, eventId], () =>
    matchingEventApi.getMatchingEventForUser(eventId || "", userId || "")
  );

  if (matchingEventQuery.isLoading) return <>加载中</>;

  return (
    <>
      <div>完善资料阶段</div>
      <div>互选开始前，可随时修改，补充资料</div>
      <div>距离互选开始还有。。。此处应有倒计时</div>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Link to={Paths.profile(eventId, userId)}>基本信息</Link>
        <Link to={Paths.bio(eventId, userId)}>个性展示</Link>
        <Link to={Paths.uploadPhoto(eventId, userId)}>上传照片</Link>
      </Box>
    </>
  );
};

export default ProfilePhasePage;
