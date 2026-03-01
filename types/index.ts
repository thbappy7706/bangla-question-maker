export interface QuestionSet {
  id: string;
  user_id: string;
  institution: string | null;
  exam_name: string | null;
  class_name: string | null;
  subject_name: string | null;
  full_marks: number | null;
  duration: number | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export type QuestionType = "srijonshil" | "songkhipto" | "mcq";

export interface SrijonshilStructure {
  uddipok: string;
  ko: { question: string; answer: string };
  kho: { question: string; answer: string };
  go: { question: string; answer: string };
  gho: { question: string; answer: string };
}

export interface SongkhiptoStructure {
  question: string;
  answer: string;
}

export interface MCQStructure {
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
}

export type QuestionStructure = SrijonshilStructure | SongkhiptoStructure | MCQStructure;

export interface Question {
  id: string;
  set_id: string;
  type: QuestionType;
  structure: QuestionStructure;
  order_number: number;
  created_at: string;
}
