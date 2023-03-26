import React from "react";
import { Typography } from "antd";
import UploadPhoto from "./UploadPhoto";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { photoApi } from "../api";
import { cosHelper } from "..";

const { Title } = Typography;

const PhotosPage = () => {
  const { userId = "" } = useParams();
  const photosQuery = useQuery(["photos", userId], async () => {
    const resp = await photoApi.getPhotosByUser({ userId });
    const result = [];
    for (const d of resp || []) {
      const { key } = cosHelper.getConfigFromCosLocation(d.url);
      const url = await cosHelper.getPhotoUrl({
        Key: key,
      });
      result.push({ url, id: d.id });
    }
    return result;
  });

  return (
    <div>
      <Title level={3}>这是一个上传照片的页面</Title>
      <UploadPhoto />
      {photosQuery.data?.map((d) => {
        return (
          <div key={d.id}>
            <img style={{ width: "50px", height: "50px" }} src={d.url} />
          </div>
        );
      })}
    </div>
  );
};

export default PhotosPage;

