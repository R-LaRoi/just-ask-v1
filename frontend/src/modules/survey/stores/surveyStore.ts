import { create } from 'zustand';
import { apiService } from '../../../utils/api';

interface Survey {
  _id: string;
  title: string;
  description: string;
  questions: any[];
  estimatedTime: string;
  questionCount: number;
  shareUrl: string;
  createdAt: string;
  stats: {
    totalResponses: number;
    completionRate: number;
    averageTime: number;
  };
}

interface SurveyStore {
  surveys: Survey[];
  isLoading: boolean;
  error: string | null;
  
  fetchSurveys: () => Promise<void>;
  clearError: () => void;
}

export const useSurveyStore = create<SurveyStore>((set, get) => ({
  surveys: [],
  isLoading: false,
  error: null,

  fetchSurveys: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiService.getUserSurveys();
      
      set({ 
        surveys: response.surveys || [],
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching surveys:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch surveys',
        isLoading: false 
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));