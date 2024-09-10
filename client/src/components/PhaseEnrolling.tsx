import React, { useMemo } from "react";
import { useFormik } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UseQueryResult, useQuery } from "react-query";
import { matchingEventApi, userApi } from "../api";
import { routes } from "../routes";
import { Box, Button, Typography, styled } from "@mui/material";
import { getFormattedDateTimeString } from "../utils/get-formatted-date-time-string";

type Props = {
  matchingEventQuery: UseQueryResult<matchingEventApi.MatchingEvent, unknown>;
};

const PhaseEnrolling = ({ matchingEventQuery }: Props) => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  if (matchingEventQuery.isLoading) return <>加载中</>;

  const startAtString = matchingEventQuery.data?.startChoosingAt
    ? getFormattedDateTimeString(matchingEventQuery.data.startChoosingAt)
    : "---";

  return (
    <div style={{ padding: "0 3em" }}>
      <Typography variant="h5" style={{ marginBottom: "1em" }}>
        完善资料阶段
      </Typography>
      <Typography variant="body1">活动将于{startAtString}开始</Typography>
      <Typography variant="body1">互选开始前，可随时修改，补充资料</Typography>
      <Box
        sx={{
          marginTop: "3em",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Button
          sx={{ mb: 3 }}
          variant="contained"
          onClick={() => navigate(routes.userBio(eventId))}
        >
          个性展示
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate(routes.userPhotos(eventId))}
        >
          上传照片
        </Button>
      </Box>
    </div>
  );
};

export default PhaseEnrolling;
