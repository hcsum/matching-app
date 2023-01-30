import React from "react";
import { useFormik } from "formik";
import { Input } from "antd";

// type FormValues = {
//   email: string;
//   password: string;
// };

// type FormErrors = Partial<Record<keyof FormValues, string>>;

const Basic = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      jobTitle: "",
      age: 26,
      tempQuestion1: "",
      tempQuestion2: "",
      tempQuestion3: "",
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <div>
      {/* <form onSubmit={formik.handleSubmit}> */}
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
        id="tempQuestion1"
        name="tempQuestion1"
        onChange={formik.handleChange}
        value={formik.values.tempQuestion1}
      />

      <button type="submit">Submit</button>
    </div>
  );
};

export default Basic;
