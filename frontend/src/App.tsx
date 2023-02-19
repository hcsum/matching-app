import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm";
import BioForm from "./components/BioForm";
import Layout from "./components/layout";
import { QueryClient, QueryClientProvider } from "react-query";
import Welcome from "./components/Welcome";
import Paths from "./getPaths";

const router = createBrowserRouter([
  {
    path: Paths.home(),
    element: (
      <Layout noNav>
        <Welcome />
      </Layout>
    ),
  },
  {
    path: Paths.registration(),
    element: <RegistrationForm />,
  },
  {
    path: Paths.bio(),
    element: <BioForm />,
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
