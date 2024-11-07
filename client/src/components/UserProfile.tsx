import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../routes";
import { userApi } from "../api";
import {
  Box,
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
  dateOfBirth: Yup.string()
    .matches(/^\d{4}\/\d{2}\/\d{2}$/, "格式不正确，应为yyyy/mm/dd")
    .required("请填写出生年月日"),
  graduatedFrom: Yup.string().max(20, "最长20个字"),
  gender: Yup.string().oneOf(["male", "female"]).required("暂不支持LGBTQ"),
  name: Yup.string().max(20, "最长20个字").required("请填写昵称"),
  height: Yup.number().min(100, "不对吧？").max(250, "不对吧？"),
  hometown: Yup.string().max(20, "最长20个字"),
  mbti: Yup.string().test(
    "is-valid-mbti",
    "MBTI格式不正确，应为有效的4字母组合（如INTJ）",
    (value) => {
      if (!value) return true;
      return validateMBTI(value);
    }
  ),
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
      dateOfBirth: user!.dateOfBirth || "",
      height: user!.height || "",
      hometown: user!.hometown || "",
      graduatedFrom: user!.graduatedFrom || "",
      mbti: user!.mbti || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await userApi.updateUserProfile({
        data: {
          ...values,
          height: Number(values.height),
          mbti: values.mbti.toUpperCase(),
        },
        userId: user!.id,
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
          <FormControlLabel value="female" control={<Radio />} label="女生" />
          <FormControlLabel value="male" control={<Radio />} label="男生" />
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
          name="dateOfBirth"
          format="YYYY/MM/DD"
          value={
            formik.values.dateOfBirth ? dayjs(formik.values.dateOfBirth) : null
          }
          onBlur={(val) => {
            formik.setFieldValue("dateOfBirth", val.target.value);
          }}
          helperText={formik.errors.dateOfBirth}
        />
      </LocalizationProvider>
      <TextField
        label="身高"
        name="height"
        type="number"
        value={formik.values.height}
        helperText={formik.errors.height}
        onChange={formik.handleChange}
      />
      <TextField
        label="毕业院校"
        name="graduatedFrom"
        type="text"
        value={formik.values.graduatedFrom}
        helperText={formik.errors.graduatedFrom}
        onChange={formik.handleChange}
      />
      <TextField
        label="家乡"
        name="hometown"
        type="text"
        value={formik.values.hometown}
        helperText={formik.errors.hometown}
        onChange={formik.handleChange}
      />
      <TextField
        label="MBTI人格（选填）"
        name="mbti"
        type="text"
        value={formik.values.mbti.toUpperCase()}
        helperText={formik.errors.mbti}
        onChange={formik.handleChange}
      />
      <LoadingButton
        sx={{ alignSelf: "center", marginTop: "1rem" }}
        variant="contained"
        loading={formik.isSubmitting}
        type="submit"
        onClick={() => formik.handleSubmit()}
      >
        保存
      </LoadingButton>
    </Box>
  );
};

function validateMBTI(input: string): boolean {
  // Convert input to uppercase
  const uppercaseInput = input.toUpperCase();

  // Check if the input has exactly 4 characters
  if (uppercaseInput.length !== 4) {
    return false;
  }

  // Define valid options for each position
  const validOptions = [
    ["E", "I"],
    ["S", "N"],
    ["T", "F"],
    ["J", "P"],
  ];

  // Check each character
  for (let i = 0; i < 4; i++) {
    if (!validOptions[i].includes(uppercaseInput[i])) {
      return false;
    }
  }

  // If all checks pass, return the valid MBTI type
  return true;
}

export default UserProfile;
