import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import LinearProgress from "@mui/joy/LinearProgress";
import Box from "@mui/joy/Box";
import { unstable_batchedUpdates } from 'react-dom'
import { useRoadmapStore } from "../stores/roadmap";

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
    // use Asynchronous Callback to update our Stores because it may cause "zombie-effect" while updating UI
    const nonReactCallback = (response) => {
        unstable_batchedUpdates(() => {
            useRoadmapStore.getState().add(response)
        })
    }

  const fetchFromGemini = async () => {
    if (!topic.trim()) {
      console.error("Topic is empty.");
      return;
    }

    setLoading(true);
    const apiKey = "AIzaSyAQ07vrMnk-ZQRCJyNtIOqklRlHooyJAW4";

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Generate a structured learning roadmap for "${topic}" in valid JSON format. The output must strictly adhere to the following structure:

{
  "topic1": ["subtopic1", "subtopic2", "subtopic3"],
  "topic2": ["subtopic1", "subtopic2", "subtopic3"],
  ...
}

Rules:
- The output should start with "{" and end with "}".
- Do not include any additional text before or after the JSON.
- Provide only plain text output, no Markdown formatting.
- Ensure topic names are concise (not too long).
- Include at most 10 topics.
- Each topic must have relevant subtopics (at least one per topic).
- Do not add any explanations, disclaimers, or other text.

Example Output:

{
  "Introduction": ["Overview", "History", "Basic Concepts"],
  "Fundamentals": ["Core Principles", "Key Theories", "Common Applications"],
  "Advanced Topics": ["Deep Learning", "Optimization Techniques", "Performance Tuning"],
  "Best Practices": ["Industry Standards", "Efficiency Tips", "Case Studies"]
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

        unstable_batchedUpdates(() => {
            Object.keys(parsed).forEach((topic) => {
                useRoadmapStore.getState().addTopic(topic, parsed[topic], 0);
            });
            console.log(useRoadmapStore.getState())
        })


        //TODO: uncomment
      navigate(`/roadmap/${topic}`, {
        state: { roadmap: parsed, topic: topic },
      });

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
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
