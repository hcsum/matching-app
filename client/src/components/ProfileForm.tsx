import React from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import Paths from "../paths";
import { userApi } from "../api";
import { useQuery } from "react-query";
import {
  Box,
  Button,
  FormControlLabel,
  Input,
  Radio,
  RadioGroup,
} from "@mui/material";

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
    <Box sx={{ width: "100%" }}>
      <Input
        // addonBefore="昵称"
        id="name"
        name="name"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.name}
      />
      <Box>
        <RadioGroup
          row
          name="gender"
          onChange={formik.handleChange}
          style={{ margin: 8, marginBottom: 16 }}
          value={formik.values.gender}
        >
          <FormControlLabel value="female" control={<Radio />} label="女生" />
          <FormControlLabel value="male" control={<Radio />} label="男生" />
        </RadioGroup>
      </Box>

      <Input
        // addonBefore="职业"
        id="jobTitle"
        name="jobTitle"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.jobTitle}
      />

      <Input
        // addonBefore="年龄"
        id="age"
        name="age"
        type="number"
        onChange={formik.handleChange}
        value={formik.values.age}
      />

      <Button variant="contained" onClick={() => formik.handleSubmit()}>
        完成
      </Button>
    </Box>
  );
};

export default ProfileForm;
