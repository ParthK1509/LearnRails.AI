import { useEffect, useState } from "react";
import "./roadmap.css";
import Quiz from "../components/quiz";
import { useLocation, useParams } from "react-router-dom";

export default function Roadmap() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);

  const location = useLocation();
  const { roadmap, topic } = location.state;

  const openModal = (step) => {
    console.log("Opening modal for step:", step);
    setSelectedStep(step);
    setIsOpen(true);
  };

  return (
    <div>
      <div className="topic-title">
        {String(topic).charAt(0).toUpperCase() +
          String(topic).slice(1) +
          " Roadmap"}
      </div>
      <div className="roadmap-container">
        {Object.entries(roadmap.topics).map(([key, value], index) => (
          <div
            key={index}
            className="roadmap-item"
            onClick={() => openModal(key)}
          >
            {index !== 0 && <div className="fake-line"></div>}
            {index !== 0 && <div className="fake-line"></div>}
            <div className="roadmap-block">{key}</div>
          </div>
        ))}
        <ModalSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          step={selectedStep}
        />
      </div>
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
      <Quiz key={`quiz-${isOpen}-${step}`} />
    </div>
  );
}
