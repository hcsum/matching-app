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

const SquareButton = styled(Button)(() => ({
  height: "80px",
  width: "80px",
}));

const PhaseEnrolling = ({ matchingEventQuery }: Props) => {
  const { userId, eventId } = useParams();
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
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <SquareButton
          variant="contained"
          onClick={() => navigate(routes.userBio(eventId))}
        >
          个性展示
        </SquareButton>
        <SquareButton
          variant="contained"
          onClick={() => navigate(routes.userPhotos(eventId))}
        >
          上传照片
        </SquareButton>
      </Box>
    </div>
  );
};

export default PhaseEnrolling;
