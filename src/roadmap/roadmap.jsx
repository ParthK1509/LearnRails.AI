import { useEffect, useState } from "react";
import "./roadmap.css";
import Quiz from "../components/quiz";
import LinearProgress from "@mui/joy/LinearProgress";
import Box from "@mui/joy/Box";
import { GoogleGenerativeAI } from "@google/generative-ai";
import FlashCards from "../home/flashcards";
import { useMainTopicStore, useRoadmapStore } from "../stores/roadmap.js";
import {useUserQuestionTypesStore} from "../stores/userQuestionTypes.js";

export default function Roadmap() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [modalValue, setModalValue] = useState([]);

  const roadmap = useRoadmapStore((state) => state.topics);
  const roadmaptopic = useMainTopicStore((state) => state.maintopic);


  const openModal = (step, value) => {
    console.log("Opening modal for step:", step);
    setSelectedStep(step);
    setModalValue(value["subtopics"]);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <div className="topic-title">
        {String(roadmaptopic).charAt(0).toUpperCase() +
          String(roadmaptopic).slice(1) +
          " Roadmap"}
      </div>
      <div className="bot-marg">
      Click on a Topic Card to Know More.
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
        })}
        <ModalSheet
          key={selectedStep}
          isOpen={isOpen}
          onClose={closeModal}
          step={selectedStep}
          subtopics={modalValue}
          topic={selectedStep}
          maintopic={roadmaptopic}
        />
      </div>
    </div>
  );
}

export function ModalSheet({
  isOpen,
  onClose,
  step,
  subtopics,
  topic,
  maintopic,
}) {
  const [activeComponent, setActiveComponent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState(null);
  const [flashCards, setFlashCards] = useState(null);
  const roadmap = useRoadmapStore((state) => state.topics);

  const onTapQuiz = async () => {
    setLoading(true);
    console.log("level is: " + roadmap[topic]["level"]);
    let hardnessLevel = "";
    switch (roadmap[topic]["level"]) {
      case 0:
        hardnessLevel = "easy";
        break;
      case 1:
        hardnessLevel = "medium";
        break;
      case 2:
        hardnessLevel = "hard";
        break;
      default:
        hardnessLevel = "easy";
        break;
    }
    try {
      const questions = await getQuestions(topic, hardnessLevel);
      console.log("setting difficulty: " + hardnessLevel);
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

  function parseFlashcards(data) {
    try {
      // Parse if data is a JSON string
      const flashcards = typeof data === "string" ? JSON.parse(data) : data;

      // Extract and return question-answer pairs
      return flashcards.map(({ question, answer }) => [question, answer]);
    } catch (error) {
      console.error("Invalid JSON format:", error);
      return [];
    }
  }

  const getFLashCards = async (topic) => {
    const prompt = `Generate a set of flashcards for the topic "${topic}" in context of "${maintopic}" in valid JSON format. The output must strictly adhere to the following structure:

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
    console.log("Flashcards text:", text);

    const questionData = parseFlashcards(text);
    return questionData;
  };

  const getQuestions = async (topic, difficulty) => {
          let prompt = `Generate four single answer, multiple-choice questions for ${topic} in context of ${maintopic} of a difficulty: ${difficulty}. Provide four answer choices and specify the correct answer for each question. Format strictly as follows:
      Give a json formatted output. Your output should start with { and end with }, inside the object have an incremental key starting from the number 0
      for each key, the value is also an object, with the following keys: question, options, correct
      question: {Your question text}
      options: [option1, option2, option3, option4]
      correct: {correct option text}`;


      const qTypesPref = useUserQuestionTypesStore.getState().qTypes;

      for (let pref in qTypesPref ){
          if (pref === "True/False Quizzes"){
              prompt = 
     `Generate four true/false questions for ${topic} in context of ${maintopic} of a difficulty: ${difficulty}. Each question should have only two answer choices: "True" and "False". Specify the correct answer for each question. Format strictly as follows:  
Give a JSON formatted output. Your output should start with { and end with }, inside the object have an incremental key starting from the number 0.  
For each key, the value is an object with the following keys:  
- question: {Your true/false question text}  
- options: ["True", "False"]  
- correct: {Correct option: "True" or "False"} `;
              break;
          }
      }
      console.log("prompt = " + prompt);

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
              {subtopics.map((subtopicObj, index) => (
                <a
                  key={index}
                  href={subtopicObj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="subtopic"
                >
                  {subtopicObj.subtopic}
                </a>
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
