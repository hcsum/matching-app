import { Button, Typography } from "antd";
import React from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { matchingEventApi } from "../api";
import getRoutes from "../getPaths";

const { Title, Paragraph } = Typography;

const Welcome = () => {
  const { eventId } = useParams();
  const matchingEventQuery = useQuery(["matching-event", eventId], () =>
    matchingEventApi.getMatchingEvent(eventId || "")
  );

  if (matchingEventQuery.isLoading) return <div>加载中。。。</div>;
  return (
    <div>
      <Title level={3}>Welcome to 三天cp</Title>
      <Title level={4}>{matchingEventQuery.data?.title}</Title>
      <Paragraph>这是一个blah blah blah活动。。。</Paragraph>
      <Button type="primary">
        <Link to={getRoutes.registration(eventId)}>填写资料</Link>
      </Button>
    </div>
  );
};

export default Welcome;
