import {
  Divider,
  getCircularProgressUtilityClass,
  IconButton,
} from "@mui/material";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { pickingApi } from "../api";
import { Picking } from "../api/picking";
import { User } from "../api/user";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useParams } from "react-router-dom";
import { cosHelper } from "..";

type Prop = { user: User; isPicked: boolean; onTogglePick: () => void };

const PickingProfile = ({
  user: { id, name, age, jobTitle, photos },
  onTogglePick,
  isPicked,
}: Prop) => {
  const { eventId = "", userId = "" } = useParams();
  const pickMutation = useMutation(
    (
      params: Pick<Picking, "madeByUserId" | "matchingEventId" | "pickedUserId">
    ) => pickingApi.toggleUserPick(params)
  );

  const photosProcessQuery = useQuery(["photosProcessQuery", id], async () => {
    const result = [];

    for (const p of photos) {
      const { key } = cosHelper.getConfigFromCosLocation(p.url);
      const url = await cosHelper.getPhotoUrl({
        Key: key,
      });
      result.push({ url, id: p.id });
    }

    return result;
  });

  return (
    <div>
      <div>{name}</div>
      <div>{age}</div>
      <div>{jobTitle}</div>
      <div>
        {photosProcessQuery.data &&
          photosProcessQuery.data.map((p) => <img src={p.url} key={p.id} />)}
      </div>
      <IconButton
        onClick={() =>
          pickMutation
            .mutateAsync({
              madeByUserId: userId,
              matchingEventId: eventId,
              pickedUserId: id,
            })
            .then(onTogglePick)
        }
      >
        <FavoriteIcon color={isPicked ? "primary" : "disabled"} />
      </IconButton>
      <Divider></Divider>
    </div>
  );
};

export default PickingProfile;

