import { create } from "zustand";
import { persist } from "zustand/middleware";

// Auth Store
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      setAuth: (user, token) => set({ user, token, isLoggedIn: true }),
      logout: () => set({ user: null, token: null, isLoggedIn: false }),
      updateProfile: (data) =>
        set((state) => ({
          user: { ...state.user, ...data },
        })),
    }),
    { name: "rahbar-auth" },
  ),
);

// Watchlist Store
export const useWatchlistStore = create(
  persist(
    (set, get) => ({
      universities: [],

      addUniversity: (uni) => {
        const already = get().universities.find((u) => u.id === uni.id);
        if (!already) {
          set((s) => ({ universities: [...s.universities, uni] }));
        }
      },

      removeUniversity: (id) => {
        set((s) => ({
          universities: s.universities.filter((u) => u.id !== id),
        }));
      },

      isWatched: (id) => {
        return get().universities.some((u) => u.id === id);
      },
    }),
    { name: "rahbar-watchlist" },
  ),
);

// Quiz Store
export const useQuizStore = create((set) => ({
  answers: {},
  currentStep: 0,
  results: [],

  setAnswer: (key, value) =>
    set((s) => ({
      answers: { ...s.answers, [key]: value },
    })),

  nextStep: () => set((s) => ({ currentStep: s.currentStep + 1 })),
  prevStep: () => set((s) => ({ currentStep: Math.max(0, s.currentStep - 1) })),
  setResults: (results) => set({ results }),
  reset: () => set({ answers: {}, currentStep: 0, results: [] }),
}));
