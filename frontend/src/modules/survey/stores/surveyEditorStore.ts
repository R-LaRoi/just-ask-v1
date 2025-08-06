import { create } from 'zustand';
import { SurveyTemplate, Question } from '../types/survey';
import { apiService } from '../../../utils/api';

// Add deleteQuestion to the interface (around line 26)
interface SurveyEditorState {
  // Editor State
  surveyId: string;
  title: string;
  questions: Question[];
  isEditing: boolean;
  
  // Demo Mode State
  demoMode: {
    isActive: boolean;
    answers: { questionId: number; optionId: string }[];
    isCompleted: boolean;
    currentQuestionIndex: number;
  };
  
  // UI State
  editingQuestionId: number | null;
  editingOptionId: string | null;
  showAddOption: boolean;
  
  // Actions
  initializeEditor: (template?: SurveyTemplate) => void;
  updateSurveyTitle: (title: string) => void;
  updateQuestionText: (questionId: number, text: string) => void;
  addOption: (questionId: number, text: string) => void;
  removeOption: (questionId: number, optionId: string) => void;
  updateOption: (questionId: number, optionId: string, text: string) => void;
  reorderOptions: (questionId: number, fromIndex: number, toIndex: number) => void;
  deleteQuestion: (questionId: number) => void; // Add this line
  
  // Demo Mode Actions
  startDemo: () => void;
  resetDemo: () => void;
  answerDemoQuestion: (questionId: number, optionId: string) => void;
  nextDemoQuestion: () => void;
  completeDemo: () => void;
  
  // Editor Actions
  setEditingQuestion: (questionId: number | null) => void;
  setEditingOption: (questionId: number, optionId: string | null) => void;
  toggleAddOption: (questionId: number) => void;
  
  // Export/Save
  exportSurvey: () => SurveyTemplate;
  saveSurvey: () => Promise<any>; // Changed from () => void
}

const DEFAULT_TEMPLATE: SurveyTemplate = {
  id: 'custom-survey',
  title: 'Custom Survey',
  description: '3 questions • 2 min',
  completionRate: '0% completion rate',
  icon: '', // Removed 📝
  estimatedTime: '2 min',
  questionCount: 3,
  questions: [
    {
      id: 1,
      type: 'multiple_choice',
      title: 'What is your age group?',
      options: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
      required: true
    },
    {
      id: 2,
      type: 'multiple_choice',
      title: 'What is your occupation?',
      options: ['Student', 'Professional', 'Self-employed', 'Retired', 'Unemployed', 'Other'],
      required: true
    },
    {
      id: 3,
      type: 'multiple_choice',
      title: 'What is your location?',
      options: ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Australia/Oceania'],
      required: true
    }
  ]
};

