import React from "react";
import { useFormik } from "formik";
import { Button, Input, Space, Typography } from "antd";
import Layout from "../layout";
import { addUser } from "../api/user";

const ProfileForm = () => {
  const formik = useFormik({
    initialValues: {
      有什么业余兴趣爱好: "",
      你的理想型: "",
      关于你: "",
    },
    onSubmit: async (values) => {
      // const result = await addUser(values);
      console.log(values);
    },
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
        <Button type="primary" onClick={formik.handleSubmit}>
          保存
        </Button>
      </Space>
    </Layout>
  );
};

export default ProfileForm;
