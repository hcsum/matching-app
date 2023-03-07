import React from "react";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { userApi } from "../api";

const UserHome = () => {
  const { userId } = useParams();
  const userQuery = useQuery(["user", userId], () =>
    userApi.getUser({ id: userId || "" })
  );

  return (
    <>
      <div>user home!</div>
      <div>todo: get all user's matching events</div>
    </>
  );
};

export default UserHome;
