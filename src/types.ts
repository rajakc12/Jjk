export type ExamType = 'UPSC' | 'PSC';
export type ExamStage = 'Pre' | 'Mains';

export interface Question {
  id: string;
  text: string;
  options?: string[];
  correctAnswer?: string;
  marks: number;
  explanation?: string;
}

export interface Test {
  id: string;
  title: string;
  type: ExamType;
  stage: ExamStage;
  questions: Question[];
  createdAt: Date;
}

export interface UserStats {
  rank: number;
  name: string;
  score: number;
  testsTaken: number;
}

export interface Feedback {
  name: string;
  email: string;
  message: string;
}
