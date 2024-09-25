import { useQuery } from "react-query";
import { getAllMatchingEvents } from "../api/matching-event";
import { Box, Link, Typography } from "@mui/material";
import { routes } from "../routes";
import { EVENT_PHASE_MAP } from "../const/matching-event";

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
            <Typography>开始时间：{event.choosingStartsAt}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AllEvents;
