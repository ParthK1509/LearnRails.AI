import { useState } from "react";

export default function LearningRoadmap() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);

  const fetchRoadmap = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setRoadmap(null);

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
            messages: [
              {
                role: "user",
                content: `Create a structured learning roadmap for ${topic}.`,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      setRoadmap(data.choices[0]?.message?.content || "No roadmap found.");
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      setRoadmap("Failed to generate roadmap. Try again.");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f3f4f6",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <h1
        style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "16px" }}
      >
        LearnRails.AI
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "16px" }}>
        AI Powered Learning Path for You
      </p>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <input
          type="text"
          placeholder="Which topic are we learning today?"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{
            padding: "12px",
            fontSize: "16px",
            width: "100%",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
          }}
        />
        <button
          onClick={fetchRoadmap}
          style={{
            marginTop: "12px",
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            border: "none",
            fontSize: "16px",
          }}
          disabled={loading}
        >
          {loading ? "Loading..." : "Generate Roadmap"}
        </button>
      </div>
      {roadmap && (
        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            backgroundColor: "white",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            width: "100%",
            maxWidth: "600px",
            textAlign: "left",
            whiteSpace: "pre-wrap",
            color: "#374151",
          }}
        >
          {roadmap}
        </div>
      )}
    </div>
  );
}

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
