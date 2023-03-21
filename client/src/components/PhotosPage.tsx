import React, { useMemo } from "react";
import { Typography } from "antd";
import UploadPhoto from "./UploadPhoto";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { photoApi } from "../api";
import { cosConfig, getPhotoUrl } from "../utils/tencent-cos";

const { Title } = Typography;
const { bucket, region } = cosConfig;

const PhotosPage = () => {
  const { userId = "" } = useParams();
  const photosQuery = useQuery(["photos", userId], async () => {
    const resp = await photoApi.getPhotosByUser({ userId });
    const result = [];
    for (const d of resp || []) {
      const url = await getPhotoUrl({
        Bucket: bucket,
        Region: region,
        Key: d.url,
      });
      result.push({ url, id: d.id });
    }
    return result;
  });

  return (
    <div>
      <Title level={3}>这是一个上传照片的页面</Title>
      <UploadPhoto list={photosQuery.data || []} />
      {photosQuery.data?.map((d) => {
        return (
          <div key={d.id}>
            <img src={d.url} />
          </div>
        );
      })}
    </div>
  );
};

export default PhotosPage;
