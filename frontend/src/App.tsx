import "./App.css";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import RegistrationForm from "./form";
import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "/registration",
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
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
