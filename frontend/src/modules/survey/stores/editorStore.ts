import { create } from 'zustand';
import { SurveyTemplate, Question } from '../types/survey';

interface EditorState {
  // Template being edited
  editingTemplate: SurveyTemplate | null;
  isDemoMode: boolean;
  demoResponses: Record<number, any>;
  currentDemoQuestion: number;
  
  // Editor actions
  createNewTemplate: () => void;
  loadTemplate: (template: SurveyTemplate) => void;
  updateTemplateTitle: (title: string) => void;
  updateTemplateDescription: (description: string) => void;
  
  // Question management
  addQuestion: (type: Question['type']) => void;
  updateQuestion: (questionId: number, updates: Partial<Question>) => void;
  deleteQuestion: (questionId: number) => void;
  reorderQuestions: (fromIndex: number, toIndex: number) => void;
  
  // Option management
  addOption: (questionId: number, option: string) => void;
  updateOption: (questionId: number, optionIndex: number, value: string) => void;
  deleteOption: (questionId: number, optionIndex: number) => void;
  reorderOptions: (questionId: number, fromIndex: number, toIndex: number) => void;
  
  // Demo functionality
  startDemo: () => void;
  stopDemo: () => void;
  updateDemoResponse: (questionId: number, answer: any) => void;
  nextDemoQuestion: () => void;
  previousDemoQuestion: () => void;
  
  // Save and export
  saveTemplate: () => Promise<void>;
  generateShareLink: () => string;
  generateQRCode: () => string;
}

const DEFAULT_TEMPLATE: SurveyTemplate = {
  id: 'new-template',
  title: 'My New Survey',
  description: '3 questions • 2 min',
  completionRate: '0% completion rate',
  icon: '📝',
  estimatedTime: '2 min',
  questionCount: 3,
  questions: [
    {
      id: 1,
      type: 'multiple_choice',
      title: 'What is your age group?',
      options: ['18-24', '25-34', '35-44', '45-54', '55+'],
      required: true
    },
    {
      id: 2,
      type: 'rating',
      title: 'How satisfied are you with our service?',
      required: true
    },
    {
      id: 3,
      type: 'text_input',
      subtype: 'long_text',
      title: 'Any additional feedback?',
      placeholder: 'Share your thoughts...',
      required: false
    }
  ]
};

