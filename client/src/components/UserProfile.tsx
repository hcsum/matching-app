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
  FormHelperText,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  jobTitle: Yup.string().max(20, "最长20个字").required("请填写职业"),
  age: Yup.number().min(1, "请填写年龄").required("请填写年龄"),
  gender: Yup.string().oneOf(["male", "female"]).required("暂不支持LGBTQ"),
  name: Yup.string().max(20, "最长20个字").required("请填写昵称"),
});

const UserProfile = () => {
  const { userId = "" } = useParams();
  const userQuery = useQuery(["user", userId], () =>
    userApi.getUser({ id: userId || "" })
  );

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: userQuery.data?.name ?? "",
      gender: userQuery.data?.gender ?? "",
      jobTitle: userQuery.data?.jobTitle ?? "",
      age: userQuery.data?.age ?? 0,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      const result = await userApi.updateUserProfile({ ...values, id: userId });
      navigate(Paths.userHome(result.id));
    },
    validateOnBlur: true,
    validateOnChange: true,
  });
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
        "& > *": { marginBottom: "1rem !important" },
      }}
    >
      <TextField
        label="昵称"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        helperText={formik.errors.name}
      />
      <div>
        <RadioGroup
          row
          name="gender"
          onChange={formik.handleChange}
          value={formik.values.gender}
        >
          <FormControlLabel value="female" control={<Radio />} label="女生" />
          <FormControlLabel value="male" control={<Radio />} label="男生" />
        </RadioGroup>
        {formik.errors.gender && (
          <FormHelperText>{formik.errors.gender}</FormHelperText>
        )}
      </div>
      <TextField
        label="职业"
        name="jobTitle"
        type="text"
        value={formik.values.jobTitle}
        helperText={formik.errors.jobTitle}
        onChange={formik.handleChange}
      />
      <TextField
        label="年龄"
        name="age"
        type="number"
        value={formik.values.age}
        helperText={formik.errors.age}
        onChange={formik.handleChange}
      />
      <Button
        sx={{ alignSelf: "center", marginTop: "1rem" }}
        variant="contained"
        type="submit"
        onClick={() => formik.handleSubmit()}
      >
        完成
      </Button>
    </Box>
  );
};

export default UserProfile;
