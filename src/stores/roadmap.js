import { create } from "zustand";

export const useRoadmapStore = create((set) => ({
    topics: {},

    addTopic: (topic, subtopics, level) => set(state => ({
        topics: {
            ...state.topics,
            [topic]: { subtopics, level },
        },
    })),

    updateTopicLevel: (topic, level) => set(state => ({
        topics: {
            ...state.topics,
            [topic]: { ...state.topics[topic], level },
        },
    })),
    addSubtopic: (topic, subtopic) => set(state => ({
        topics: {
            ...state.topics,
            [topic]: {
                ...state.topics[topic],
                subtopics: [...state.topics[topic].subtopics, subtopic],
            },
        },
    })),
    removeSubtopic: (topic, subtopic) => set(state => ({
        topics: {
            ...state.topics,
            [topic]: {
                ...state.topics[topic],
                subtopics: state.topics[topic].subtopics.filter(s => s !== subtopic),
            },
        },
    })),

}));
