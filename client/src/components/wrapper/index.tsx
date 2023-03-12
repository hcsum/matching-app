import { Box, IconButton } from "@mui/material";
import { ArrowBackIos, AccountCircle } from "@mui/icons-material";
import React from "react";
import { useNavigate } from "react-router-dom";
import Paths from "../../paths";

const Wrapper = ({
  children,
  noNav,
}: {
  children: JSX.Element;
  noNav?: boolean;
}) => {
  const navigate = useNavigate();
  return (
    <Box sx={{ padding: "1em", height: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1em",
        }}
      >
        {!noNav ?? (
          <>
            <IconButton
              color="primary"
              component="label"
              onClick={() => navigate(-1)}
            >
              <ArrowBackIos />
            </IconButton>
            <IconButton
              sx={{ alignSelf: "flex-end" }}
              color="primary"
              component="label"
              onClick={() => Paths.userHome()}
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
