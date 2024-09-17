import React from "react";
import UploadPhoto from "./UploadPhoto";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api";
import { Box, Button, Typography } from "@mui/material";
import CosImage from "./CosImage";
import { useAuthState } from "./AuthProvider";
import DeleteIcon from "@mui/icons-material/Delete";
import { cosHelper } from "..";

const UserPhotos = () => {
  const { user, refetchMe } = useAuthState();
  const navigate = useNavigate();
  const photosQuery = useQuery(["photos", user!.id], async () => {
    const resp = await userApi.getPhotosByUser();
    return resp;
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async ({ url, photoId }: { url: string; photoId: string }) => {
      const { key } = cosHelper.getConfigFromCosLocation(url);
      await cosHelper.deleteObject({
        Key: key,
      });
      await userApi.deletePhoto({ photoId });
    },
    onSuccess: () => {
      photosQuery.refetch();
    },
  });

  return (
    <Box sx={{ minHeight: "120vh" }}>
      <Typography variant="h5">上传照片</Typography>
      <Typography variant="body1">请上传3张照片</Typography>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ alignSelf: "center", margin: "20px" }}>
          <UploadPhoto />
        </Box>
        {photosQuery.data?.map((p) => {
          return (
            <Box key={p.id} sx={{ position: "relative", width: "100%", mb: 2 }}>
              <CosImage cosLocation={p.url} />
              <Button
                onClick={() =>
                  deletePhotoMutation.mutateAsync({
                    url: p.url,
                    photoId: p.id,
                  })
                }
                sx={{
                  display: "block",
                  width: "100%",
                  position: "absolute",
                  bottom: "0",
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                  },
                }}
              >
                <DeleteIcon color={"action"} />
              </Button>
            </Box>
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
