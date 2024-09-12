import React, { useCallback, useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { userApi } from "../api";
import { useMutation } from "react-query";
import { Box, Button, TextField } from "@mui/material";
import { useSnackbarState } from "./GlobalContext";
import { HTTPError } from "ky";
import * as Yup from "yup";
import { routes } from "../routes";

type SignupType = {
  phoneNumber: string;
  code: string;
};

const validationSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .min(11, "请填写正确手机号")
    .max(11, "请填写正确手机号")
    .matches(/^[0-9]+$/, "请填写正确手机号")
    .required("请填写正确手机号"),
  code: Yup.string()
    .min(4, "请填写四位验证码")
    .max(4, "请填写四位验证码")
    .matches(/^[0-9]+$/, "请填写四位验证码")
    .required("请填写四位验证码"),
});

const LoginOrSignUp = () => {
  const { eventId = "" } = useParams();

  const codeMutation = useMutation(userApi.getPhoneCode);
  const loginSignupMutation = useMutation(
    userApi.loginOrSignupUserAndJoinEvent
  );
  const [codeRequestedAt, setCodeRequestedAt] = useState(0);

  const { setSnackBarContent } = useSnackbarState();
  const navigate = useNavigate();
  const formik = useFormik<SignupType>({
    initialValues: {
      phoneNumber: "",
      code: "",
    },
    onSubmit: async () => {
      await loginSignup();
    },
    validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
  });
  const getCode = useCallback(async () => {
    if (
      await formik
        .setFieldTouched("phoneNumber", true, true)
        .then((err) => !!err?.hasOwnProperty("phoneNumber"))
    )
      return;

    codeMutation
      .mutateAsync({
        phoneNumber: formik.values.phoneNumber?.toString() ?? "",
      })
      .then(() => {
        setSnackBarContent("验证码获取成功");
        setCodeRequestedAt(new Date().getTime());
      })
      .catch(async (err) => {
        if (
          err instanceof HTTPError &&
          (await err.response.json()).error === "code not expire yet"
        ) {
          const waitTimeInSecond = codeRequestedAt
            ? 100 - +((new Date().getTime() - codeRequestedAt) / 1000).toFixed()
            : 100;
          setSnackBarContent(
            `请耐心等待验证码信息，如${waitTimeInSecond}秒内没收到，可点击重试`
          );
        }
      });
  }, [codeMutation, codeRequestedAt, formik, setSnackBarContent]);

  const loginSignup = useCallback(
    () =>
      loginSignupMutation
        .mutateAsync({
          phoneNumber: formik.values.phoneNumber?.toString() ?? "",
          code: formik.values.code?.toString() ?? "",
          eventId,
        })
        .then((user) => navigate(routes.userHome(eventId)))
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
        value={formik.values.phoneNumber}
        type="number"
        onChange={formik.handleChange}
        error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <TextField
          label="验证码"
          name="code"
          value={formik.values.code}
          type="number"
          sx={{ flex: ".9" }}
          onChange={(ev) =>
            formik.setFieldValue("code", ev.target.value.slice(0, 4))
          }
          error={formik.touched.code && Boolean(formik.errors.code)}
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
