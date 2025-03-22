import { useEffect, useState } from "react";
import "./roadmap.css";
import Quiz from "../components/quiz";
import { useLocation, useParams } from "react-router-dom";
import LinearProgress from "@mui/joy/LinearProgress";
import Box from "@mui/joy/Box";
import { GoogleGenerativeAI } from "@google/generative-ai";
import FlashCards from "../home/flashcards";

export default function Roadmap() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [modalValue, setModalValue] = useState([]);
  const location = useLocation();
  const { roadmap, topic } = location.state;

  const openModal = (step, value) => {
    console.log("Opening modal for step:", step);
    setSelectedStep(step);
    setModalValue(value);
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
        {Object.entries(roadmap).map(([key, value], index) => (
          <div
            key={index}
            className="roadmap-item"
            onClick={() => openModal(key, value)}
          >
            {index !== 0 && <div className="fake-line"></div>}
            {index !== 0 && <div className="fake-line"></div>}
            <div className="roadmap-block">{key}</div>
          </div>
        ))}
        <ModalSheet
          key={selectedStep}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          step={selectedStep}
          subtopics={modalValue}
          topic={selectedStep}
        />
      </div>
    </div>
  );
}

export function ModalSheet({ isOpen, onClose, step, subtopics, topic }) {
  const [activeComponent, setActiveComponent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState(null);
  const [flashCards, setFlashCards] = useState(null);

  const onTapQuiz = async () => {
    setLoading(true);
    try {
      const questions = await getQuestions(topic, "easy");
      console.log("Questions:", questions);
      setQuizQuestions(questions);
      setActiveComponent("quiz");
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const onTapFlashCards = async () => {
    setLoading(true);
    try {
      const cards = await getFLashCards(topic);
      console.log("Flashcards:", cards);
      setFlashCards(cards);
      setActiveComponent("flashcards");
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  function parseMarkdownToJson(markdown) {
    try {
      const jsonString = markdown.match(/```json\n([\s\S]+?)\n```/)[1];

      const jsonObject = JSON.parse(jsonString);

      return jsonObject;
    } catch (error) {
      console.error("Invalid markdown format or JSON parsing error:", error);
      return null;
    }
  }

  const getFLashCards = async (topic) => {
    const prompt = `Generate a set of flashcards for the topic "${topic}" in valid JSON format. The output must strictly adhere to the following structure:

[
  { "question": "Question 1", "answer": "Answer 1" },
  { "question": "Question 2", "answer": "Answer 2" },
  { "question": "Question 3", "answer": "Answer 3" },
  ...
]

Rules:
- The output should start with "[" and end with "]".
- Do not include any additional text before or after the JSON.
- Provide only plain text output, no Markdown formatting.
- Ensure questions are concise and relevant to the topic.
- Ensure answers are clear and accurate.
- Include at most 20 flashcards.
- Do not add any explanations, disclaimers, or other text.

Example Output:

[
  { "question": "What is the capital of France?", "answer": "Paris" },
  { "question": "What is 2 + 2?", "answer": "4" },
  { "question": "What is the boiling point of water?", "answer": "100°C" }
]

`;

    const apiKey = "AIzaSyAQ07vrMnk-ZQRCJyNtIOqklRlHooyJAW4";

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const questionData = parseMarkdownToJson(text);
    return questionData;
  };

  const getQuestions = async (topic, difficulty) => {
    const prompt = `Generate four single answer, multiple-choice questions for ${topic} of a difficulty: ${difficulty}. Provide four answer choices and specify the correct answer for each question. Format strictly as follows:
      Give a json formatted output. Your output should start with { and end with }, inside the object have an incremental key starting from the number 0
      for each key, the value is also an object, with the following keys: question, options, correct
      question: {Your question text}
      options: [option1, option2, option3, option4]
      correct: {correct option text}`;

    const apiKey = "AIzaSyAQ07vrMnk-ZQRCJyNtIOqklRlHooyJAW4";

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const questionData = parseMarkdownToJson(text);
    return questionData;
  };
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
            <button onClick={onTapQuiz}>Take Quiz</button>
            <button onClick={onTapFlashCards}>See Flash Cards</button>
          </div>
        </div>
        {/* Dynamic Component Section */}
        <div className="dynamic-content" style={{ minHeight: "100px" }}>
          {loading ? (
            <Box sx={{ width: "80px", padding: "10px" }}>
              <LinearProgress color="danger" size="lg" variant="soft" />
            </Box>
          ) : activeComponent === "quiz" && quizQuestions ? (
            <Quiz key={`quiz-${isOpen}-${step}`} questions={quizQuestions} />
          ) : null}
          {activeComponent === "flashcards" && flashCards ? (
            <FlashCards
              key={`flashcards-${isOpen}-${step}`}
              cards={flashCards}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
