import React, { useMemo } from "react";
import { useFormik } from "formik";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { matchingEventApi, userApi } from "../api";
import Paths from "../getPaths";

const PickingPage = () => {
  const { userId, eventId } = useParams();
  const matchingEventQuery = useQuery(["matching-event", userId, eventId], () =>
    matchingEventApi.getMatchingEventForUser(eventId || "", userId || "")
  );

  if (matchingEventQuery.isLoading) return <>加载中</>;

  return (
    <>
      <div>互选中</div>
      <div>
        {matchingEventQuery.data?.participants.map((p) => (
          <>
            <div>{p.name}</div>
            <div>{p.age}</div>
            <div>{p.jobTitle}</div>
          </>
        ))}
      </div>
    </>
  );
};

export default PickingPage;
