import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config/.env';

interface SurveyResponse {
  message: string;
  surveyId: string;
  shareUrl: string;
}

interface SurveysResponse {
  surveys: any[];
}

class ApiService {
  [x: string]: any;
  private baseURL: string;

  constructor() {
    this.baseURL = API_URL;
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await AsyncStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getAuthHeaders();

    const config: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Survey API methods
  async createSurvey(surveyData: {
    title: string;
    description?: string;
    questions: any[];
    estimatedTime?: string;
    settings?: any;
  }): Promise<SurveyResponse> {
    return this.request<SurveyResponse>('/api/surveys', {
      method: 'POST',
      body: JSON.stringify(surveyData),
    });
  }

  async getUserSurveys(): Promise<SurveysResponse> {
    return this.request<SurveysResponse>('/api/surveys');
  }

  async getPublicSurvey(surveyId: string) {
    return this.request(`/api/surveys/${surveyId}/public`);
  }

  async submitSurveyResponse(surveyId: string, responseData: {
    responses: any[];
    completedAt?: string;
    timeSpent?: number;
  }) {
    return this.request(`/api/surveys/${surveyId}/responses`, {
      method: 'POST',
      body: JSON.stringify(responseData),
    });
  }
}

export const apiService = new ApiService();