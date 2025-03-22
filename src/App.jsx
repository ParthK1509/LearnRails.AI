import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home/home";
import RoadmapPage from "./roadmap/roadmap";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
      </Routes>
    </Router>
  );
}

export default App;
