import React from "react";
import { useFormik } from "formik";
import { Button, Input } from "antd";
import Layout from "../layout";
import "./styles.css";
import { addUser } from "../api/user";

// type FormValues = {
//   email: string;
//   password: string;
// };

// type FormErrors = Partial<Record<keyof FormValues, string>>;

const ProfileForm = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      jobTitle: "",
      age: 0,
      tempQuestion1: "",
      tempQuestion2: "",
      tempQuestion3: "",
    },
    onSubmit: async (values) => {
      const result = await addUser();
      console.log(result);
    },
  });
  return (
    <Layout>
      <div className="profile-form">
        <Input
          addonBefore="昵称"
          id="name"
          name="name"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.name}
        />

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

        <Input.TextArea
          placeholder="tempQuestion1"
          id="tempQuestion1"
          name="tempQuestion1"
          onChange={formik.handleChange}
          value={formik.values.tempQuestion1}
        />

        <Button type="primary" onClick={formik.handleSubmit}>
          保存
        </Button>
      </div>
    </Layout>
  );
};

export default ProfileForm;
