import { Box, Chip, Divider, IconButton, Typography } from "@mui/material";
import React from "react";
import { useMutation } from "react-query";
import { matchingEventApi } from "../api";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useParams } from "react-router-dom";
import { EventUser, Picking } from "../api/matching-event";
import CosImage from "./CosImage";
import { useAuthState } from "./AuthProvider";

type Prop = {
  index: number;
  eventUser: EventUser;
  isPicked: boolean;
  onTogglePick: (userId: string) => void;
};

const UserProfileForChoosing = ({
  index,
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
      <Chip
        label={index + 1}
        sx={{ fontSize: 15, mb: 1.5 }}
        color="secondary"
      />
      <div>{eventUser.name}</div>
      <div>{eventUser.age}岁</div>
      <div>毕业于{eventUser.graduatedFrom}</div>
      <div>从事{eventUser.jobTitle}</div>
      <div>
        {bioList.map(([q, a]) => (
          <Box key={q}>
            <Typography variant="h4" my={2}>
              {q}
            </Typography>
            <Typography variant="body1">{a}</Typography>
          </Box>
        ))}
      </div>
      <Box sx={{ display: "flex", width: "100%" }}>
        {eventUser.photos.map((p) => (
          <CosImage key={p.id} cosLocation={p.cosLocation} />
        ))}
      </Box>
      <IconButton
        sx={{ mx: "auto", display: "block", my: 2 }}
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
