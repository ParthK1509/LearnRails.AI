import { useState } from "react";

export default function MCQQuizPage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionData, setQuestionData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const fetchMCQ = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setQuestionData(null);
    setFeedback(null);
    setSelectedAnswer(null);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-zero:free",
          messages: [
            {
              role: "user",
              content: `Generate a multiple-choice question for ${topic}. Provide four answer choices and specify the correct answer. Format strictly as follows:
              question: {Your question text}
              options: {option1, option2, option3, option4}
              correct: {correct option text}`,
            },
          ],
        }),
      });

      const data = await response.json();
      const text = data.choices[0]?.message?.content || "No question found.";
      
      const questionMatch = text.match(/question:\s*{([^}]*)}/i);
      const optionsMatch = text.match(/options:\s*{([^}]*)}/i);
      const correctMatch = text.match(/correct:\s*{([^}]*)}/i);

      if (questionMatch && optionsMatch && correctMatch) {
        setQuestionData({
          question: questionMatch[1],
          options: optionsMatch[1].split(",").map((opt) => opt.trim()),
          correct: correctMatch[1],
        });
      } else {
        setQuestionData(null);
      }
    } catch (error) {
      console.error("Error fetching MCQ:", error);
      setQuestionData(null);
    }
    setLoading(false);
  };

  const handleAnswerSelection = (option) => {
    setSelectedAnswer(option);
    setFeedback(option === questionData.correct ? "Correct!" : "Incorrect.");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto", textAlign: "center" }}>
      <h1>MCQ Quiz</h1>
      <input
        type="text"
        placeholder="Enter topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
      />
      <button onClick={fetchMCQ} disabled={loading} style={{ padding: "10px 20px" }}>
        {loading ? "Loading..." : "Generate Question"}
      </button>
      {questionData && (
        <div style={{ marginTop: "20px", textAlign: "left" }}>
          <h2>{questionData.question}</h2>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {questionData.options.map((option, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                <button
                  onClick={() => handleAnswerSelection(option)}
                  disabled={selectedAnswer !== null}
                  style={{ padding: "10px", width: "100%" }}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
          {feedback && <p style={{ fontWeight: "bold", marginTop: "10px" }}>{feedback}</p>}
        </div>
      )}
    </div>
  );
}