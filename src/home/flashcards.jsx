import React, { useState } from "react";
import "./flashcards.css"; // Ensure to create and style this file

const FlashCards = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className="flashcards-container">
      <div className="flashcard" onClick={() => setFlipped(!flipped)}>
        {flipped ? (
          <div className="flashcard-back">{cards[currentIndex].answer}</div>
        ) : (
          <div className="flashcard-front">{cards[currentIndex].question}</div>
        )}
      </div>
      <div className="flashcard-controls">
        <button onClick={handlePrev} disabled={cards.length <= 1}>
          ◀ Prev
        </button>
        <span>
          {currentIndex + 1} / {cards.length}
        </span>
        <button onClick={handleNext} disabled={cards.length <= 1}>
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default FlashCards;
