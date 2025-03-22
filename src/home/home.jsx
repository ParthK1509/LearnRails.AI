import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import LinearProgress from "@mui/joy/LinearProgress";
import Box from "@mui/joy/Box";
import { unstable_batchedUpdates } from 'react-dom'
import { roadmapStore } from "../stores/roadmap";

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
            roadmapStore.getState().add(response)
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

    const prompt = `Create a structured learning roadmap for ${topic}, strictly in this format:
    topics: {subtopics}.
    The output should only be the roadmap, without any additional text. Make sure the output is in json format.
    topic: [subtopics]. Do not include any other text in the output. Start your output with { and end with }.
    Also just give me plain text, no markdown formatting.Make sure that the topic names are not very long. Do not include more than 10 topics.
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
                //const { addTopic } = useTopicStore();
                //addTopic(topic, apiData[topic], index + 1); // Assign a level starting from 1
                roadmapStore.getState().addTopic(topic, parsed[topic], 0);
            });
            console.log(roadmapStore.getState())
        })


      console.log("is this a promise? ", parsed);
        // here, response is of type : {
        //
        //{
        //"topics": [String]
        //"subtopics": { String: [String]}
        //
        //}

        //TODO: uncomment
      //navigate(`/roadmap/${topic}`, {
      //  state: { roadmap: parsed, topic: topic },
      //});

    // HEre, we will parse the response


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
