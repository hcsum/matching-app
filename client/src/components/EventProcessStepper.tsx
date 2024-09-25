import Box from "@mui/material/Box";
import { MatchingEventResponse, Phase } from "../api/matching-event";
import Steps from "antd/es/steps";

const PHASE_STEP_MAP: Record<Phase, number> = {
  INACTIVE: 0,
  ENROLLING: 0,
  CHOOSING: 1,
  MATCHING: 2,
  FINISHED: 3,
};

const stepsBase = [
  {
    title: "报名阶段",
    description: `填写个人资料`,
  },
  {
    title: "互选阶段",
  },
  {
    title: "配对阶段",
    description: `通知配对结果，并进行反选与坚持环节`,
  },
  {
    title: "CP阶段",
    description: "可选择执行线上线下CP任务",
  },
];

export default function VerticalLinearStepper({
  event,
}: {
  event: MatchingEventResponse;
}) {
  const activeStep = PHASE_STEP_MAP[event.phase];
  const steps = stepsBase.map((it) => {
    if (it.title === "报名阶段") {
      it.description = `于${event.choosingStartsAt}截止，需在此之前完成资料上传`;
    }
    if (it.title === "互选阶段") {
      it.description = `于${event.matchingStartsAt}结束`;
    }
    return it;
  });

  return (
    <Box sx={{ width: "100%" }}>
      <Steps direction="vertical" current={activeStep} items={steps} />
    </Box>
  );
}
