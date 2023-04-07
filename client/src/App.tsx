import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProfileForm from "./components/ProfileForm";
import BioForm from "./components/UserBio";
import Wrapper from "./components/Wrapper";
import { QueryClient, QueryClientProvider } from "react-query";
import Paths from "./paths";
import UserPhotos from "./components/UserPhotos";
import UserHome from "./components/UserHome";
import Welcome from "./components/Welcome";
import PickingPhasePage from "./components/PhaseChoosing";
import ProfilePhasePage from "./components/PhaseEnrolling";
import EventHome from "./components/EventHome";

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
        <ProfilePhasePage />
      </Wrapper>
    ),
  },
  {
    path: Paths.choosingPhase(),
    element: (
      <Wrapper>
        <PickingPhasePage />
      </Wrapper>
    ),
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </div>
  );
}

export default App;
