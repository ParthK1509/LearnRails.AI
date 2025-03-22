import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Quiz from "../components/quiz";
import "./roadmap.css";

export default function RoadmapPage() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
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
    
    setRoadmapData({ prerequisites, subtopics });
  };

  const openModal = (step) => {
    setSelectedStep(step);
    setIsOpen(true);
  };

  return (
    <div className="roadmap-container">
      <h1 style={{ textAlign: "center" }}>Learning Roadmap</h1>
      <button onClick={() => navigate("/")} style={{ marginBottom: "20px" }}>Go Back</button>
      {roadmapData ? (
        <div>
          <h2>Prerequisites</h2>
          <ul>
            {roadmapData.prerequisites.map((item, index) => (

              <li key={index} className="roadmap-item" onClick={() => openModal(item)}>
                {index !== 0 && <div className="fake-line"></div>}
                {index !== 0 && <div className="fake-line"></div>}
                <div className="roadmap-block">{item}</div>
              </li>  
            ))}
            <ModalSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        step={selectedStep}
      />
          </ul>
          <h2>Subtopics</h2>
          <ul>
            {roadmapData.subtopics.map((item, index) => (
              <li key={index} className="roadmap-item" onClick={() => openModal(item)}>
              {index !== 0 && <div className="fake-line"></div>}
              {index !== 0 && <div className="fake-line"></div>}
                <div className="roadmap-block">{item}</div>
              </li>
            ))}
            <ModalSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        step={selectedStep}
      />
          </ul>
        </div>
      ) : (
        <p>Loading roadmap...</p>
      )}
    </div>
  );
}

export function ModalSheet({ isOpen, onClose, step }) {
  return (
    <div className={`modal-sheet ${isOpen ? "open" : ""}`}>
      <button onClick={onClose}>Close</button>
      <p>
        {step ? `Details about: ${step}` : "This is a right-side modal sheet."}
      </p>
      {/* Force Quiz to remount when modal opens or step changes */}
      <Quiz key={`quiz-${isOpen}-${step}`} isOpen={isOpen} topic={step} />
    </div>
  );
}
