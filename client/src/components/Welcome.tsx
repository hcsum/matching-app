import { Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { matchingEventApi, userApi } from "../api";
import Paths from "../paths";

const Welcome = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const loginSignupMutation = useMutation(userApi.loginOrSignupUser);
  const matchingEventQuery = useQuery(["matching-event", eventId], () =>
    eventId
      ? matchingEventApi.getMatchingEventById(eventId)
      : matchingEventApi.getLatestMatchingEvent()
  );
  const formik = useFormik({
    initialValues: {
      phoneNumber: "",
    },
    onSubmit: async (values) => {
      const result = await loginSignupMutation.mutateAsync(values);
      if (!result.name) navigate(Paths.signUp(result.id));
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
      <Typography variant="h5">{matchingEventQuery.data?.title}</Typography>
      <Typography>
        本活动属于创意脱单系列，兼具线下和线上，融合72小时cp，照骗互选活动的特点，又融入了新的元素，而且对于问卷把控会前所未有的严格，脱单的事情都如此敷衍，划水回答，诡异的照片，是习惯了社会的毒打，想让人感同身受吗？
      </Typography>
      <Typography>
        其实不管朋友或者情侣，多多出门，多多参加活动，机会总会是大点的!
      </Typography>
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
