import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import RoadmapPage from "./RoadmapPage";
import MCQQuizPage from "./MCQQuizPage";

function Home() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("roadmap"); // "roadmap" or "quiz"
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!topic.trim()) return;
    setLoading(true);

    let prompt = "";
    if (mode === "roadmap") {
      prompt = `Create a structured learning roadmap for ${topic}, strictly in this format:
      1) prerequisite: {topic names}
      2) subtopics: {topic names}
      (keep {} brackets intact and comma-separated topic names)`;
    } else {
      prompt = `Generate a multiple-choice question (MCQ) for the topic "${topic}". 
      Provide exactly 4 options, and specify the correct answer in this format:
      question: {question text}
      options: {option1, option2, option3, option4}
      answer: {correct option}`;
    }

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-zero:free",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const responseText = data.choices[0]?.message?.content || "No data found.";

      if (mode === "roadmap") {
        navigate("/roadmap", { state: { roadmap: responseText } });
      } else {
        navigate("/quiz", { state: { quiz: responseText } });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>LearnRails.AI</h1>
      <p>AI Powered Learning Path for You</p>
      <input
        type="text"
        placeholder="Enter a topic..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={{ padding: "10px", fontSize: "16px", width: "300px" }}
      />
      <select value={mode} onChange={(e) => setMode(e.target.value)} style={{ marginLeft: "10px" }}>
        <option value="roadmap">Generate Roadmap</option>
        <option value="quiz">Generate Quiz</option>
      </select>
      <button onClick={fetchData} disabled={loading} style={{ marginLeft: "10px" }}>
        {loading ? "Loading..." : "Generate"}
      </button>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/quiz" element={<MCQQuizPage />} />
      </Routes>
    </Router>
  );
}
