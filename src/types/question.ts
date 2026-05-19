export interface Question {
  id: number;
  type: 'single' | 'multiple' | 'boolean' | 'short';
  title: string;
  options: string[];
  answer: string;
}

export interface UserAnswer {
  questionId: number;
  userAnswer: string | string[];
  isCorrect: boolean;
}

export interface ExamRecord {
  id: string;
  timestamp: number;
  score: number;
  totalScore: number;
  answers: UserAnswer[];
}
