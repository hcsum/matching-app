import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProfileForm from "./profile-form";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "/profile-form",
    element: <ProfileForm />,
  },
]);

function App() {
  return (
    <div className="App">
      hahah
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
