import { useMutation, useQuery } from "react-query";
import {
  getAdminMatchingEvent,
  getAdminMatchingEventParticipants,
  getAdminMatchingEventResult,
  updateMatchingEventSettings,
} from "../api/admin";
import { useParams } from "react-router-dom";
import { useAuthState } from "./AuthProvider";
import {
  Box,
  CardContent,
  Collapse,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import {
  MatchingEventResponse,
  Phase,
  phases,
  phaseTranslations,
} from "../api/matching-event";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandMore from "./ExpandMore";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSnackbarState } from "./GlobalContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const getNextPhase = (currentPhase: Phase): Phase => {
  const currentIndex = phases.indexOf(currentPhase);
  return currentIndex < phases.length - 1
    ? phases[currentIndex + 1]
    : currentPhase;
};

const EventAdminPage = () => {
  const { eventId } = useParams();
  const { user } = useAuthState();
  const { setSnackBarContent } = useSnackbarState();
  const [participantsExpanded, setParticipantsExpanded] = React.useState(false);
  const [resultExpanded, setResultExpanded] = React.useState(false);

  const eventQuery = useQuery(["adminEvent", eventId, user!.id], () => {
    return getAdminMatchingEvent({
      eventId: eventId!,
      userId: user!.id,
    });
  });

  const participantsQuery = useQuery(
    ["adminEventParticipants", eventId, user!.id],
    () => {
      return getAdminMatchingEventParticipants({
        eventId: eventId!,
        userId: user!.id,
      });
    },
    {
      select(data) {
        const males = data.filter((p) => p.gender === "male");
        const females = data.filter((p) => p.gender === "female");
        return { all: data, males, females };
      },
    }
  );

  const eventResultQuery = useQuery(
    ["adminEventResult", eventId, user!.id],
    () => {
      return getAdminMatchingEventResult({
        eventId: eventId!,
        userId: user!.id,
      });
    },
    {
      enabled: resultExpanded,
    }
  );

  const updateEventMutation = useMutation(
    ["adminEventUpdate", eventId, user!.id],
    (values: Partial<MatchingEventResponse>) => {
      return updateMatchingEventSettings({
        eventId: eventId!,
        userId: user!.id,
        data: values,
      });
    },
    {
      onSuccess() {
        setSnackBarContent("更改成功", "success");
        eventQuery.refetch();
      },
      onError() {
        setSnackBarContent("更改失败", "error");
        formik.resetForm();
      },
    }
  );

  const { data: event } = eventQuery;

  const formik = useFormik<
    Pick<
      MatchingEventResponse,
      "choosingStartsAt" | "matchingStartsAt" | "title" | "phase"
      // | "description"
      // | "questionnaire"
    >
  >({
    initialValues: {
      title: event?.title || "",
      choosingStartsAt: event?.choosingStartsAt || "",
      matchingStartsAt: event?.matchingStartsAt || "",
      phase: event?.phase || "INACTIVE",
      // description: event?.description || {},
      // questionnaire: event?.questionnaire || {},
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      const changedValues: Partial<typeof values> = {};

      (Object.keys(values) as Array<keyof typeof values>).forEach((key) => {
        if (values[key] !== eventQuery.data?.[key]) {
          if (key === "phase") {
            changedValues[key] = values[key] as Phase;
          } else {
            changedValues[key] = values[key];
          }
        }
      });

      window.confirm("确定更改吗？") &&
        updateEventMutation.mutate(changedValues);
    },
  });

  return (
    <>
      <Stack spacing={3}>
        <TextField
          disabled={event?.phase !== "INACTIVE"}
          fullWidth
          label="标题"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange("title")}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="开始互选时间"
            ampm={false}
            name="choosingStartsAt"
            views={["year", "month", "day", "hours"]}
            onChange={(val) =>
              formik.setFieldValue("choosingStartsAt", val?.toISOString())
            }
            value={dayjs(formik.values.choosingStartsAt || undefined)}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="互选截止时间"
            name="matchingStartsAt"
            views={["year", "month", "day", "hours"]}
            onChange={(val) =>
              formik.setFieldValue("matchingStartsAt", val?.toString())
            }
            ampm={false}
            value={dayjs(formik.values.matchingStartsAt || undefined)}
          />
        </LocalizationProvider>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">活动阶段</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            value={formik.values.phase}
            onChange={(val) => formik.setFieldValue("phase", val.target.value)}
          >
            {event &&
              phases.map((phase) => (
                <MenuItem
                  key={phase}
                  value={phase}
                  disabled={
                    phase !== event?.phase &&
                    phase !== getNextPhase(event?.phase)
                  }
                >
                  {phaseTranslations[phase]}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <LoadingButton
          onClick={formik.submitForm}
          disabled={!formik.dirty}
          variant="contained"
          loading={formik.isSubmitting}
        >
          更改
        </LoadingButton>
      </Stack>
      <Box mt={3}>
        <Box
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => {
            if (!participantsExpanded) participantsQuery.refetch();
            setParticipantsExpanded(!participantsExpanded);
          }}
        >
          <Typography variant="h2">
            参与者:{participantsQuery.data?.all.length}，女:
            {participantsQuery.data?.females.length}，男:
            {participantsQuery.data?.males.length}
          </Typography>
          <ExpandMore
            expand={participantsExpanded}
            aria-expanded={participantsExpanded}
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </Box>
        <Collapse in={participantsExpanded} timeout="auto" unmountOnExit>
          <CardContent sx={{ display: "flex", justifyContent: "space-around" }}>
            <Box>
              <Typography variant="h3" mb={1}>
                女生
              </Typography>
              {participantsQuery.data?.females.map((p) => (
                <Typography key={p.id} sx={{ display: "flex", mb: 1 }}>
                  {p.name} ({p.eventNumber}){" "}
                  {p.isProfileValid && <CheckCircleIcon color="success" />}
                </Typography>
              ))}
            </Box>
            <Box>
              <Typography variant="h3" mb={1}>
                男生
              </Typography>
              {participantsQuery.data?.males.map((p) => (
                <Typography key={p.id} sx={{ display: "flex", mb: 1 }}>
                  {p.name} ({p.eventNumber})
                  {p.isProfileValid && <CheckCircleIcon color="success" />}
                </Typography>
              ))}
            </Box>
          </CardContent>
        </Collapse>
        <Box
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => {
            setResultExpanded(!resultExpanded);
          }}
        >
          <Typography variant="h2">配对结果</Typography>
          <ExpandMore expand={resultExpanded} aria-expanded={resultExpanded}>
            <ExpandMoreIcon />
          </ExpandMore>
        </Box>
        <Collapse in={resultExpanded} timeout="auto" unmountOnExit>
          <CardContent sx={{ display: "flex", justifyContent: "space-around" }}>
            <Box>
              {eventResultQuery.data?.matches.map((match, index) => (
                <Box key={index}>
                  <Typography>
                    {match[0].name} - {match[1].name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Collapse>
      </Box>
    </>
  );
};

export default EventAdminPage;
