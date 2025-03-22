import { useState } from "react";
import { Check } from 'lucide-react';
import './question-types-selector.css';
//import { useUserQuestionTypesStore } from  '../stores/userQuestionTypes.js';

const questionTypes = [
    "Short Answer Quizzes", "Multiple Choice Questions", "True/False Quizzes", "Long Answer Quizzes"
];

export default function questionTypesSelector() {
    const [selectedTypes, setSelected] = useState([]);
    //const [selectedTypes, addQ, removeQ] = useUserQuestionTypesStore();

    const toggleQuestion = (questionType) => {
        //if (selected.includes(questionType)){
        //    removeQ(questionType);
        //}else{
        //    addQ(questionType);
        //}
        setSelected((prev) =>
            prev.includes(questionType) ? prev.filter((c) => c !== questionType) : [...prev, questionType]
        );
    };

    const submitBtnPress = () => {
        console.log("submit button pressed");
    };

    return (
        <div className="cuisine-container">
            <h1 className="cuisine-heading">
                Select the form of questions you would like?
            </h1>
            <div className="cuisine-grid">
                <div className="cuisine-chips">
                    {questionTypes.map((_qtype) => {
                        const isSelected = selectedTypes.includes(_qtype);
                        return (
                            <button
                                key={_qtype}
                                onClick={() => toggleQuestion(_qtype)}
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
                </div>
                <button className="submit-btn" onClick={submitBtnPress}>
                    Submit
                </button>
            </div>
        </div>
    );
}
