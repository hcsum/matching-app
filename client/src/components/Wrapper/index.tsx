import { Alert, Box, IconButton, Snackbar } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import React, { ReactNode, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSnackbarState } from "../GlobalContext";
import { AuthProvider, useAuthState } from "../AuthProvider";
import BottomNavBar from "../BottomNavBar";

type Props = {
  children: ReactNode;
  showUser?: boolean;
  showBack?: boolean;
};

const Wrapper = ({ children, showUser, showBack }: Props) => {
  const navigate = useNavigate();
  const { snackBarContent, setSnackBarContent } = useSnackbarState();
  const { user } = useAuthState();

  return (
    <>
      <Box
        sx={{
          padding: "2em",
          minHeight: "110vh",
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
        </Box>
        {children}
        {user && <BottomNavBar />}
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

const withAuth = (WrappedComponent: React.ComponentType<Props>) => {
  return (props: Props) => (
    <AuthProvider>
      <WrappedComponent {...props} />
    </AuthProvider>
  );
};

const WrapperWithAuth = withAuth(Wrapper);

export default WrapperWithAuth;
