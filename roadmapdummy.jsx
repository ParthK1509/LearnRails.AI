import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function RoadmapPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [roadmapData, setRoadmapData] = useState(null);

  useEffect(() => {
    if (location.state?.roadmap) {
      parseRoadmap(location.state.roadmap);
    }
  }, [location.state]);

  const parseRoadmap = (text) => {
    const prerequisiteMatch = text.match(/prerequisite:\s*{([^}]*)}/i);
    const subtopicsMatch = text.match(/subtopics:\s*{([^}]*)}/i);

    const prerequisites = prerequisiteMatch ? prerequisiteMatch[1].split(',').map(item => item.trim()) : [];
    const subtopics = subtopicsMatch ? subtopicsMatch[1].split(',').map(item => item.trim()) : [];
    
    console.log(prerequisites, subtopics);
    setRoadmapData({ prerequisites, subtopics });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1 style={{ textAlign: "center" }}>Learning Roadmap</h1>
      <button onClick={() => navigate("/")} style={{ marginBottom: "20px" }}>Go Back</button>
      {roadmapData ? (
        <div>
          <h2>Prerequisites</h2>
          <ul>
            {roadmapData.prerequisites.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <h2>Subtopics</h2>
          <ul>
            {roadmapData.subtopics.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading roadmap...</p>
      )}
    </div>
  );
}