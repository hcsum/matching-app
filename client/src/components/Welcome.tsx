import { Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { matchingEventApi, userApi } from "../api";
import Paths from "../paths";

const Welcome = () => {
  const { eventId } = useParams();
  const loginSignupMutation = useMutation(userApi.loginOrSignupUser);
  const navigate = useNavigate();
  const matchingEventQuery = useQuery(["matching-event", eventId], () =>
    matchingEventApi.getMatchingEvent(eventId || "")
  );
  const formik = useFormik({
    initialValues: {
      phoneNumber: "",
    },
    onSubmit: async (values) => {
      const result = await loginSignupMutation.mutateAsync(values);
      if (!result.name) navigate(Paths.profileBasic(eventId, result.id));
      else navigate(Paths.userHome(result.id));
    },
  });

  if (matchingEventQuery.isLoading) return <div>加载中。。。</div>;
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
      <Typography variant="h5">Welcome to 三天cp</Typography>
      <Typography variant="h6">{matchingEventQuery.data?.title}</Typography>
      <Typography>这是一个blah blah blah活动。。。</Typography>
      <TextField
        sx={{ marginBottom: ".5em" }}
        name="phoneNumber"
        label="手机号码"
        onChange={formik.handleChange}
        variant="outlined"
        value={formik.values.phoneNumber}
      />
      <Button variant="contained" onClick={() => formik.handleSubmit()}>
        进入活动
      </Button>
    </Box>
  );
};

export default Welcome;
