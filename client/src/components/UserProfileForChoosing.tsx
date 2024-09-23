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
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useParams } from "react-router-dom";
import { EventUser, Picking } from "../api/matching-event";
import CosImage from "./CosImage";
import { useAuthState } from "./AuthProvider";

type Prop = {
  eventUser: EventUser;
  isPicked: boolean;
  onTogglePick: (userId: string) => void;
};

const UserProfileForChoosing = ({
  eventUser,
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
        onTogglePick(eventUser.id);
      },
    }
  );

  const bioList = React.useMemo(() => {
    return Object.entries(eventUser.bio);
  }, [eventUser.bio]);

  return (
    <Box sx={{ marginBottom: "20px" }}>
      <div>{eventUser.name}</div>
      <div>{eventUser.age}</div>
      <div>{eventUser.graduatedFrom}</div>
      <div>{eventUser.jobTitle}</div>
      <div>
        {bioList.map(([q, a]) => (
          <Box key={q}>
            <Typography variant="caption">{q}</Typography>
            <Typography variant="body1">{a}</Typography>
          </Box>
        ))}
      </div>
      <div>
        {eventUser.photos.map((p) => (
          <CosImage key={p.id} cosLocation={p.cosLocation} />
        ))}
      </div>
      <IconButton
        onClick={() =>
          pickMutation.mutateAsync({
            madeByUserId: user!.id,
            matchingEventId: eventId,
            pickedUserId: eventUser.id,
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
