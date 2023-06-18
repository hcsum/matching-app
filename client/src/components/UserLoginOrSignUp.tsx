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
import { useSnackbarState } from "./GlobalContext";
import { HTTPError } from "ky";

const LoginOrSignUp = () => {
  const { eventId = "" } = useParams();

  const codeMutation = useMutation(userApi.getPhoneCode);
  const loginSignupMutation = useMutation(
    userApi.loginOrSignupUserAndJoinEvent
  );

  const { setSnackBarContent } = useSnackbarState();
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
      await loginSignup();
    },
  });
  const getCode = useCallback(
    () =>
      codeMutation
        .mutateAsync({
          phoneNumber: formik.values.phoneNumber?.toString() ?? "",
        })
        .then(() => setSnackBarContent("验证码获取成功"))
        .catch(async (err) => {
          if (err instanceof HTTPError) {
            if ((await err.response.json()).error === "code not expire yet")
              setSnackBarContent(
                "请耐心等待验证码信息，如100秒内没收到，可点击重试"
              );
          }
        }),
    [codeMutation, formik.values.phoneNumber, setSnackBarContent]
  );
  const loginSignup = useCallback(
    () =>
      loginSignupMutation
        .mutateAsync({
          phoneNumber: formik.values.phoneNumber?.toString() ?? "",
          code: formik.values.code?.toString() ?? "",
          eventId,
        })
        .then((user) => navigate(Paths.userHome(user.id)))
        .catch(async (err) => {
          if (err instanceof HTTPError) {
            if ((await err.response.json()).error === "fail to verify")
              setSnackBarContent("验证失败，请检查是否填写正确");
          }
        }),
    [
      eventId,
      formik.values.code,
      formik.values.phoneNumber,
      loginSignupMutation,
      navigate,
      setSnackBarContent,
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
          onChange={(ev) =>
            formik.setFieldValue("code", ev.target.value.slice(0, 4))
          }
          value={formik.values.code}
        />
        <Button
          variant="outlined"
          color="info"
          disabled={!formik.values.phoneNumber}
          onClick={getCode}
        >
          获取
        </Button>
      </Box>
      <Button
        sx={{ alignSelf: "center", marginTop: "1rem" }}
        variant="contained"
        disabled={!formik.values.code || !formik.values.phoneNumber}
        onClick={() => formik.handleSubmit()}
      >
        完成
      </Button>
    </Box>
  );
};

export default LoginOrSignUp;
