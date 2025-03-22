import { useState } from "react";
import { Check } from 'lucide-react';
import './exp-level-selector.css';
import '../stores/userQuestionTypes';

const questionTypes = [
  "Short Answer Quizzes", "Multiple Choice Questions", "True/False Quizzes", "Long Answer Quizzes"
];

export default function CuisineSelector() {
  const [selected, setSelected] = useState([]);
  // assume 
    // (question Index, question Title)

  const toggleCuisine = (cuisine) => {
    setSelected((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    );
  };

  return (
    <div className="cuisine-container">
      <h1 className="cuisine-heading">
      How experienced are you with these topics?
      </h1>
      <div className="cuisine-grid">
        <div className="cuisine-chips">
          {questionTypes.map((_qtype) => {
            const isSelected = selected.includes(_qtype);
            return (
              <button
                key={_qtype}
                onClick={() => toggleCuisine(_qtype)}
                className={`cuisine-chip ${isSelected ? 'selected' : ''}`}
              >
                <div className="chip-content">
                  <span>{_qtype}</span>
                  <span className="check-icon-wrapper">
                    <div className="check-icon-circle">
                      <Check className="check-icon" />
                    </div>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      <button className="submit-btn">
      Submit
      </button>
      </div>
    </div>
  );
}
