import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import LinearProgress from "@mui/joy/LinearProgress";
import Box from "@mui/joy/Box";
import { unstable_batchedUpdates } from 'react-dom'
import { useMainTopicStore, useRoadmapStore } from "../stores/roadmap";

import "./home.css";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [loding, setLoading] = useState(false);
  const navigate = useNavigate();

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
      unstable_batchedUpdates(() => {
          useMainTopicStore.getState().setmaintopic(topic);
          console.log("Roadmap Topic is: " + useMainTopicStore.getState());
      })

    setLoading(true);
    const apiKey = "AIzaSyAQ07vrMnk-ZQRCJyNtIOqklRlHooyJAW4";

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Generate a structured learning roadmap for "${topic}" in valid JSON format. The output must strictly adhere to the following structure:

{
  "topic1": [{"subtopic": "subtopic1", "link": "url1"}, {"subtopic": "subtopic2", "link": "url2"}],
  "topic2": [{"subtopic": "subtopic1", "link": "url1"}, {"subtopic": "subtopic2", "link": "url2"}],
  ...
}

Rules:
- The output should start with "{" and end with "}".
- Do not include any additional text before or after the JSON.
- Provide only plain text output, no Markdown formatting.
- Ensure topic names are concise (not too long).
- Include at most 10 topics.
- Each topic must have relevant subtopics (at least one per topic).
- Each subtopic must include a "link" field with a URL to learn about it.
- Prioritize links in the following order:
  1. Wikipedia
  2. Web Archive
  3. Official documentation or trusted educational websites (e.g., Khan Academy, Coursera, Quizizz).
- Do not include YouTube links as they are not working.
- Do not add any explanations, disclaimers, or other text.

Example Output:

{
  "Introduction": [{"subtopic": "Overview", "link": "https://en.wikipedia.org/wiki/Overview"}, {"subtopic": "History", "link": "https://web.archive.org/web/20210101010101/https://example.com/history"}],
}
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

      console.log("Response from Gemini:");
      console.log(responseText);
      const parsed = parseRoadmap(responseText);

    // use Asynchronous Callback to update our Stores because it may cause "zombie-effect" while updating UI
        unstable_batchedUpdates(() => {
            Object.keys(parsed).forEach((topic) => {
                useRoadmapStore.getState().addTopic(topic, parsed[topic], 0);
            });
            console.log(useRoadmapStore.getState())
        })

        navigate('/input1');

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      fetchFromGemini(); // Trigger search when "Enter" is pressed
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
            onKeyDown={handleKeyDown} // Add keydown event listener
          />
          <button onClick={fetchFromGemini}>
            {loding ? (
              <Box sx={{ width: "80px", padding: "10px" }}>
                <LinearProgress color="danger" size="lg" variant="soft" />
              </Box>
            ) : (
              "Search"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
