import { useQuery } from "react-query";
import { getAllMatchingEvents } from "../api/matching-event";
import { Box, Link, Typography } from "@mui/material";
import { routes } from "../routes";
import { toChineseDateTime } from "../utils/get-formatted-date-time-string";

const EVENT_PHASE_MAP = {
  INACTIVE: "未开始",
  ENROLLING: "报名中",
  CHOOSING: "互选中",
  MATCHING: "结果公布",
  FINISHED: "已结束",
};

const AllEvents = () => {
  const allEventsQuery = useQuery(
    ["getAllMatchingEvents"],
    getAllMatchingEvents
  );
  return (
    <Box>
      <Typography variant="h1">所有活动</Typography>
      <Box>
        {allEventsQuery.data?.map((event) => (
          <Box key={event.id} mb={2}>
            <Link href={routes.eventCover(event.id)}>
              <Typography color="primary" fontWeight={700}>
                {event.title}
              </Typography>
            </Link>
            <Typography>阶段： {EVENT_PHASE_MAP[event.phase]}</Typography>
            <Typography>
              开始时间：{toChineseDateTime(event.choosingStartsAt)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AllEvents;
