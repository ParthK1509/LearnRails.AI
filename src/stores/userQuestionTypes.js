import { create } from 'zustand'

export const useUserQuestionTypesStore = create((set) => ({
  qTypes: [],
  add_qType: (qT) => set((state) => ({ qTypes: [...state.qTypes, qT] })),
  remove_qType: (qT) => {
      set(state => ({
          qTypes: state.qTypes.filter(item => qT !== item),
      }));
  },
    clearState: () => set((state) => ({qTypes: []}))
}))
