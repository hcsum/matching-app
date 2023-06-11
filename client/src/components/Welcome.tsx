import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { useCallback } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { matchingEventApi, userApi, wechatApi } from "../api";
import Paths from "../paths";
// import wechatInit from "../utils/wechat-init";
// import { shareApp } from "../utils/wechat-share";

// const URL = window.location.href.split("#")[0];
// const URL = "http://shenhiju.club";
// const WECHAT_APP_ID = "wx495e7f8a44c4fd2d";

const Welcome = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const loginSignupMutation = useMutation(userApi.loginOrSignupUser);
  const matchingEventQuery = useQuery(["matching-event", eventId], () =>
    eventId
      ? matchingEventApi.getMatchingEventById(eventId)
      : matchingEventApi.getLatestMatchingEvent()
  );
  // const wechatSignatureQuery = useQuery(
  //   ["wechat-signature", URL],
  //   () => wechatApi.getSignature({ url: URL }),
  //   {
  //     onSuccess: async (res) => {
  //       await wechatInit({
  //         appId: res.appId,
  //         timestamp: res.timestamp,
  //         nonceStr: res.nonceStr,
  //         signature: res.signature,
  //         jsApiList: ["getLocation"],
  //         onReady: () => {
  //           // shareApp({
  //           //   title: "我的自定义标题",
  //           //   desc: "我的自定义描述",
  //           //   link: URL,
  //           //   imgUrl: "https://cdn-icons-png.flaticon.com/256/7749/7749446.png",
  //           // });
  //         },
  //       });
  //     },
  //   }
  // );

  // const handleWechatAuth = useCallback(() => {
  //   window.
  // }, [])

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
      {/* <Link
        href={`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${WECHAT_APP_ID}&redirect_uri=${URL}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`}
      >
        <Button variant="contained">微信登陆</Button>
      </Link> */}
    </Box>
  );
};

export default Welcome;
