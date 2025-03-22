import { useEffect, useState } from "react";
import "./roadmap.css";
import Quiz from "../components/quiz";
import { useLocation, useParams } from "react-router-dom";
import {useRoadmapStore} from "../stores/roadmap.js";

export default function Roadmap() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [modalValue, setModalValue] = useState([]);
  const location = useLocation();

    const roadmap = useRoadmapStore((state) => state.topics);
  //const { roadmap, topic } = location.state;
    //
    //TODO: remove this
    const topic = "hardcoded topic name";

  const openModal = (step, value) => {
    console.log("Opening modal for step:", step);
    setSelectedStep(step);
    setModalValue(value["subtopics"]);
    console.log("Modal value: ", modalValue);
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
        {Object.entries(roadmap).map(([key, value], index) => {
            return (
                <div
                key={index}
                className="roadmap-item"
                onClick={() => openModal(key, value)}
                >
                {index !== 0 && <div className="fake-line"></div>}
                {index !== 0 && <div className="fake-line"></div>}
                <div className="roadmap-block">{key}</div>
                </div>
            );
        }
        )}
        <ModalSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          step={selectedStep}
          subtopics={modalValue}
        />
      </div>
    </div>
  );
}

export function ModalSheet({ isOpen, onClose, step, subtopics }) {
  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <div>
      {/* Backdrop */}
      <div
        className={`modal-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className={`modal-sheet ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
        <div className="modal-content-container">
          <div>
            <div className="modal-title">{step}</div>
            <div className="modal-text">
              We Recommend Learning these Subtopics:
            </div>
            <div className="modal-content">
              {subtopics.map((subtopic, index) => (
                <div key={index} className="subtopic">
                  {subtopic}
                </div>
              ))}
            </div>
          </div>
          <div className="modal-buttons">
            <button onClick={() => setActiveComponent("quiz")}>
              Take Quiz
            </button>
            <button onClick={() => setActiveComponent("flashcards")}>
              See Flash Cards
            </button>
          </div>
        </div>
        {/* Dynamic Component Section */}
        <div className="dynamic-content" style={{ minHeight: "100px" }}>
          {activeComponent === "quiz" && (
            <Quiz key={`quiz-${isOpen}-${step}`} />
          )}
          {/* {activeComponent === "flashcards" && <FlashCardComponent />} */}
        </div>
      </div>
    </div>
  );
}
