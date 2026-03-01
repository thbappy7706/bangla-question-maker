import { create } from "zustand";
import { Question, QuestionSet, QuestionStructure, QuestionType } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface QuestionStore {
  sets: QuestionSet[];
  currentSet: QuestionSet | null;
  questions: Question[];
  loading: boolean;
  
  fetchSets: () => Promise<void>;
  createSet: (data: Partial<QuestionSet>) => Promise<QuestionSet | null>;
  updateSet: (id: string, data: Partial<QuestionSet>) => Promise<void>;
  deleteSet: (id: string) => Promise<void>;
  setCurrentSet: (set: QuestionSet | null) => void;
  
  fetchQuestions: (setId: string) => Promise<void>;
  addQuestion: (setId: string, type: QuestionType, structure: QuestionStructure) => Promise<void>;
  updateQuestion: (id: string, structure: QuestionStructure) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  reorderQuestions: (questions: Question[]) => void;
}

export const useQuestionStore = create<QuestionStore>((set, get) => ({
  sets: [],
  currentSet: null,
  questions: [],
  loading: false,

  fetchSets: async () => {
    const supabase = createClient();
    set({ loading: true });
    const { data } = await supabase
      .from("question_sets")
      .select("*")
      .order("created_at", { ascending: false });
    set({ sets: data || [], loading: false });
  },

  createSet: async (data) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: newSet, error } = await supabase
      .from("question_sets")
      .insert({ ...data, user_id: user.id })
      .select()
      .single();
    if (!error && newSet) {
      set(state => ({ sets: [newSet, ...state.sets] }));
      return newSet;
    }
    return null;
  },

  updateSet: async (id, data) => {
    const supabase = createClient();
    const { data: updated } = await supabase
      .from("question_sets")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (updated) {
      set(state => ({
        sets: state.sets.map(s => s.id === id ? updated : s),
        currentSet: state.currentSet?.id === id ? updated : state.currentSet,
      }));
    }
  },

  deleteSet: async (id) => {
    const supabase = createClient();
    await supabase.from("question_sets").delete().eq("id", id);
    set(state => ({
      sets: state.sets.filter(s => s.id !== id),
      currentSet: state.currentSet?.id === id ? null : state.currentSet,
    }));
  },

  setCurrentSet: (currentSet) => set({ currentSet }),

  fetchQuestions: async (setId) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("questions")
      .select("*")
      .eq("set_id", setId)
      .order("order_number", { ascending: true });
    set({ questions: data || [] });
  },

  addQuestion: async (setId, type, structure) => {
    const supabase = createClient();
    const { questions } = get();
    const order_number = questions.length;
    const { data, error } = await supabase
      .from("questions")
      .insert({ set_id: setId, type, structure, order_number })
      .select()
      .single();
    if (!error && data) {
      set(state => ({ questions: [...state.questions, data] }));
    }
  },

  updateQuestion: async (id, structure) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("questions")
      .update({ structure })
      .eq("id", id)
      .select()
      .single();
    if (data) {
      set(state => ({
        questions: state.questions.map(q => q.id === id ? data : q),
      }));
    }
  },

  deleteQuestion: async (id) => {
    const supabase = createClient();
    await supabase.from("questions").delete().eq("id", id);
    set(state => ({ questions: state.questions.filter(q => q.id !== id) }));
  },

  reorderQuestions: (questions) => set({ questions }),
}));
