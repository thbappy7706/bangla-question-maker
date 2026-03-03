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
  isMCQOnly?: boolean;
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

export type MCQSubType = 'general' | 'multi' | 'unified';

export interface MCQStructure {
  mcqType?: MCQSubType;
  question: string;
  options: [string, string, string, string];
  statements?: [string, string, string]; // For 'multi'
  stem?: string; // For 'unified'
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
