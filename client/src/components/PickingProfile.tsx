import {
  Box,
  Divider,
  getCircularProgressUtilityClass,
  IconButton,
  styled,
  Typography,
} from "@mui/material";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { pickingApi } from "../api";
import { Picking } from "../api/picking";
import { User } from "../api/user";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useParams } from "react-router-dom";
import { cosHelper } from "..";

const StyledImg = styled("img")(({ theme }) => ({
  width: "100%",
  borderRadius: "5%",
  marginBottom: "10px",
}));

type Prop = { user: User; isPicked: boolean; onTogglePick: () => void };

const PickingProfile = ({
  user: { id, name, age, jobTitle, photos, bio },
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

  const bioList = React.useMemo(() => {
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
        {photosProcessQuery.data &&
          photosProcessQuery.data.map((p) => (
            <StyledImg src={p.url} key={p.id} />
          ))}
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
    </Box>
  );
};

export default PickingProfile;

