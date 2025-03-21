import { useState } from "react";
import "./roadmap.css";
import Quiz from "../components/quiz";

export function Roadmap({ items }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);

  const openModal = (step) => {
    setSelectedStep(step);
    setIsOpen(true);
  };

  return (
    <div className="roadmap-container">
      {items.map((step, index) => (
        <div
          key={index}
          className="roadmap-item"
          onClick={() => openModal(step)}
        >
          {index !== 0 && <div className="fake-line"></div>}
          {index !== 0 && <div className="fake-line"></div>}
          <div className="roadmap-block">{step}</div>
        </div>
      ))}
      <ModalSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        step={selectedStep}
      />
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

// export function ModalSheet({ isOpen, onClose, step }) {
//   return (
//     <div className={`modal-sheet ${isOpen ? "open" : ""}`}>
//       <button onClick={onClose}>Close</button>
//       <p>
//         {step ? `Details about: ${step}` : "This is a right-side modal sheet."}
//       </p>
//       <Quiz></Quiz>
//     </div>
//   );
// }

// export function Roadmap({ items }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedStep, setSelectedStep] = useState(null);
//   // Add a key state that changes when modal opens
//   const [modalKey, setModalKey] = useState(0);

//   const openModal = (step) => {
//     setSelectedStep(step);
//     setIsOpen(true);
//     // Increment the key to force a remount
//     setModalKey((prevKey) => prevKey + 1);
//   };

//   return (
//     <div className="roadmap-container">
//       {items.map((step, index) => (
//         <div
//           key={index}
//           className="roadmap-item"
//           onClick={() => openModal(step)}
//         >
//           {index !== 0 && <div className="fake-line"></div>}
//           {index !== 0 && <div className="fake-line"></div>}
//           <div className="roadmap-block">{step}</div>
//         </div>
//       ))}
//       <ModalSheet
//         key={modalKey} // This key forces a remount when changed
//         isOpen={isOpen}
//         onClose={() => setIsOpen(false)}
//         step={selectedStep}
//       />
//     </div>
//   );
// }
