import { Box, IconButton } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import React from "react";
import Paths from "../../paths";

const Wrapper = ({
  children,
  noNav,
}: {
  children: JSX.Element;
  noNav?: boolean;
}) => {
  return (
    <Box sx={{ padding: "1em", height: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1em",
          width: "100%",
        }}
      >
        {
          <>
            {/* <IconButton
              color="primary"
              component="label"
              onClick={() => navigate(-1)}
            >
              <ArrowBackIos />
            </IconButton> */}
            <IconButton
              sx={{ alignSelf: "flex-end" }}
              color="primary"
              component="label"
              onClick={() => Paths.userHome()}
            >
              <AccountCircle />
            </IconButton>
          </>
        }
      </Box>
      {children}
    </Box>
  );
};

export default Wrapper;

