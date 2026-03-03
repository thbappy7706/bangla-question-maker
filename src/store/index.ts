import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Question, QuestionSet, QuestionStructure, QuestionType } from '@/types';

interface Store {
  sets: QuestionSet[];
  questions: Question[];

  // Sets CRUD
  createSet: (data: Omit<QuestionSet, 'id' | 'createdAt' | 'updatedAt'>) => QuestionSet;
  updateSet: (id: string, data: Partial<QuestionSet>) => void;
  deleteSet: (id: string) => void;
  getSet: (id: string) => QuestionSet | undefined;

  // Questions CRUD
  getQuestions: (setId: string) => Question[];
  addQuestion: (setId: string, type: QuestionType, structure: QuestionStructure) => Question;
  updateQuestion: (id: string, structure: QuestionStructure) => void;
  deleteQuestion: (id: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      sets: [],
      questions: [],

      createSet: (data) => {
        const newSet: QuestionSet = {
          ...data,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set(state => ({ sets: [newSet, ...state.sets] }));
        return newSet;
      },

      updateSet: (id, data) => {
        set(state => ({
          sets: state.sets.map(s =>
            s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s
          ),
        }));
      },

      deleteSet: (id) => {
        set(state => ({
          sets: state.sets.filter(s => s.id !== id),
          questions: state.questions.filter(q => q.setId !== id),
        }));
      },

      getSet: (id) => get().sets.find(s => s.id === id),

      getQuestions: (setId) =>
        get().questions
          .filter(q => q.setId === setId)
          .sort((a, b) => a.orderNumber - b.orderNumber),

      addQuestion: (setId, type, structure) => {
        const existing = get().questions.filter(q => q.setId === setId);
        const newQ: Question = {
          id: uuidv4(),
          setId,
          type,
          structure,
          orderNumber: existing.length,
          createdAt: new Date().toISOString(),
        };
        set(state => ({ questions: [...state.questions, newQ] }));
        return newQ;
      },

      updateQuestion: (id, structure) => {
        set(state => ({
          questions: state.questions.map(q =>
            q.id === id ? { ...q, structure } : q
          ),
        }));
      },

      deleteQuestion: (id) => {
        set(state => ({ questions: state.questions.filter(q => q.id !== id) }));
      },
    }),
    {
      name: 'bqm-storage',
      version: 1,
    }
  )
);
