export interface Question {
  id: number;
  type: 'multiple_choice' | 'text_input' | 'rating';
  title: string;
  options?: string[];
  required: boolean;
}

export interface SurveyTemplate {
  id: string;
  title: string;
  description: string;
  completionRate: string;
  icon: string;
  questions: Question[];
  estimatedTime: string;
  questionCount: number;
}

export interface SurveyResponse {
  questionId: number;
  answer: string | number;
}

export interface Survey {
  templateId: string;
  responses: SurveyResponse[];
  isComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SurveyStats {
  totalResponses: number;
  completionRate: number;
  averageTime: number;
}