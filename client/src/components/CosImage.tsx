import { Skeleton, styled } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useQuery } from "react-query";
import { cosHelper } from "..";

type Prop = {
  cosLocation: string;
  style?: React.CSSProperties;
};

const CosImage = ({ cosLocation, style }: Prop) => {
  const [imageLoaded, setImageLoaded] = useState(false);
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

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  return (
    <>
      <img
        src={photoProcessQuery.data}
        style={{
          width: "100%",
          borderRadius: "5px",
          ...style,
          display: imageLoaded ? "block" : "none",
        }}
        alt="user profile pic"
        onLoad={handleImageLoad}
      />
      <Skeleton
        variant="rectangular"
        width={style?.width || "100%"}
        height={style?.height || 200}
        style={{
          ...style,
          borderRadius: "5px",
          display: !imageLoaded ? "block" : "none",
        }}
      />
    </>
  );
};

export default CosImage;
