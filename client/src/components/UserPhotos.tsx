import React from "react";
import UploadPhoto from "./UploadPhoto";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { photoApi } from "../api";
import { cosHelper } from "..";
import { Box, Button, Typography } from "@mui/material";

const UserPhotos = () => {
  const { userId = "" } = useParams();
  const navigate = useNavigate();
  const photosQuery = useQuery(["photos", userId], async () => {
    const resp = await photoApi.getPhotosByUser({ userId });
    const result = [];
    for (const p of resp || []) {
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
      <Typography variant="h5">上传照片</Typography>
      <Typography variant="body1">请上传3张照片</Typography>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ alignSelf: "center", margin: "20px" }}>
          <UploadPhoto />
        </Box>
        {photosQuery.data?.map((p) => {
          return (
            <div key={p.id}>
              <img style={{ width: "80%" }} src={p.url} />
            </div>
          );
        })}
      </Box>
      <Button
        variant="contained"
        onClick={() => navigate(-1)}
        sx={{ marginTop: "20px" }}
      >
        完成
      </Button>
    </div>
  );
};

export default UserPhotos;
