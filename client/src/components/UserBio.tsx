import React, { useMemo } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "react-query";
import { userApi } from "../api";
import { routes } from "../routes";
import { Box, TextareaAutosize, Typography } from "@mui/material";
import { useAuthState } from "./AuthProvider";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import * as Yup from "yup";
import { useGlobalState } from "./GlobalContext";

const UserBio = () => {
  const { user, refetchMe } = useAuthState();
  const { matchingEvent } = useGlobalState();
  const { eventId } = useParams();
  const navigate = useNavigate();

  const validationSchema = useMemo(() => {
    const schemaFields: Record<string, Yup.StringSchema> = {};

    Object.keys(matchingEvent!.questionnaire).forEach((key) => {
      schemaFields[key] = Yup.string().max(200, "最长200个字");
    });

    return Yup.object().shape(schemaFields);
  }, [matchingEvent]);

  const updateBioMutation = useMutation(
    (values: Record<string, string>) =>
      userApi.updateUserProfile({ data: { bio: values }, userId: user!.id }),
    {
      onSuccess(result) {
        refetchMe();
        navigate(routes.eventHome(eventId));
      },
    }
  );

  const initialValues = React.useMemo(() => {
    return assignMatchingKeys(matchingEvent!.questionnaire, user!.bio);
  }, [matchingEvent, user]);

  const formik = useFormik<Record<string, string>>({
    validationSchema,
    initialValues,
    onSubmit: async (values) => {
      await updateBioMutation.mutateAsync(values);
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography sx={{ alignSelf: "flex-start", mb: 2 }}>
        请至少填写两个问题
      </Typography>
      {Object.keys(matchingEvent!.questionnaire).map((key) => {
        return (
          <Box key={key} sx={{ width: "100%", mb: 4 }}>
            <Typography>{key}</Typography>
            <TextareaAutosize
              name={key}
              minRows={4}
              onChange={formik.handleChange}
              value={formik.values[key]}
              style={{ width: "100%" }}
            />
            <Typography
              variant="caption"
              color={formik.errors[key] ? "error" : "textSecondary"}
            >
              最长200个字
            </Typography>
          </Box>
        );
      })}
      <LoadingButton
        loading={updateBioMutation.isLoading}
        variant="contained"
        sx={{ mt: 2 }}
        onClick={() => formik.handleSubmit()}
      >
        保存
      </LoadingButton>
    </Box>
  );
};

function assignMatchingKeys(
  target: Record<string, string>,
  source: Record<string, string>
) {
  const result: Record<string, string> = {};
  Object.keys(target).forEach((key) => {
    if (key in source) {
      result[key] = source[key];
    }
  });
  return result;
}

export default UserBio;
