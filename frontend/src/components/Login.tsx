import { Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api";
import Paths from "../getPaths";

const Login = () => {
  const loginMutation = useMutation(userApi.loginUser);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      phoneNumber: "",
    },
    onSubmit: async (values) => {
      const result = await loginMutation.mutateAsync(values);
      navigate(Paths.userHome(result.id));
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        "& > *, .MuiTypography-root": {
          marginBottom: "2em",
        },
      }}
    >
      <Typography variant="body1">找不到你的活动哦</Typography>
      <Typography variant="body1">如果已经加入了活动，请登陆</Typography>
      <TextField
        sx={{ marginBottom: ".5em" }}
        name="phoneNumber"
        label="手机号码"
        onChange={formik.handleChange}
        variant="outlined"
        value={formik.values.phoneNumber}
      />
      <Button variant="contained" onClick={() => formik.handleSubmit()}>
        登陆
      </Button>
    </Box>
  );
};

export default Login;
