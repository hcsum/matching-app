import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RegistrationForm from "./form";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "/registration",
    element: <RegistrationForm />,
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
