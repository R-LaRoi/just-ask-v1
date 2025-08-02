import { SurveyTemplate } from '../modules/survey/types/survey';

export type RootStackParamList = {
  Welcome: undefined;
  Onboarding: undefined;
  ProfileCreated: undefined;
  Dashboard: undefined;
  TemplateSelection: undefined;
  SurveyEditor: { template?: SurveyTemplate } | undefined;
  SurveyTemplateEditor: { template?: SurveyTemplate } | undefined;
  SurveyTaking: undefined;
  SurveyReview: { survey: any } | undefined;
};