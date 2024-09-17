import { styled } from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import { cosHelper } from "..";

const StyledImg = styled("img")(({ theme }) => ({
  width: "100%",
  borderRadius: "5px",
}));

type Prop = {
  cosLocation: string;
  style?: React.CSSProperties;
};

const CosImage = ({ cosLocation, style }: Prop) => {
  const photoProcessQuery = useQuery(
    ["photoProcessQuery", cosLocation],
    async () => {
      const { key } = cosHelper.getConfigFromCosLocation(cosLocation);
      const url = await cosHelper.getPhotoUrl({
        Key: key,
      });

      return url;
    }
  );

  if (!photoProcessQuery.data) return null;

  return <StyledImg src={photoProcessQuery.data} style={style} />;
};

export default CosImage;
