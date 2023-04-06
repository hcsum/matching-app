import React, { useMemo } from "react";
import { useFormik } from "formik";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { matchingEventApi, userApi } from "../api";
import Paths, { getMatchingEventPhasePath } from "../paths";

const UserHome = () => {
  const { userId } = useParams();
  const userQuery = useQuery(["user", userId], () =>
    userApi.getUser({ id: userId || "" })
  );
  const matchingEventsQuery = useQuery(["matching-event", userId], () =>
    matchingEventApi.getMatchingEventsByUserId(userId || "")
  );

  if (matchingEventsQuery.isLoading || userQuery.isLoading) return <>加载中</>;

  return (
    <>
      <div>用户主页</div>
      <div>你当前参加的活动：</div>
      {matchingEventsQuery.data?.map((event) => (
        <div key={event.id}>
          <Link to={getMatchingEventPhasePath(event.phase)(event.id, userId)}>
            {event.title}
          </Link>
        </div>
      ))}
      <div>
        <Link to={Paths.enrollingPhase(userId)}>我的资料</Link>
      </div>
      <div>只允许用户进入ta参加的活动中仍在继续的活动</div>
      <div>其实也可以查看参加的往期活动汇总，匹配了多少人之类的</div>
    </>
  );
};

export default UserHome;
