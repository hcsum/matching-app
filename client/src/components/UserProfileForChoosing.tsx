import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import React from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { EventUser } from "../api/matching-event";
import CosImage from "./CosImage";

type Prop = {
  index: number;
  eventUser: EventUser;
  isPicked: boolean;
  onTogglePick: (userId: string, action: "add" | "remove") => void;
};

const UserProfileForChoosing = ({
  index,
  eventUser,
  onTogglePick,
  isPicked,
}: Prop) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const bioList = React.useMemo(() => {
    return Object.entries(eventUser.bio);
  }, [eventUser.bio]);

  return (
    <Box sx={{ marginBottom: "20px" }}>
      <Chip
        label={eventUser.eventNumber}
        sx={{ fontSize: 15, mb: 1.5 }}
        color="secondary"
      />
      <div>{eventUser.name}</div>
      <div>来自{eventUser.hometown ?? "---"}</div>
      <div>从事{eventUser.jobTitle ?? "---"}</div>
      <div>{eventUser.age ?? "---"}岁</div>
      <div>毕业于{eventUser.graduatedFrom ?? "---"}</div>
      <div>身高{eventUser.height ?? "---"}cm</div>
      <div>{eventUser.zodiacSign}</div>
      <div>{eventUser.mbti?.toUpperCase()}</div>
      <div>
        {bioList.map(([q, a]) => (
          <Box key={q}>
            <Typography variant="h3" my={2}>
              {q}
            </Typography>
            <Typography variant="body1">{a}</Typography>
          </Box>
        ))}
      </div>
      {!!eventUser.photos[0] && (
        <CosImage
          key={eventUser.photos[0]?.id}
          cosLocation={eventUser.photos[0]?.cosLocation}
        />
      )}
      {eventUser.photos.length > 1 && (
        <Button onClick={() => setDialogOpen(true)}>更多照片</Button>
      )}
      <IconButton
        sx={{ mx: "auto", display: "block", my: 2 }}
        onClick={() => onTogglePick(eventUser.id, isPicked ? "remove" : "add")}
      >
        <FavoriteIcon color={isPicked ? "secondary" : "inherit"} />
      </IconButton>
      <Divider></Divider>
      <SwipeableDrawer
        anchor={"bottom"}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onOpen={() => setDialogOpen(true)}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            overflow: "scroll",
            height: "500px",
          }}
        >
          {eventUser.photos
            .filter((p, i) => i !== 0)
            .map((p) => (
              <CosImage
                key={p.id}
                cosLocation={p.cosLocation}
                style={{ borderRadius: 0 }}
              />
            ))}
        </Box>
      </SwipeableDrawer>
    </Box>
  );
};

export default UserProfileForChoosing;
