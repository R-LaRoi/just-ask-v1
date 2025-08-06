import { SurveyTemplate } from '../types/survey';

export const SURVEY_TEMPLATES: SurveyTemplate[] = [
  {
    id: 'simple-poll',
    title: 'Poll',
    description: '1 question • 30 sec',
    completionRate: '95% completion rate',
    icon: '', // Removed 📊
    estimatedTime: '30 sec',
    questionCount: 1,
    questions: [
      {
        id: 1,
        type: 'multiple_choice',
        subtype: 'boolean',
        title: 'Do you like this feature?',
        options: ['Yes', 'No'],
        required: true
      }
    ]
  },
  {
    id: 'know-my-audience',
    title: 'Know My Audience',
    description: '3 questions • 2 min',
    completionRate: '85% completion rate',
    icon: '', // Removed 👥
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
        type: 'multiple_choice',
        title: 'What is your primary occupation?',
        options: ['Student', 'Professional', 'Entrepreneur', 'Retired', 'Other'],
        required: true
      },
      {
        id: 3,
        type: 'multiple_choice',
        title: 'How did you hear about us?',
        options: ['Social Media', 'Friend Referral', 'Search Engine', 'Advertisement', 'Other'],
        required: false
      }
    ]
  },
  {
    id: 'product-feedback',
    title: 'Product Feedback',
    description: '5 questions • 3 min',
    completionRate: '78% completion rate',
    icon: '', // Removed 📦
    estimatedTime: '3 min',
    questionCount: 5,
    questions: [
      {
        id: 1,
        type: 'rating',
        subtype: 'star_rating',  // Add this line
        title: 'How would you rate our product overall?',
        required: true
      },
      {
        id: 2,
        type: 'multiple_choice',
        title: 'Which feature do you use most?',
        options: ['Dashboard', 'Analytics', 'Reports', 'Settings', 'Support'],
        required: true
      },
      {
        id: 3,
        type: 'text_input',
        title: 'What do you like most about our product?',
        required: false
      },
      {
        id: 4,
        type: 'text_input',
        title: 'What could we improve?',
        required: false
      },
      {
        id: 5,
        type: 'rating',
        subtype: 'star_rating',  // Add this line
        title: 'How likely are you to recommend us to a friend?',
        required: true
      }
    ]
  },
  {
    id: 'feature-feedback',
    title: 'Feature Feedback',
    description: '5 questions • 3 min',
    completionRate: '72% completion rate',
    icon: '', // Removed ⚡
    estimatedTime: '3 min',
    questionCount: 5,
    questions: [
      {
        id: 1,
        type: 'multiple_choice',
        title: 'Which new feature are you most excited about?',
        options: ['AI Assistant', 'Real-time Collaboration', 'Advanced Analytics', 'Mobile App', 'API Access'],
        required: true
      },
      {
        id: 2,
        type: 'rating',
        subtype: 'star_rating',  // Add this line
        title: 'How easy was it to find this new feature?',
        required: true
      },
      {
        id: 3,
        type: 'rating',
        subtype: 'star_rating',  // Add this line
        title: 'How intuitive is the feature to use?',
        required: true
      },
      {
        id: 4,
        type: 'text_input',
        title: 'What additional functionality would you like to see?',
        required: false
      },
      {
        id: 5,
        type: 'multiple_choice',
        title: 'How often do you plan to use this feature?',
        options: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'Never'],
        required: true
      }
    ]
  }
];