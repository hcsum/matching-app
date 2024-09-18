import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import UserLoginOrSignUp from "./components/UserLoginOrSignUp";
import UserBioForm from "./components/UserBio";
import UserProfile from "./components/UserProfile";
import Wrapper from "./components/Wrapper";
import { QueryClient, QueryClientProvider } from "react-query";
import { routes } from "./routes";
import UserPhotos from "./components/UserPhotos";
import UserHome from "./components/UserHome";
import EventCover from "./components/EventCover";
import EventHome from "./components/EventHome";
import { createTheme, ThemeProvider } from "@mui/material";
import { blue, purple, yellow } from "@mui/material/colors";
import { GlobalProvider } from "./components/GlobalContext";
import { getWechatSignature } from "./api/wechat";
import { isWechat, wechatInit } from "./utils/wechat";
import { ErrorBoundary } from "react-error-boundary";
import CheckParticipant from "./components/CheckParticipant";
import ErrorPage from "./components/ErrorPage";

if (isWechat) {
  getWechatSignature(window.location.href).then((res) => {
    wechatInit({
      appId: res.appId,
      timestamp: res.timestamp,
      nonceStr: res.nonceStr,
      signature: res.signature,
    });
  });
}

const router = createBrowserRouter([
  {
    element: (
      <ErrorBoundary fallback={<ErrorPage />}>
        <GlobalProvider>
          <Outlet />
        </GlobalProvider>
      </ErrorBoundary>
    ),
    children: [
      {
        path: "/",
        element: (
          <Wrapper>
            <EventCover />
          </Wrapper>
        ),
      },
      {
        path: routes.eventCover(),
        element: (
          <Wrapper>
            <EventCover />
          </Wrapper>
        ),
      },
      {
        path: routes.eventCheckParticipant(),
        element: (
          <Wrapper>
            <CheckParticipant />
          </Wrapper>
        ),
      },
      {
        path: routes.eventHome(),
        element: (
          <Wrapper>
            <EventHome />
          </Wrapper>
        ),
      },
      {
        path: routes.loginOrSignup(),
        element: (
          <Wrapper>
            <UserLoginOrSignUp />
          </Wrapper>
        ),
      },
      {
        path: routes.userProfile(),
        element: (
          <Wrapper showBack>
            <UserProfile />
          </Wrapper>
        ),
      },
      {
        path: routes.userHome(),
        element: (
          <Wrapper>
            <UserHome />
          </Wrapper>
        ),
      },
      {
        path: routes.userBio(),
        element: (
          <Wrapper showBack>
            <UserBioForm />
          </Wrapper>
        ),
      },
      {
        path: routes.userPhotos(),
        element: (
          <Wrapper showBack>
            <UserPhotos />
          </Wrapper>
        ),
      },
    ],
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {}, // todo: global error handling
    },
  },
});

const theme = createTheme({
  palette: {
    primary: {
      main: purple[600],
    },
    secondary: {
      main: yellow[600],
    },
  },
  typography: {
    fontSize: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          width: "100%",
          padding: 8,
          fontSize: 16,
        },
      },
      variants: [
        {
          props: { variant: "text" },
          style: {
            color: blue[600],
          },
        },
      ],
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: "1.5em",
        },
        h2: {
          fontSize: "1.2em",
        },
        h3: {
          fontSize: "1em",
        },
        h4: {
          fontSize: ".8em",
        },
        h5: {
          fontSize: ".6em",
        },
        h6: {
          fontSize: ".4em",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