export const useEditorStore = create<EditorState>((set, get) => ({
  // Initial state
  editingTemplate: null,
  isDemoMode: false,
  demoResponses: {},
  currentDemoQuestion: 0,
  
  // Template actions
  createNewTemplate: () => {
    set({ 
      editingTemplate: { ...DEFAULT_TEMPLATE },
      isDemoMode: false,
      demoResponses: {},
      currentDemoQuestion: 0
    });
  },
  
  loadTemplate: (template) => {
    set({ 
      editingTemplate: { ...template },
      isDemoMode: false,
      demoResponses: {},
      currentDemoQuestion: 0
    });
  },
  
  updateTemplateTitle: (title) => {
    const { editingTemplate } = get();
    if (editingTemplate) {
      set({
        editingTemplate: {
          ...editingTemplate,
          title
        }
      });
    }
  },
  
  updateTemplateDescription: (description) => {
    const { editingTemplate } = get();
    if (editingTemplate) {
      set({
        editingTemplate: {
          ...editingTemplate,
          description
        }
      });
    }
  },
  
  // Question management
  addQuestion: (type) => {
    const { editingTemplate } = get();
    if (editingTemplate) {
      const newQuestion: Question = {
        id: Date.now(),
        type,
        title: 'New Question',
        required: true,
        ...(type === 'multiple_choice' && { options: ['Option 1', 'Option 2'] }),
        ...(type === 'text_input' && { placeholder: 'Enter your answer...' })
      };
      
      set({
        editingTemplate: {
          ...editingTemplate,
          questions: [...editingTemplate.questions, newQuestion],
          questionCount: editingTemplate.questions.length + 1
        }
      });
    }
  },
  
  updateQuestion: (questionId, updates) => {
    const { editingTemplate } = get();
    if (editingTemplate) {
      set({
        editingTemplate: {
          ...editingTemplate,
          questions: editingTemplate.questions.map(q => 
            q.id === questionId ? { ...q, ...updates } : q
          )
        }
      });
    }
  },
  
  deleteQuestion: (questionId) => {
    console.log('🗑️ editorStore deleteQuestion called with:', questionId);
    const { editingTemplate } = get();
    if (editingTemplate) {
      console.log('📋 Current questions:', editingTemplate.questions.map(q => q.id));
      const updatedQuestions = editingTemplate.questions.filter(q => q.id !== questionId);
      console.log('📋 Updated questions:', updatedQuestions.map(q => q.id));
      set({
        editingTemplate: {
          ...editingTemplate,
          questions: updatedQuestions,
          questionCount: updatedQuestions.length
        }
      });
      console.log('✅ Question deleted successfully');
    } else {
      console.log('❌ No editing template found');
    }
  },
  
  reorderQuestions: (fromIndex, toIndex) => {
    const { editingTemplate } = get();
    if (editingTemplate) {
      const questions = [...editingTemplate.questions];
      const [removed] = questions.splice(fromIndex, 1);
      questions.splice(toIndex, 0, removed);
      
      set({
        editingTemplate: {
          ...editingTemplate,
          questions
        }
      });
    }
  },
  
  // Option management
  addOption: (questionId, option) => {
    const { editingTemplate } = get();
    if (editingTemplate) {
      set({
        editingTemplate: {
          ...editingTemplate,
          questions: editingTemplate.questions.map(q => 
            q.id === questionId && q.options
              ? { ...q, options: [...q.options, option] }
              : q
          )
        }
      });
    }
  },
  
  updateOption: (questionId, optionIndex, value) => {
    const { editingTemplate } = get();
    if (editingTemplate) {
      set({
        editingTemplate: {
          ...editingTemplate,
          questions: editingTemplate.questions.map(q => 
            q.id === questionId && q.options
              ? {
                  ...q,
                  options: q.options.map((opt, idx) => 
                    idx === optionIndex ? value : opt
                  )
                }
              : q
          )
        }
      });
    }
  },
  
  deleteOption: (questionId, optionIndex) => {
    const { editingTemplate } = get();
    if (editingTemplate) {
      set({
        editingTemplate: {
          ...editingTemplate,
          questions: editingTemplate.questions.map(q => 
            q.id === questionId && q.options
              ? {
                  ...q,
                  options: q.options.filter((_, idx) => idx !== optionIndex)
                }
              : q
          )
        }
      });
    }
  },
  
  reorderOptions: (questionId, fromIndex, toIndex) => {
    const { editingTemplate } = get();
    if (editingTemplate) {
      set({
        editingTemplate: {
          ...editingTemplate,
          questions: editingTemplate.questions.map(q => {
            if (q.id === questionId && q.options) {
              const options = [...q.options];
              const [removed] = options.splice(fromIndex, 1);
              options.splice(toIndex, 0, removed);
              return { ...q, options };
            }
            return q;
          })
        }
      });
    }
  },
  
  // Demo functionality
  startDemo: () => {
    set({ 
      isDemoMode: true, 
      currentDemoQuestion: 0,
      demoResponses: {} 
    });
  },
  
  stopDemo: () => {
    set({ 
      isDemoMode: false, 
      currentDemoQuestion: 0,
      demoResponses: {} 
    });
  },
  
  updateDemoResponse: (questionId, answer) => {
    const { demoResponses } = get();
    set({
      demoResponses: {
        ...demoResponses,
        [questionId]: answer
      }
    });
  },
  
  nextDemoQuestion: () => {
    const { currentDemoQuestion, editingTemplate } = get();
    if (editingTemplate && currentDemoQuestion < editingTemplate.questions.length - 1) {
      set({ currentDemoQuestion: currentDemoQuestion + 1 });
    }
  },
  
  previousDemoQuestion: () => {
    const { currentDemoQuestion } = get();
    if (currentDemoQuestion > 0) {
      set({ currentDemoQuestion: currentDemoQuestion - 1 });
    }
  },
  
  // Save and export
  saveTemplate: async () => {
    const { editingTemplate } = get();
    if (editingTemplate) {
      // TODO: Implement API call to save template
      console.log('Saving template:', editingTemplate);
    }
  },
  
  generateShareLink: () => {
    const { editingTemplate } = get();
    if (editingTemplate) {
      return `https://justask.app/survey/${editingTemplate.id}`;
    }
    return '';
  },
  
  generateQRCode: () => {
    const { editingTemplate } = get();
    if (editingTemplate) {
      // TODO: Generate actual QR code
      return `data:image/svg+xml;base64,${btoa('<svg>QR Code</svg>')}`;
    }
    return '';
  }
}));