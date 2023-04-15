import { Box, IconButton } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import React from "react";
import Paths from "../../paths";
import { useNavigate, useParams } from "react-router-dom";

const Wrapper = ({
  children,
  noNav,
}: {
  children: JSX.Element;
  noNav?: boolean;
}) => {
  const { userId } = useParams();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        padding: "2em",
        minHeight: "100vh",
        textAlign: "center",
        marginBottom: "3em",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1em",
          width: "100%",
        }}
      >
        {!noNav && (
          <>
            <IconButton
              sx={{ alignSelf: "flex-end" }}
              color="primary"
              component="label"
              onClick={() => navigate(Paths.userHome(userId))}
            >
              <AccountCircle />
            </IconButton>
          </>
        )}
      </Box>
      {children}
    </Box>
  );
};

export default Wrapper;
