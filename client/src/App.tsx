import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserLoginOrSignUp from "./components/UserLoginOrSignUp";
import BioForm from "./components/UserBio";
import Wrapper from "./components/Wrapper";
import { QueryClient, QueryClientProvider } from "react-query";
import Paths from "./paths";
import UserPhotos from "./components/UserPhotos";
import UserHome from "./components/UserHome";
import Welcome from "./components/Welcome";
import EventHome from "./components/EventHome";
import { createTheme, ThemeProvider } from "@mui/material";
import { pink, yellow } from "@mui/material/colors";
import { GlobalProvider } from "./components/GlobalContext";

const router = createBrowserRouter([
  {
    path: Paths.welcome(),
    element: (
      <Wrapper>
        <Welcome />
      </Wrapper>
    ),
  },
  {
    path: Paths.eventLandingPage(),
    element: (
      <Wrapper>
        <Welcome />
      </Wrapper>
    ),
  },
  {
    path: Paths.eventHome(),
    element: (
      <Wrapper>
        <EventHome />
      </Wrapper>
    ),
  },
  {
    path: Paths.loginOrSignup(),
    element: (
      <Wrapper showBack>
        <UserLoginOrSignUp />
      </Wrapper>
    ),
  },
  // {
  //   path: Paths.signUp(),
  //   element: (
  //     <Wrapper showUser >
  //       <UserSignUp />
  //     </Wrapper>
  //   ),
  // },
  {
    path: Paths.userHome(),
    element: (
      <Wrapper>
        <UserHome />
      </Wrapper>
    ),
  },
  {
    path: Paths.userBio(),
    element: (
      <Wrapper>
        <BioForm />
      </Wrapper>
    ),
  },
  {
    path: Paths.userPhotos(),
    element: (
      <Wrapper>
        <UserPhotos />
      </Wrapper>
    ),
  },
]);

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    primary: {
      main: yellow[600],
    },
    secondary: {
      main: pink[200],
    },
    action: {
      selected: pink[200],
    },
  },
  typography: {
    fontSize: 12,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <GlobalProvider>
          <RouterProvider router={router} />
        </GlobalProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
