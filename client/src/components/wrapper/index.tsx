import {
  Alert,
  Box,
  IconButton,
  Link,
  Snackbar,
  Typography,
} from "@mui/material";
import { AccountCircle, ArrowBack } from "@mui/icons-material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbarState } from "../GlobalContext";
import { routes } from "../../routes";

const Wrapper = ({
  children,
  showUser,
  showBack,
}: {
  children: JSX.Element;
  showUser?: boolean;
  showBack?: boolean;
}) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { snackBarContent, setSnackBarContent } = useSnackbarState();

  return (
    <>
      <Box
        sx={{
          padding: "2em",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1em",
            width: "100%",
          }}
        >
          {showBack && (
            <IconButton
              sx={{ alignSelf: "flex-start" }}
              color="primary"
              component="label"
              onClick={() => navigate(-1)}
            >
              <ArrowBack />
            </IconButton>
          )}
          {showUser && userId && (
            <IconButton
              sx={{ alignSelf: "flex-end" }}
              color="primary"
              component="label"
              onClick={() => navigate(routes.userHome(userId))}
            >
              <AccountCircle />
            </IconButton>
          )}
        </Box>
        {children}
        {/* <Box sx={{ width: "100%", position: "absolute", bottom: 0 }}>
          <Link
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noreferrer"
            sx={{ textDecoration: "none" }}
          >
            <Typography variant="body2" color="gray">
              粤ICP备2023059041号
            </Typography>
          </Link>
        </Box> */}
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={Boolean(snackBarContent)}
        onClose={() => setSnackBarContent(undefined)}
      >
        <Alert severity="info">{snackBarContent}</Alert>
      </Snackbar>
    </>
  );
};

export default Wrapper;
