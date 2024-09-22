import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../routes";
import { userApi } from "../api";
import {
  Box,
  Button,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import * as Yup from "yup";
import { useAuthState } from "./AuthProvider";
import { DateField } from "@mui/x-date-pickers/DateField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import LoadingButton from "@mui/lab/LoadingButton";

const validationSchema = Yup.object().shape({
  jobTitle: Yup.string().max(20, "最长20个字").required("请填写职业"),
  monthAndYearOfBirth: Yup.string()
    .matches(/^\d{4}\/\d{2}$/, "格式不正确，应为yyyy/mm")
    .required("请填写出生年月"),
  graduatedFrom: Yup.string().max(20, "最长20个字").required("请填写毕业院校"),
  gender: Yup.string().oneOf(["male", "female"]).required("暂不支持LGBTQ"),
  name: Yup.string().max(20, "最长20个字").required("请填写昵称"),
});

const UserProfile = () => {
  const { user, refetchMe } = useAuthState();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: user!.name || "",
      gender: user!.gender || "",
      jobTitle: user!.jobTitle || "",
      monthAndYearOfBirth: user!.monthAndYearOfBirth || "",
      graduatedFrom: user!.graduatedFrom || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      await userApi.updateUserProfile({
        ...values,
      });
      refetchMe();
      navigate(routes.eventHome(eventId));
    },
    validateOnBlur: true,
    validateOnChange: false,
  });
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
        "& > *": { marginBottom: "1rem !important" },
        "& .Mui-error.MuiFormHelperText-root, & .MuiFormHelperText-root": {
          color: (theme) => theme.palette.grey[700],
          fontSize: "0.75rem",
        },
      }}
    >
      <TextField
        label="昵称"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        helperText={formik.errors.name}
      />
      <div>
        <RadioGroup
          row
          name="gender"
          onChange={formik.handleChange}
          value={formik.values.gender}
        >
          <FormControlLabel
            value="female"
            control={<Radio disabled={formik.values.gender !== undefined} />}
            label="女生"
          />
          <FormControlLabel
            value="male"
            control={<Radio disabled={formik.values.gender !== undefined} />}
            label="男生"
          />
        </RadioGroup>
        {formik.errors.gender && (
          <FormHelperText>{formik.errors.gender}</FormHelperText>
        )}
      </div>
      <TextField
        label="职业"
        name="jobTitle"
        type="text"
        value={formik.values.jobTitle}
        onChange={formik.handleChange}
        helperText={formik.errors.jobTitle}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateField
          label="出生年月"
          name="monthAndYearOfBirth"
          format="YYYY/MM"
          value={
            formik.values.monthAndYearOfBirth
              ? dayjs(formik.values.monthAndYearOfBirth)
              : null
          }
          onBlur={(val) => {
            formik.setFieldValue("monthAndYearOfBirth", val.target.value);
          }}
          helperText={formik.errors.monthAndYearOfBirth}
        />
      </LocalizationProvider>
      <TextField
        label="毕业院校"
        name="graduatedFrom"
        type="text"
        value={formik.values.graduatedFrom}
        helperText={formik.errors.graduatedFrom}
        onChange={formik.handleChange}
      />
      <LoadingButton
        sx={{ alignSelf: "center", marginTop: "1rem" }}
        variant="contained"
        loading={formik.isSubmitting}
        type="submit"
        onClick={() => formik.handleSubmit()}
      >
        完成
      </LoadingButton>
    </Box>
  );
};

export default UserProfile;
