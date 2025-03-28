import { useState } from "react";
import { Check } from 'lucide-react';
import './exp-level-selector.css';
import '../stores/userQuestionTypes';
import { useRoadmapStore } from "../stores/roadmap";
import {Link} from  "react-router-dom";

const example_topics = [
    "RBD", "RBD2", "RBD3", "RBD4"
];

export default function CuisineSelector() {
    //const [selected, setSelected] = useState([]);
    // assume 
    // (question Index, question Title)

    //const toggleCuisine = (cuisine) => {
    //    setSelected((prev) =>
    //        prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    //    );
    //};
    //
        //{topics.map((topic)=>{
        //    return (
        //        <TopicExperienceTile topic={topic}/>
        //    );
        //})}

    const topics = useRoadmapStore((state) => state.topics);
    return (
        <div className="cuisine-container">
            <h1 className="cuisine-heading">
                How experienced are you with these topics?
            </h1>
            <div className="cuisine-grid">
                <div className="q-list">

        {Object.entries(topics).map(([key, value], index) => {
            return (
                <TopicExperienceTile topic={key}/>
            );
        }
        )}
                </div>
                <div className="cuisine-chips">
                </div>
        <Link to={"/roadmap/3223"}>
        <button className="submit-btn">
        Submit
        </button>
        </Link>
            </div>
        </div>
    );
}

function TopicExperienceTile( {topic} ) {
    const [selVal, setselVal] = useState(0);
    const updateLevel = useRoadmapStore((state) => state.updateTopicLevel);

    return (
        <div className="topic-tile">
            <div className="questionName">
                {topic}
            </div>
            <div className="exp-tiles">
                <button className={`expTile badTile ${selVal == 0 ? 'selected' : ''}`} onClick={() => {
                    setselVal(0)
                    updateLevel(topic, 0);
                }
                }>
                Bad
                </button>
                <button className={`expTile mediumTile ${selVal == 1 ? 'selected' : ''}`} onClick={() => {
                    setselVal(1);
                    updateLevel(topic, 1);
                }
                }
                    >
                Medium
                </button>
                <button className={`expTile goodTile ${selVal == 2 ? 'selected' : ''}`} onClick={() =>{
                    setselVal(2);
                    updateLevel(topic, 2);
                }
                } >
                Good
                </button>
            </div>
        </div>
    );
}
/*
          {questionTypes.map((_qtype) => {
            const isSelected = selected.includes(_qtype);
            return (
              <button
                key={_qtype}
                onClick={() => toggleCuisine(_qtype)}
                className={`cuisine-chip ${isSelected ? 'selected' : ''}`}
              >
                <div className="chip-content">
                  <span>{_qtype}</span>
                  <span className="check-icon-wrapper">
                    <div className="check-icon-circle">
                      <Check className="check-icon" />
                    </div>
                  </span>
                </div>
              </button>
            );
          })}
          */
