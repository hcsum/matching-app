import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProfileForm from "./components/ProfileForm";
import BioForm from "./components/BioForm";
import Wrapper from "./components/wrapper";
import { QueryClient, QueryClientProvider } from "react-query";
import Welcome from "./components/Welcome";
import Paths from "./getPaths";
import UploadPhotos from "./pages/upload-photos/UploadPhotos";

import UserHome from "./components/UserHome";
import Login from "./components/Login";

const router = createBrowserRouter([
  {
    path: Paths.home(),
    element: (
      <Wrapper noNav>
        <Welcome />
      </Wrapper>
    ),
  },
  {
    path: Paths.profile(),
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
    path: Paths.bio(),
    element: (
      <Wrapper>
        <BioForm />
      </Wrapper>
    ),
  },
  {
    path: "/",
    element: (
      <Wrapper noNav>
        <Login />
      </Wrapper>
    ),
  },
  {
    path: Paths.uploadPhoto(),
    element: (
      <Wrapper>
        <UploadPhotos />
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
