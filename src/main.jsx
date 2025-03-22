import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Roadmap from "./roadmap/roadmap";
import { BrowserRouter, Route, Routes } from "react-router";
import { StrictMode } from "react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/roadmap" element={<Roadmap />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
