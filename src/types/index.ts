export type QuestionType = 'srijonshil' | 'songkhipto' | 'mcq';

export interface QuestionSet {
  id: string;
  institution: string;
  examName: string;
  className: string;
  subjectName: string;
  fullMarks: number | '';
  duration: number | '';
  note: string;
  createdAt: string;
  updatedAt: string;
}

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
  setId: string;
  type: QuestionType;
  structure: QuestionStructure;
  orderNumber: number;
  createdAt: string;
}
