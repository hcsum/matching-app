import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProfileForm from "./components/ProfileForm";
import BioForm from "./components/UserBio";
import Wrapper from "./components/Wrapper";
import { QueryClient, QueryClientProvider } from "react-query";
import Paths from "./paths";
import UserPhotos from "./components/UserPhotos";
import UserHome from "./components/UserHome";
import Welcome from "./components/Welcome";
import PhaseChoosing from "./components/PhaseChoosing";
import PhaseEnrolling from "./components/PhaseEnrolling";
import EventHome from "./components/EventHome";
import { createTheme, ThemeProvider } from "@mui/material";
import { pink, yellow } from "@mui/material/colors";
import PhaseMatching from "./components/PhaseMatching";

const router = createBrowserRouter([
  {
    path: Paths.welcome(),
    element: (
      <Wrapper noNav>
        <Welcome />
      </Wrapper>
    ),
  },
  {
    path: Paths.eventLandingPage(),
    element: (
      <Wrapper noNav>
        <Welcome />
      </Wrapper>
    ),
  },
  {
    path: Paths.eventHome(),
    element: (
      <Wrapper noNav>
        <EventHome />
      </Wrapper>
    ),
  },
  {
    path: Paths.signUp(),
    element: (
      <Wrapper noNav>
        <ProfileForm />
      </Wrapper>
    ),
  },
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
  {
    path: Paths.enrollingPhase(),
    element: (
      <Wrapper>
        <PhaseEnrolling />
      </Wrapper>
    ),
  },
  {
    path: Paths.choosingPhase(),
    element: (
      <Wrapper>
        <PhaseChoosing />
      </Wrapper>
    ),
  },
  {
    path: Paths.matchingPhase(),
    element: (
      <Wrapper>
        <PhaseMatching />
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
