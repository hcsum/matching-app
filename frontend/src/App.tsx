import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm";
import BioForm from "./components/BioForm";
import Wrapper from "./components/Wrapper";
import { QueryClient, QueryClientProvider } from "react-query";
import Welcome from "./components/Welcome";
import Paths from "./getPaths";
import UserHome from "./components/UserHome";

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
    path: Paths.registration(),
    element: (
      <Wrapper>
        <RegistrationForm />
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
        <div>找不到你的活动哦</div>
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
