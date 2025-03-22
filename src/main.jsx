import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Roadmap from "./roadmap/roadmap";
import Questiontypesselection from "./inputs/questiontypesselection.jsx";
import Experiencetypesselection from "./inputs/exp-level-selection.jsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/roadmap/:topic", element: <Roadmap /> },
  { path: "/input1", element: <Questiontypesselection /> },
  { path: "/input2", element: <Experiencetypesselection /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
