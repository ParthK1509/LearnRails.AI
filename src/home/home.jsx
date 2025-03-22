import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

import "./home.css";

export default function Home() {
  const [topic, setTopic] = useState("");

  function parseRoadmap(markdown) {
    try {
      const jsonString = markdown.replace(/```json|```/g, "").trim();

      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Invalid JSON:", error);
      return null;
    }
  }

  const fetchFromGemini = async () => {
    if (!topic.trim()) {
      console.error("Topic is empty.");
      return;
    }

    const apiKey = "AIzaSyAQ07vrMnk-ZQRCJyNtIOqklRlHooyJAW4";

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Create a structured learning roadmap for ${topic}, strictly in this format:
    topics: {topics}
    subtopics: {subtopics}.
    The output should only be the roadmap, without any additional text. Make sure the output is in json format.
    topic: [subtopics]. Do not include any other text in the output. Start your output with { and end with }.
    Also just give me plain text, no markdown formatting.
    `;

    console.log("Fetching data from Gemini...");
    console.log("Prompt:", prompt);

    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      if (!responseText) {
        console.error("Failed to fetch valid response from Gemini.");
        return;
      }

      console.log(responseText);
      const parsed = parseRoadmap(responseText);
      console.log(parsed);
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
          <button onClick={fetchFromGemini}>Search</button>
        </div>
      </div>
    </div>
  );
}
