import { create } from 'zustand';
import { SurveyTemplate, Survey, SurveyResponse } from '../types/survey';
import { SURVEY_TEMPLATES } from '../data/templates';

interface TemplateStore {
  // State
  templates: SurveyTemplate[];
  selectedTemplate: SurveyTemplate | null;
  currentSurvey: Survey | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  selectTemplate: (templateId: string) => void;
  createSurveyFromTemplate: (templateId: string) => void;
  updateSurveyResponse: (questionId: number, answer: string | number) => void;
  completeSurvey: () => void;
  clearSelection: () => void;
  resetError: () => void;
  
  // Getters
  getTemplateById: (id: string) => SurveyTemplate | undefined;
  getCurrentProgress: () => number;
  getRequiredQuestions: () => number;
  getAnsweredQuestions: () => number;
}

export const useTemplateStore = create<TemplateStore>((set, get) => ({
  // Initial State
  templates: SURVEY_TEMPLATES,
  selectedTemplate: null,
  currentSurvey: null,
  isLoading: false,
  error: null,

  // Actions
  selectTemplate: (templateId: string) => {
    const template = SURVEY_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      set({ 
        selectedTemplate: template,
        error: null 
      });
    } else {
      set({ error: `Template with id ${templateId} not found` });
    }
  },

  createSurveyFromTemplate: (templateId: string) => {
    const template = SURVEY_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      const now = new Date();
      set({
        selectedTemplate: template,
        currentSurvey: {
          templateId,
          responses: [],
          isComplete: false,
          createdAt: now,
          updatedAt: now
        },
        error: null
      });
    } else {
      set({ error: `Template with id ${templateId} not found` });
    }
  },

  updateSurveyResponse: (questionId: number, answer: string | number) => {
    const { currentSurvey } = get();
    if (currentSurvey) {
      const updatedResponses = currentSurvey.responses.filter(r => r.questionId !== questionId);
      updatedResponses.push({ questionId, answer, answeredAt: new Date() });
      
      set({
        currentSurvey: {
          ...currentSurvey,
          responses: updatedResponses,
          updatedAt: new Date()
        }
      });
    }
  },

  completeSurvey: () => {
    const { currentSurvey } = get();
    if (currentSurvey) {
      set({
        currentSurvey: {
          ...currentSurvey,
          isComplete: true,
          updatedAt: new Date()
        }
      });
    }
  },

  clearSelection: () => {
    set({ 
      selectedTemplate: null, 
      currentSurvey: null,
      error: null 
    });
  },

  resetError: () => {
    set({ error: null });
  },

  // Getters
  getTemplateById: (id: string) => {
    return SURVEY_TEMPLATES.find(t => t.id === id);
  },

  getCurrentProgress: () => {
    const { currentSurvey, selectedTemplate } = get();
    if (!currentSurvey || !selectedTemplate) return 0;
    
    const totalQuestions = selectedTemplate.questions.length;
    const answeredQuestions = currentSurvey.responses.length;
    
    return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
  },

  getRequiredQuestions: () => {
    const { selectedTemplate } = get();
    if (!selectedTemplate) return 0;
    
    return selectedTemplate.questions.filter(q => q.required).length;
  },

  getAnsweredQuestions: () => {
    const { currentSurvey } = get();
    if (!currentSurvey) return 0;
    
    return currentSurvey.responses.length;
  }
}));