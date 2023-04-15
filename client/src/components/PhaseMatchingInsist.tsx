import React, { useCallback, useMemo, useState } from "react";
import _ from "lodash";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { matchingEventApi, userApi } from "../api";
import Paths from "../paths";
import { Box, Typography, styled, useTheme } from "@mui/material";
import CosImage from "./CosImage";
import { type } from "@testing-library/user-event/dist/type";
import { text } from "stream/consumers";
import { Participant, PostMatchAction } from "../api/matching-event";

const PhaseMatchingInsist = () => {
  const { userId = "", eventId = "" } = useParams();
  const theme = useTheme();
  const pickedUsersQuery = useQuery(
    ["getPickedUsersByUserAndEvent", userId, eventId],
    () =>
      matchingEventApi.getPickedUsersByUserAndEvent({
        madeByUserId: userId,
        matchingEventId: eventId,
      })
  );

  return (
    <>
      <Typography variant="body1" fontWeight={"700"}>
        坚持: 从以下你选择的人中挑选一位，然后点击“坚持”按钮
      </Typography>
      <Box
        sx={{
          display: "flex",
          margin: theme.spacing(1),
          marginTop: theme.spacing(3),
        }}
      >
        {pickedUsersQuery.data?.map((user) => {
          return (
            <div key={user.id} style={{ marginRight: "1em" }}>
              <CosImage
                cosLocation={user.photoUrl}
                style={{
                  height: "100px",
                  borderRadius: "10%",
                }}
              />
              <Typography>{user.name}</Typography>
              <Typography>{user.jobTitle}</Typography>
            </div>
          );
        })}
      </Box>
    </>
  );
};

export default PhaseMatchingInsist;
