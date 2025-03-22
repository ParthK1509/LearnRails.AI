import { create } from 'zustand'

const useUserQuestionTypesStore = create((set) => ({
  qTypes: [],
  add_qType: (qT) => set((state) => ({ qTypes: [...state.qTypes, qT] })),
  remove_qType: (qT) => {
      let filteredArray = state.qTypes.filter(item => item !== qT)
      set({ qTypes: filteredArray });
  }
}))
