import React from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { userApi } from "../api";
import Paths from "../paths";
import { Box, Button, TextareaAutosize, Typography } from "@mui/material";

const UserBio = () => {
  const { userId, eventId } = useParams();
  const navigate = useNavigate();
  const userQuery = useQuery(["user", userId], () =>
    userApi.getUser({ id: userId || "" })
  );
  const updateBioMutation = useMutation(
    (values: Record<string, string>) =>
      userApi.updateUserProfile({ id: userId || "", bio: values }),
    {
      onSuccess(result) {
        navigate(Paths.eventHome(eventId, userId));
      },
    }
  );
  const formik = useFormik<Record<string, string>>({
    initialValues: userQuery.data?.bio || {},
    onSubmit: async (values) => {
      await updateBioMutation.mutateAsync(values);
    },
    enableReinitialize: true,
  });

  const valueEntries = React.useMemo(() => {
    return Object.entries(formik.values);
  }, [formik.values]);

  return (
    <Box sx={{ width: "100%" }}>
      {valueEntries.map(([key, value]) => {
        return (
          <div key={key}>
            <Typography>{key}</Typography>
            <TextareaAutosize
              name={key}
              minRows={4}
              onChange={formik.handleChange}
              value={value}
              style={{ width: "100%" }}
            />
          </div>
        );
      })}
      <Button variant="contained" onClick={() => formik.handleSubmit()}>
        完成
      </Button>
    </Box>
  );
};

export default UserBio;
