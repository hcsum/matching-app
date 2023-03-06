import { Typography } from "antd";
import React from "react";
import UploadPhoto from "../../components/UploadPhoto";

const { Title } = Typography;

const UploadPhtots = () => {
  return (
    <div>
      <Title level={3}>这是一个上传照片的页面</Title>
      <UploadPhoto></UploadPhoto>
    </div>
  );
};

export default UploadPhtots;
