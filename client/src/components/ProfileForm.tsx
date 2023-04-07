import React from "react";
import { useFormik } from "formik";
import { Button, Input, Radio, Space } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import Paths from "../paths";
import { userApi } from "../api";
import { useQuery } from "react-query";

const ProfileForm = () => {
  const { eventId, userId = "" } = useParams();
  const userQuery = useQuery(["user", userId], () =>
    userApi.getUser({ id: userId || "" })
  );

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: userQuery.data?.name || "",
      gender: userQuery.data?.gender || "",
      jobTitle: userQuery.data?.jobTitle || "",
      age: userQuery.data?.age || 26,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      const result = await userApi.updateUser({ ...values, id: userId });
      navigate(Paths.userBio(result.id));
    },
  });
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Input
        addonBefore="昵称"
        id="name"
        name="name"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.name}
      />
      <Space.Compact block>
        <Radio.Group
          name="gender"
          onChange={formik.handleChange}
          style={{ margin: 8, marginBottom: 16 }}
          value={formik.values.gender}
        >
          <Radio value="male" name="gender">
            男生
          </Radio>
          <Radio value="female" name="gender">
            女生
          </Radio>
        </Radio.Group>
      </Space.Compact>

      <Input
        addonBefore="职业"
        id="jobTitle"
        name="jobTitle"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.jobTitle}
      />

      <Input
        addonBefore="年龄"
        id="age"
        name="age"
        type="number"
        onChange={formik.handleChange}
        value={formik.values.age}
      />

      <Button type="primary" onClick={() => formik.handleSubmit()}>
        保存
      </Button>
    </Space>
  );
};

export default ProfileForm;
