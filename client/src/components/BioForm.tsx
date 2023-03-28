import React from "react";
import { useFormik } from "formik";
import { Button, Input, Space, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { userApi } from "../api";
import Paths from "../paths";

const BioForm = () => {
  const { eventId, userId } = useParams();
  const navigate = useNavigate();
  const userQuery = useQuery(["user", userId], () =>
    userApi.getUser({ id: userId || "" })
  );
  const updateBioMutation = useMutation(
    (values: Record<string, string>) =>
      userApi.updateUser({ id: userId || "", bio: values }),
    {
      onSuccess(result) {
        navigate(Paths.userHome(result.id));
      },
    }
  );
  const formik = useFormik<Record<string, string>>({
    initialValues: userQuery.data?.bio || {},
    onSubmit: async (values) => {
      await updateBioMutation.mutateAsync(values);
    },
    enableReinitialize: true,
  });

  const valueEntries = React.useMemo(() => {
    return Object.entries(formik.values);
  }, [formik.values]);

  return (
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
  );
};

export default BioForm;

