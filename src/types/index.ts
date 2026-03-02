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
  ko: { question: string };
  kho: { question: string };
  go: { question: string };
  gho: { question: string };
}

export interface SongkhiptoStructure {
  question: string;
}

export interface MCQStructure {
  question: string;
  options: [string, string, string, string];
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