// Add the deleteQuestion implementation (around line 180)
export const useSurveyEditorStore = create<SurveyEditorState>((set, get) => ({
  // Initial State
  surveyId: '',
  title: '',
  questions: [],
  isEditing: false,
  
  demoMode: {
    isActive: false,
    answers: [],
    isCompleted: false,
    currentQuestionIndex: 0
  },
  
  editingQuestionId: null,
  editingOptionId: null,
  showAddOption: false,
  
  // Actions
  initializeEditor: (template) => {
    const templateToUse = template || DEFAULT_TEMPLATE;
    set({
      surveyId: templateToUse.id,
      title: templateToUse.title,
      questions: JSON.parse(JSON.stringify(templateToUse.questions)), // Deep copy
      isEditing: true,
      demoMode: {
        isActive: false,
        answers: [],
        isCompleted: false,
        currentQuestionIndex: 0
      }
    });
  },
  
  updateSurveyTitle: (title) => {
    set({ title });
  },
  
  updateQuestionText: (questionId, text) => {
    const { questions } = get();
    const updatedQuestions = questions.map(q => 
      q.id === questionId ? { ...q, title: text } : q
    );
    set({ questions: updatedQuestions });
    get().resetDemo();
  },
  
  addOption: (questionId, text) => {
    const { questions } = get();
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId && q.options) {
        return {
          ...q,
          options: [...q.options, text]
        };
      }
      return q;
    });
    set({ questions: updatedQuestions, showAddOption: false });
    get().resetDemo();
  },
  
  removeOption: (questionId, optionId) => {
    const { questions } = get();
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId && q.options) {
        const optionIndex = parseInt(optionId);
        return {
          ...q,
          options: q.options.filter((_, index) => index !== optionIndex)
        };
      }
      return q;
    });
    set({ questions: updatedQuestions });
    get().resetDemo();
  },
  
  updateOption: (questionId, optionId, text) => {
    const { questions } = get();
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId && q.options) {
        const optionIndex = parseInt(optionId);
        const newOptions = [...q.options];
        newOptions[optionIndex] = text;
        return {
          ...q,
          options: newOptions
        };
      }
      return q;
    });
    set({ questions: updatedQuestions });
    get().resetDemo();
  },
  
  reorderOptions: (questionId, fromIndex, toIndex) => {
    const { questions } = get();
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId && q.options) {
        const newOptions = [...q.options];
        const [removed] = newOptions.splice(fromIndex, 1);
        newOptions.splice(toIndex, 0, removed);
        return {
          ...q,
          options: newOptions
        };
      }
      return q;
    });
    set({ questions: updatedQuestions });
    get().resetDemo();
  },
  
  // Demo Mode Actions
  startDemo: () => {
    set({
      demoMode: {
        isActive: true,
        answers: [],
        isCompleted: false,
        currentQuestionIndex: 0
      }
    });
  },
  
  resetDemo: () => {
    set({
      demoMode: {
        isActive: false,
        answers: [],
        isCompleted: false,
        currentQuestionIndex: 0
      }
    });
  },
  
  answerDemoQuestion: (questionId, optionId) => {
    const { demoMode } = get();
    const updatedAnswers = demoMode.answers.filter(a => a.questionId !== questionId);
    updatedAnswers.push({ questionId, optionId });
    
    set({
      demoMode: {
        ...demoMode,
        answers: updatedAnswers
      }
    });
  },
  
  nextDemoQuestion: () => {
    const { demoMode, questions } = get();
    const nextIndex = demoMode.currentQuestionIndex + 1;
    
    if (nextIndex >= questions.length) {
      get().completeDemo();
    } else {
      set({
        demoMode: {
          ...demoMode,
          currentQuestionIndex: nextIndex
        }
      });
    }
  },
  
  completeDemo: () => {
    const { demoMode } = get();
    set({
      demoMode: {
        ...demoMode,
        isCompleted: true
      }
    });
  },
  
  // Editor Actions
  setEditingQuestion: (questionId) => {
    set({ editingQuestionId: questionId });
  },
  
  setEditingOption: (questionId, optionId) => {
    set({ editingOptionId: optionId });
  },
  
  toggleAddOption: (questionId) => {
    set({ showAddOption: !get().showAddOption });
  },
  
  // Export/Save
  exportSurvey: () => {
    const { surveyId, title, questions } = get();
    return {
      id: surveyId,
      title,
      description: `${questions.length} questions • ${Math.ceil(questions.length * 0.7)} min`,
      completionRate: '0% completion rate',
      icon: '📝',
      estimatedTime: `${Math.ceil(questions.length * 0.7)} min`,
      questionCount: questions.length,
      questions
    };
  },
  
  saveSurvey: async () => {
    try {
      const { title, questions } = get();
      
      if (!title || questions.length === 0) {
        throw new Error('Title and at least one question are required');
      }

      const surveyData = {
        title,
        description: `${questions.length} questions • ${Math.ceil(questions.length * 0.7)} min`,
        questions,
        estimatedTime: `${Math.ceil(questions.length * 0.7)} min`,
        settings: {
          allowBack: true,
          showProgress: true,
          autoSave: false
        }
      };

      console.log('Saving survey to backend...', surveyData);
      const response = await apiService.saveSurvey(surveyData);
      console.log('Survey saved successfully:', response);
      return response;
    } catch (error) {
      console.error('Error saving survey:', error);
      throw error;
    }
  },

  deleteQuestion: (questionId) => {
    console.log('surveyEditorStore deleteQuestion called with:', questionId);
    const { questions } = get();
    console.log('Current questions before delete:', questions.map(q => ({ id: q.id, title: q.title })));
    
    const updatedQuestions = questions.filter(q => q.id !== questionId);
    console.log('Updated questions after filter:', updatedQuestions.map(q => ({ id: q.id, title: q.title })));
    
    set({ 
      questions: updatedQuestions,
      editingQuestionId: null,
      editingOptionId: null 
    });
    
    console.log('surveyEditorStore deleteQuestion completed');
    get().resetDemo();
  },
}));