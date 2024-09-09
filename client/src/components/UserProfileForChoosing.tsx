import {
  Box,
  Divider,
  IconButton,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { matchingEventApi } from "../api";
import { User } from "../api/user";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useParams } from "react-router-dom";
import { Picking } from "../api/matching-event";
import CosImage from "./CosImage";
import { useAuthState } from "./AuthProvider";

type Prop = { user: User; isPicked: boolean; onTogglePick: () => void };

const UserProfileForChoosing = ({
  user: { id, name, age, jobTitle, photos, bio },
  onTogglePick,
  isPicked,
}: Prop) => {
  const { eventId = "" } = useParams();
  const { user } = useAuthState();

  const pickMutation = useMutation(
    (
      params: Pick<Picking, "madeByUserId" | "matchingEventId" | "pickedUserId">
    ) => matchingEventApi.toggleUserPick(params),
    {
      onSuccess: () => {
        onTogglePick();
      },
    }
  );

  const bioList = React.useMemo(() => {
    console.log("bio", bio);
    return Object.entries(bio);
  }, [bio]);

  return (
    <Box sx={{ marginBottom: "20px" }}>
      <div>{name}</div>
      <div>{age}</div>
      <div>{jobTitle}</div>
      <div>
        {bioList.map(([q, a]) => (
          <Box key={q}>
            <Typography variant="caption">{q}</Typography>
            <Typography variant="body1">{a}</Typography>
          </Box>
        ))}
      </div>
      <div>
        {photos.map((p) => (
          <CosImage key={p.id} cosLocation={p.url} />
        ))}
      </div>
      <IconButton
        onClick={() =>
          pickMutation.mutateAsync({
            madeByUserId: user!.id,
            matchingEventId: eventId,
            pickedUserId: id,
          })
        }
      >
        <FavoriteIcon color={isPicked ? "secondary" : "inherit"} />
      </IconButton>
      <Divider></Divider>
    </Box>
  );
};

export default UserProfileForChoosing;
