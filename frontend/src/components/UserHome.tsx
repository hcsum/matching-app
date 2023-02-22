import React from "react";
import { useFormik } from "formik";
import { Button, Input, Space, Typography } from "antd";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { userApi } from "../api";

const UserHome = () => {
  const { userId } = useParams();
  const userQuery = useQuery(["user", userId], () =>
    userApi.getUser({ id: userId || "" })
  );
  const formik = useFormik<Record<string, string>>({
    initialValues: userQuery.data?.bio || {},
    onSubmit: async (values) => {
      await userApi.updateBio({ id: userId || "", bio: values });
    },
    enableReinitialize: true,
  });

  const valueEntries = React.useMemo(() => {
    return Object.entries(formik.values);
  }, [formik.values]);

  return <div>user home!</div>;
};

export default UserHome;
