import "./App.css";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import RegistrationForm from "./form/RegistrationForm";
import ProfileForm from "./form/ProfileForm";
import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RegistrationForm />,
    // handle: {
    //   crumb: () => {
    //     return (
    //       <Button type="default" icon={<LeftOutlined />}>
    //         <Link to="/">返回</Link>
    //       </Button>
    //     );
    //   },
    // },
  },
  {
    path: "/profile-form",
    element: <ProfileForm />,
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
