import { Button, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import UploadPhoto from "../../components/UploadPhoto";
 import getRoutes from "../../getPaths";

const { Title, Paragraph } = Typography;

const UploadPhtots = () => {
  return (
    <div>
      <Title level={3}>这是一个上传照片的页面</Title>
      <UploadPhoto></UploadPhoto>
    </div>
  );
};

export default UploadPhtots;
