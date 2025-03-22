import { create } from "zustand";

export const roadmapStore = create((set) => ({
  roadmap: {},

  // Add a new topic
  addTopic: (topic) =>
    set((state) => ({
      roadmap: { ...state.roadmap, [topic]: state.roadmap[topic] || [] },
    })),

  // Add subtopics to an existing topic
  addSubtopic: (topic, subtopic) =>
    set((state) => ({
      roadmap: {
        ...state.roadmap,
        [topic]: state.roadmap[topic]
          ? [...state.roadmap[topic], subtopic]
          : [subtopic],
      },
    })),

  // Remove a topic
  removeTopic: (topic) =>
    set((state) => {
      const newRoadmap = { ...state.roadmap };
      delete newRoadmap[topic];
      return { roadmap: newRoadmap };
    }),

  // Remove a subtopic
  removeSubtopic: (topic, subtopic) =>
    set((state) => ({
      roadmap: {
        ...state.roadmap,
        [topic]: state.roadmap[topic]?.filter((s) => s !== subtopic) || [],
      },
    })),

  // Get all topics
  getTopics: () => (get) => Object.keys(get().roadmap),

  // Get subtopics for a topic
  getSubtopics: (topic) => (get) => get().roadmap[topic] || [],
}));
