import React from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import Paths from "../paths";
import { userApi } from "../api";
import { useQuery } from "react-query";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";

const SignUp = () => {
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
      age: userQuery.data?.age || 0,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      const result = await userApi.updateUserProfile({ ...values, id: userId });
      navigate(Paths.userHome(result.id));
    },
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
        id="name"
        name="name"
        onChange={formik.handleChange}
        value={formik.values.name}
      />
      <RadioGroup
        row
        name="gender"
        id="gender"
        onChange={formik.handleChange}
        value={formik.values.gender}
      >
        <FormControlLabel value="female" control={<Radio />} label="女生" />
        <FormControlLabel value="male" control={<Radio />} label="男生" />
      </RadioGroup>
      <TextField
        label="职业"
        id="jobTitle"
        name="jobTitle"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.jobTitle}
      />
      <TextField
        label="年龄"
        id="age"
        name="age"
        type="number"
        onChange={formik.handleChange}
        value={formik.values.age}
      />
      <Button
        sx={{ alignSelf: "center", marginTop: "1rem" }}
        variant="contained"
        onClick={() => formik.handleSubmit()}
      >
        完成
      </Button>
    </Box>
  );
};

export default SignUp;
