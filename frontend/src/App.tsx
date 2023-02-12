import "./App.css";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import RegistrationForm from "./form/RegistrationForm";
import BioForm from "./form/BioForm";
import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import Welcome from "./welcome";
import Layout from "./layout";
import { Paths } from "./types";
import { QueryClient, QueryClientProvider } from "react-query";

const router = createBrowserRouter([
  {
    path: Paths.HOME,
    element: (
      <Layout>
        <Welcome />
      </Layout>
    ),
  },
  {
    path: Paths.REGISTRATION,
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
    path: Paths.BIO,
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
