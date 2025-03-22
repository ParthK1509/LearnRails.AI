import React, { useState, useEffect } from "react";
import "./quiz.css"; // Import external CSS for styling
import { GoogleGenerativeAI } from "@google/generative-ai"; // Ensure this package is installed

const Quiz = ({ isOpen, topic = "" }) => {
  if (!isOpen) return null;
  const difficulty = "medium"; // Set the difficulty level for the question
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  function parseMarkdownToJson(markdown) {
    try {
        // Extract JSON string from markdown
        const jsonString = markdown.match(/```json\n([\s\S]+?)\n```/)[1];
        
        // Parse JSON string to object
        const jsonObject = JSON.parse(jsonString);
        
        return jsonObject;
    } catch (error) {
        console.error("Invalid markdown format or JSON parsing error:", error);
        return null;
    }
}

  useEffect(() => {
    const fetchMCQ = async () => {
      if (!topic.trim()) return;
      setLoading(true);
      setQuestions([]);
      setFeedback("");
      setSelectedOption(null);

      const prompt = `Generate a single answer, multiple-choice question for ${topic} of a difficulty: ${difficulty}. Provide four answer choices and specify the correct answer. Format strictly as follows:
      Give a json formatted output. Your output should start with { and end with }, insdie the object have an incremental key starting from the number 0
      for each key, the value is also an object, with the following keys: question, options, correct
      question: {Your question text}
      options: [option1, option2, option3, option4]
      correct: {correct option text}`;

      const apiKey = "AIzaSyAQ07vrMnk-ZQRCJyNtIOqklRlHooyJAW4";

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      console.log("Fetching data from Gemini...");
      console.log("Prompt:", prompt);

      try {
        const result = await model.generateContent(prompt);
        const text = await result.response.text();

        if (!text) {
          console.error("Failed to fetch valid response from Gemini.");
          return;
        }

        console.log("Response from Gemini:", text);

const questionData = parseMarkdownToJson(text);

for(const key in questionData){
  setQuestions(...[{question: questionData[key].question, options: questionData[key].options, answer: questionData[key].correct}]);
}

        // if (questionMatch && optionsMatch && correctMatch) {
        //   setQuestions([{
        //     question: questionMatch[1],
        //     options: optionsMatch[1].split(",").map((opt) => opt.trim().replace(/[{}]/g, '')),
        //     answer: correctMatch[1].replace(/[{}]/g, ''),
        //   }]);
        // } else {
        //   setQuestions([]);
        // }
      } catch (error) {
        console.error("Error fetching MCQ:", error);
        setQuestions([]);
      }
      setLoading(false);
    };

    fetchMCQ();
  }, [topic]);



  const handleAnswer = (option) => {
    setSelectedOption(option);
    if (option === questions[currentQuestion].answer) {
      setFeedback("✅ Correct!");
      setScore(score + 1);
    } else {
      setFeedback("❌ Incorrect");
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setFeedback("");
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (questions.length === 0) {
    return <div>No questions available.</div>;
  }

  return (
    <div className="quiz-container">
      <h2>{questions[currentQuestion].question}</h2>
      <div className="options">
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            className={`option-btn ${
              selectedOption
                ? option === questions[currentQuestion].answer
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
        disabled={!selectedOption || currentQuestion === questions.length - 1}
      >
        Next
      </button>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      <p>
        Question {currentQuestion + 1} of {questions.length}
      </p>
    </div>
  );
};

export default Quiz;
