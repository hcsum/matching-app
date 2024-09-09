import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Paper from "@mui/material/Paper";
import { routes } from "../routes";
import { useNavigate, useParams } from "react-router-dom";

const BottomNavBar = () => {
  const [value, setValue] = React.useState(0);
  const { eventId } = useParams();
  const navigate = useNavigate();
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
          console.log(newValue);
          setValue(newValue);
          navigate(newValue);
        }}
      >
        <BottomNavigationAction
          label="进行中"
          value={routes.eventHome(eventId)}
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
