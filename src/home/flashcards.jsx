import React, { useState } from "react";
import "./flashcards.css"; // Ensure to create and style this file

const FlashCards = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(true);

  const handleNext = () => {
    setFlipped(true);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setFlipped(true);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  console.log("checking cards", cards);
  console.log(cards[currentIndex].answer);
  return (
    <div className="flashcards-container">
      <div className="flashcard" onClick={() => setFlipped(!flipped)}>
        {flipped ? (
          <div className="flashcard-back">{cards[currentIndex][0]}</div>
        ) : (
          <div className="flashcard-front" style={{ color: "green" }}>
            {"Answer:\n" + cards[currentIndex][1]}
          </div>
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
