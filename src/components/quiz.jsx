import React, { useState } from "react";
import "./quiz.css"; // Import external CSS for styling

const Quiz = ({ questions }) => {
  const questionKeys = Object.keys(questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);

  const currentQuestion = questions[questionKeys[currentIndex]];

  const handleAnswer = (option) => {
    setSelectedOption(option);
    if (option === currentQuestion.correct) {
      setFeedback("✅ Correct!");
      setScore(score + 1);
    } else {
      setFeedback("❌ Incorrect");
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setFeedback("");
    if (currentIndex < questionKeys.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const progress = ((currentIndex + 1) / questionKeys.length) * 100;

  return (
    <div className="quiz-container">
      <h2>{currentQuestion.question}</h2>
      <div className="options">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            className={`option-btn ${
              selectedOption
                ? option === currentQuestion.correct
                  ? "correct"
                  : option === selectedOption
                  ? "incorrect"
                  : ""
                : ""
            }`}
            onClick={() => handleAnswer(option)}
            disabled={selectedOption}
          >
            {option}
          </button>
        ))}
      </div>
      {feedback && <p className="feedback">{feedback}</p>}
      <button
        onClick={handleNext}
        className="next-btn"
        disabled={!selectedOption || currentIndex === questionKeys.length - 1}
      >
        Next
      </button>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      <p>
        Question {currentIndex + 1} of {questionKeys.length}
      </p>
    </div>
  );
};

export default Quiz;
