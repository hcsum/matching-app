import { Typography } from "antd";
import React from "react";

const { Title, Paragraph } = Typography;

const Welcome = () => {
  return (
    <div>
      <Title level={3}>Welcome to 三天cp</Title>
      <Paragraph>这是一个blah blah blah活动。。。</Paragraph>
    </div>
  );
};

export default Welcome;
