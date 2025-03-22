import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./home.css";

export default function Home() {
  const [topic, setTopic] = useState("");
  const navigate = useNavigate();

  const parseRoadmap = (text) => {
    const prerequisiteMatch = text.match(/prerequisite:\s*{([^}]*)}/i);
    const subtopicsMatch = text.match(/subtopics:\s*{([^}]*)}/i);

    const prerequisites = prerequisiteMatch
      ? prerequisiteMatch[1].split(",").map((item) => item.trim())
      : [];
    const subtopics = subtopicsMatch
      ? subtopicsMatch[1].split(",").map((item) => item.trim())
      : [];

    console.log(prerequisites, subtopics);
    return { prerequisites, subtopics };
  };

  const fetchData = async () => {
    if (!topic.trim()) return;

    let prompt = `Create a structured learning roadmap for ${topic}, strictly in this format:
      1) prerequisite: {topic names}
      2) subtopics: {topic names}
      (keep {} brackets intact and comma-separated topic names)`;

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization:
              "Bearer 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",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-r1-zero:free",
            messages: [{ role: "user", content: prompt }],
          }),
        }
      );

      const data = await response.json();
      const responseText =
        data.choices[0]?.message?.content || "No data found.";

      console.log("Response from API:", responseText);
      console.log(responseText);
      const parsed = parseRoadmap(responseText);
      navigate("/roadmap", { state: { items: parsed.subtopics } });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="root">
      <div className="logo">
        <div className="heading">LearnRails.AI</div>
        <div className="subtitle">AI Powered Learning Path for You</div>
      </div>
      <div className="main">
        <p className="whichTopic">Which Topic are we learning today?</p>
        <div className="searchbar">
          <input
            type="text"
            placeholder="e.g. Rigid Body Dynamics"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button onClick={fetchData}>Search</button>
        </div>
      </div>
    </div>
  );
}
