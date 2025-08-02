export interface Question {
  id: number;
  type: 'multiple_choice' | 'text_input' | 'rating' | 'slider' | 'date' | 'file_upload';
  subtype?: 'single_select' | 'multi_select' | 'boolean' | 'branded_options' | 'short_text' | 'long_text' | 'email' | 'star_rating' | 'number_scale';
  title: string;
  description?: string;
  options?: string[];
  required: boolean;
  placeholder?: string;
  minValue?: number;
  maxValue?: number;
  step?: number;
  // Enhanced properties for conversational surveys
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    customMessage?: string;
  };
  conditional?: {
    dependsOn: number; // Question ID
    showWhen: string | string[]; // Answer value(s) that trigger this question
  };
  randomizeOptions?: boolean;
  allowOther?: boolean;
  otherPlaceholder?: string;
  helpText?: string;
  imageUrl?: string;
  videoUrl?: string;
}

// Enhanced SurveyResponse to support multiple answer types
export interface SurveyResponse {
  questionId: number;
  answer: string | number | string[] | boolean;
  answeredAt: Date;
  timeSpent?: number; // in seconds
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

// New interfaces for enhanced survey functionality
export interface SurveyValidation {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface QuestionTransition {
  type: 'fade' | 'slide' | 'none';
  duration: number;
}

export interface SurveySettings {
  allowBack: boolean;
  showProgress: boolean;
  autoSave: boolean;
  transition: QuestionTransition;
  theme?: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
}

export interface SurveyAnalytics {
  questionId: number;
  viewCount: number;
  answerCount: number;
  averageTimeSpent: number;
  dropOffRate: number;
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

export interface SurveyProgress {
  currentQuestionIndex: number;
  totalQuestions: number;
  percentage: number;
}

export interface SurveyState {
  templateId: string;
  questions: Question[];
  currentQuestionIndex: number;
  responses: SurveyResponse[];
  isComplete: boolean;
  startedAt: Date;
  completedAt?: Date;
}