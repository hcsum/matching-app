import "./App.css";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm";
import BioForm from "./components/BioForm";
import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import Layout from "./components/Layout";
import { QueryClient, QueryClientProvider } from "react-query";
import Welcome from "./components/Welcome";
import Paths from "./getPaths";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Welcome />
      </Layout>
    ),
  },
  {
    path: Paths.home(),
    element: (
      <Layout>
        <Welcome />
      </Layout>
    ),
  },
  {
    path: Paths.registration(),
    element: <RegistrationForm />,
    handle: {
      crumb: () => {
        return (
          <Button type="default" icon={<LeftOutlined />}>
            <Link to="/">返回</Link>
          </Button>
        );
      },
    },
  },
  {
    path: Paths.bio(),
    element: <BioForm />,
    handle: {
      crumb: () => {
        return (
          <Button type="default" icon={<LeftOutlined />}>
            <Link to="/">返回</Link>
          </Button>
        );
      },
    },
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
