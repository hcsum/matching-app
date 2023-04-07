import React from "react";
import _ from "lodash";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { matchingEventApi, pickingApi, userApi } from "../api";
import Paths from "../paths";
import { Typography } from "@mui/material";
import PickingProfile from "./PickingProfile";

const PhaseChoosing = () => {
  const { userId = "", eventId = "" } = useParams();
  const matchingEventQuery = useQuery(
    ["getMatchingEventForUser", userId, eventId],
    () => matchingEventApi.getMatchingEventForUser(eventId, userId)
  );
  const getPickingQuery = useQuery(
    ["getPickingsByUserAndEvent", userId, eventId],
    () =>
      pickingApi.getPickingsByUserAndEvent({
        madeByUserId: userId,
        matchingEventId: eventId,
      })
  );

  const pickingMap = React.useMemo(() => {
    return _.keyBy(getPickingQuery.data, "pickedUserId");
  }, [getPickingQuery.data]);

  if (matchingEventQuery.isLoading || getPickingQuery.isLoading)
    return <>加载中</>;

  return (
    <>
      <Typography variant="h5">互选中</Typography>
      <div>
        {matchingEventQuery.data?.participants.map((user) => (
          <PickingProfile
            key={user.id}
            user={user}
            isPicked={Boolean(pickingMap[user.id])}
            // todo: modify cache to prevent refetch, which will cause whole list rerender
            onTogglePick={() => getPickingQuery.refetch()}
          />
        ))}
      </div>
    </>
  );
};

export default PhaseChoosing;
