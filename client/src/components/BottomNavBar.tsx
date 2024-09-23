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
  const [value, setValue] = React.useState<number>();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isParticipant } = useAuthState();

  React.useEffect(() => {
    if (location.pathname.endsWith("user")) {
      setValue(1);
    } else setValue(0);
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
          if (newValue === 0)
            navigate(
              isParticipant && eventId ? routes.eventHome(eventId) : "/"
            );
          else navigate(routes.userHome(eventId));
        }}
      >
        {isParticipant && (
          <BottomNavigationAction
            label="进行中"
            value={0}
            icon={<HourglassTopIcon />}
          />
        )}
        <BottomNavigationAction
          label="我的"
          value={1}
          icon={<PersonOutlineIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNavBar;
