import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Paper from "@mui/material/Paper";
import { routes } from "../routes";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthState } from "./AuthProvider";

const BottomNavBar = () => {
  const [value, setValue] = React.useState<string>();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isParticipant } = useAuthState();

  React.useEffect(() => {
    console.log(location.pathname);
    setValue(location.pathname);
  }, [eventId, location.pathname]);

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        pb: 1.5,
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          console.log("onChange", newValue);
          // setValue(newValue);
          navigate(newValue);
        }}
      >
        <BottomNavigationAction
          label="进行中"
          value={isParticipant && eventId ? routes.eventHome(eventId) : "/"}
          icon={<HourglassTopIcon />}
        />
        <BottomNavigationAction
          label="我的"
          value={routes.userHome(eventId)}
          icon={<PersonOutlineIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNavBar;
