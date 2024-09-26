import React from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "react-query";
import { userApi } from "../api";
import { routes } from "../routes";
import { Box, Button, TextareaAutosize, Typography } from "@mui/material";
import { useAuthState } from "./AuthProvider";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";

const UserBio = () => {
  const { user, refetchMe } = useAuthState();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const updateBioMutation = useMutation(
    (values: Record<string, string>) =>
      userApi.updateUserProfile({ bio: values }),
    {
      onSuccess(result) {
        refetchMe();
        navigate(routes.eventHome(eventId));
      },
    }
  );
  const formik = useFormik<Record<string, string>>({
    initialValues: user!.bio || {},
    onSubmit: async (values) => {
      await updateBioMutation.mutateAsync(values);
    },
    enableReinitialize: true,
  });

  const valueEntries = React.useMemo(() => {
    return Object.entries(formik.values);
  }, [formik.values]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {valueEntries.map(([key, value]) => {
        return (
          <Box key={key} sx={{ width: "100%", mb: 4 }}>
            <Typography>{key}</Typography>
            <TextareaAutosize
              name={key}
              minRows={4}
              onChange={formik.handleChange}
              value={value}
              style={{ width: "100%" }}
            />
          </Box>
        );
      })}
      <LoadingButton
        loading={updateBioMutation.isLoading}
        variant="contained"
        sx={{ mt: 2 }}
        onClick={() => formik.handleSubmit()}
      >
        完成
      </LoadingButton>
    </Box>
  );
};

export default UserBio;
