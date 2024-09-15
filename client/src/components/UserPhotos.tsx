import React from "react";
import UploadPhoto from "./UploadPhoto";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api";
import { Box, Button, Typography } from "@mui/material";
import CosImage from "./CosImage";
import { useAuthState } from "./AuthProvider";

const UserPhotos = () => {
  const { user, refetchMe } = useAuthState();
  const navigate = useNavigate();
  const photosQuery = useQuery(["photos", user!.id], async () => {
    const resp = await userApi.getPhotosByUser({ userId: user!.id });
    return resp;
  });

  return (
    // todo: delete photos
    <Box sx={{ minHeight: "120vh" }}>
      <Typography variant="h5">上传照片</Typography>
      <Typography variant="body1">请上传3张照片</Typography>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ alignSelf: "center", margin: "20px" }}>
          <UploadPhoto />
        </Box>
        {photosQuery.data?.map((p) => {
          return (
            <div key={p.id}>
              <CosImage style={{ width: "80%" }} cosLocation={p.url} />
            </div>
          );
        })}
      </Box>
      <Button
        variant="contained"
        onClick={() => {
          navigate(-1);
          refetchMe();
        }}
        sx={{ marginTop: "20px" }}
      >
        完成
      </Button>
    </Box>
  );
};

export default UserPhotos;
