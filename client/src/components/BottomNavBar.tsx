import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
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
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
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
          label="活动主页"
          value={routes.eventCover(eventId)}
          icon={<RestoreIcon />}
        />
        <BottomNavigationAction
          label="进行中"
          value={routes.eventHome(eventId)}
          icon={<FavoriteIcon />}
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
