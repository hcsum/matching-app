import React, { useCallback } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import Paths from "../paths";
import { userApi } from "../api";
import { useMutation, useQuery } from "react-query";
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

const LoginOrSignUp = () => {
  const { eventId = "" } = useParams();

  const codeMutation = useMutation(userApi.getPhoneCode);
  const loginSignupMutation = useMutation(
    userApi.loginOrSignupUserAndJoinEvent
  );

  const navigate = useNavigate();
  const formik = useFormik<{
    phoneNumber: number | undefined;
    code: number | undefined;
  }>({
    initialValues: {
      phoneNumber: undefined,
      code: undefined,
    },
    onSubmit: async () => {
      const user = await loginSignup();
      navigate(Paths.userHome(user.id));
    },
  });
  const getCode = useCallback(
    () =>
      codeMutation.mutateAsync({
        phoneNumber: formik.values.phoneNumber?.toString() ?? "",
      }),
    [codeMutation, formik.values.phoneNumber]
  );
  const loginSignup = useCallback(
    () =>
      loginSignupMutation.mutateAsync({
        phoneNumber: formik.values.phoneNumber?.toString() ?? "",
        code: formik.values.code?.toString() ?? "",
        eventId,
      }),
    [
      eventId,
      formik.values.code,
      formik.values.phoneNumber,
      loginSignupMutation,
    ]
  );

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
        label="手机号码"
        name="phoneNumber"
        type="number"
        onChange={formik.handleChange}
        value={formik.values.phoneNumber}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <TextField
          label="验证码"
          name="code"
          type="number"
          sx={{ flex: ".9" }}
          onChange={formik.handleChange}
          value={formik.values.code}
        />
        <Button variant="outlined" color="info" onClick={getCode}>
          获取
        </Button>
      </Box>
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

export default LoginOrSignUp;
