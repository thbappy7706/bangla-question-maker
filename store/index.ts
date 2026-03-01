import { create } from "zustand";
import type { QuestionSet, Question, User } from "@/types";

interface AppState {
  user: User | null;
  currentSet: QuestionSet | null;
  questions: Question[];
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setCurrentSet: (set: QuestionSet | null) => void;
  setQuestions: (questions: Question[]) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  removeQuestion: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  currentSet: null,
  questions: [],
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setCurrentSet: (currentSet) => set({ currentSet }),
  setQuestions: (questions) => set({ questions }),
  addQuestion: (question) =>
    set((state) => ({ questions: [...state.questions, question] })),
  updateQuestion: (id, updates) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === id ? { ...q, ...updates } : q
      ),
    })),
  removeQuestion: (id) =>
    set((state) => ({
      questions: state.questions.filter((q) => q.id !== id),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({ currentSet: null, questions: [], isLoading: false, error: null }),
}));
