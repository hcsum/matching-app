import React from "react";
import { useFormik } from "formik";
import { Button, Input, Space, Typography } from "antd";
import Layout from "./Layout";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { userApi } from "../api";

const BioForm = () => {
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

  return (
    <Layout>
      <Space direction="vertical" style={{ width: "100%" }}>
        {valueEntries.map(([key, value]) => {
          return (
            <div key={key}>
              <Typography.Paragraph
                style={{ textAlign: "left", marginBottom: ".5em" }}
              >
                {key}
              </Typography.Paragraph>
              <Input.TextArea
                name={key}
                onChange={formik.handleChange}
                value={value}
              />
            </div>
          );
        })}
        <Button
          htmlType="submit"
          type="primary"
          onClick={() => formik.handleSubmit()}
        >
          保存
        </Button>
      </Space>
    </Layout>
  );
};

export default BioForm;
