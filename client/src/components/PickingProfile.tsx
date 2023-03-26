import { Button, Divider, IconButton } from "@mui/material";
import React from "react";
import { useMutation } from "react-query";
import { pickingApi } from "../api";
import { Picking } from "../api/picking";
import { User } from "../api/user";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useParams } from "react-router-dom";

type Prop = { user: User; isPicked: boolean; onTogglePick: () => void };

const PickingProfile = ({
  user: { id, name, age, jobTitle },
  onTogglePick,
  isPicked,
}: Prop) => {
  const { eventId = "", userId = "" } = useParams();
  const pickMutation = useMutation(
    (
      params: Pick<Picking, "madeByUserId" | "matchingEventId" | "pickedUserId">
    ) => pickingApi.toggleUserPick(params)
  );

  return (
    <div key={id}>
      <div>{name}</div>
      <div>{age}</div>
      <div>{jobTitle}</div>
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

