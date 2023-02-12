import { Button, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { Paths } from "../types";

const { Title, Paragraph } = Typography;

const Welcome = () => {
  return (
    <div>
      <Title level={3}>Welcome to 三天cp</Title>
      <Paragraph>这是一个blah blah blah活动。。。</Paragraph>
      <Button type="primary">
        <Link to={Paths.REGISTRATION}>填写资料</Link>
      </Button>
    </div>
  );
};

export default Welcome;
