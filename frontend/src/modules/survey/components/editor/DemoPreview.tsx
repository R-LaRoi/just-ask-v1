import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { useSurveyEditorStore } from '../../stores/surveyEditorStore';
import { useEditorStore } from '../../stores/editorStore';
import { LinearGradient } from 'expo-linear-gradient';
import { SurveyTemplate } from '../../types/survey';
import QuestionRenderer from '../QuestionRenderer';

const { width } = Dimensions.get('window');

interface DemoPreviewProps {
  template: SurveyTemplate;
  onComplete: () => void;
  useEditorStore?: boolean;
}

export default function DemoPreview({ template, onComplete, useEditorStore: useEditorStoreProp = false }: DemoPreviewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: number; optionId: string }[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const surveyEditorStore = useSurveyEditorStore();
  const editorStore = useEditorStore();

  const questions = useEditorStoreProp
    ? editorStore.editingTemplate?.questions || template.questions
    : surveyEditorStore.questions.length > 0 ? surveyEditorStore.questions : template.questions;

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id);

  useEffect(() => {
    if (isCompleted) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, onComplete]);

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsCompleted(false);
  }, [template]);

  const handleAnswer = (answer: string | number | string[]) => {
    if (currentQuestion) {
      const answerString = Array.isArray(answer) ? answer.join(',') : answer.toString();
      const newAnswer = { questionId: currentQuestion.id, optionId: answerString };
      const updatedAnswers = answers.filter(a => a.questionId !== currentQuestion.id);
      updatedAnswers.push(newAnswer);
      setAnswers(updatedAnswers);

      if (useEditorStoreProp) {
        editorStore.updateDemoResponse(currentQuestion.id, answerString);
      } else {
        surveyEditorStore.answerDemoQuestion(currentQuestion.id, answerString);
      }

      // Only auto-advance for multiple choice and rating questions
      if (currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'rating') {
        setTimeout(() => {
          handleNext();
        }, 500);
      }
    }
  };

  const handleNext = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= questions.length) {
      setIsCompleted(true);
      if (useEditorStoreProp) {
        // editorStore doesn't have completeDemo
      } else {
        surveyEditorStore.completeDemo();
      }
    } else {
      setCurrentQuestionIndex(nextIndex);
      if (useEditorStoreProp) {
        editorStore.nextDemoQuestion();
      } else {
        surveyEditorStore.nextDemoQuestion();
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const canContinue = currentAnswer !== undefined || !currentQuestion?.required;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const shouldShowContinueButton = currentQuestion?.type === 'text_input';

  if (isCompleted) {
    return (
      <View style={styles.completionContainer}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.completionGradient}
        >
          <View style={styles.demoIndicator}>
            <View style={styles.demoAvatar}>
              <Text style={styles.demoAvatarText}>👤</Text>
            </View>
            <Text style={styles.demoLabel}>DEMO MODE</Text>
          </View>

          <Text style={styles.completionIcon}>🎉</Text>
          <Text style={styles.completionTitle}>Thank you!</Text>
          <Text style={styles.completionSubtitle}>
            You've completed the survey demo
          </Text>
          <Text style={styles.completionStats}>
            {answers.length} of {questions.length} questions answered
          </Text>

          <TouchableOpacity
            style={styles.returnButton}
            onPress={onComplete}
          >
            <Text style={styles.returnButtonText}>Return to Editor</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  if (!currentQuestion) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading demo...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={[styles.backButton, currentQuestionIndex === 0 && styles.disabledBackButton]}
          disabled={currentQuestionIndex === 0}
        >
          <Text style={[styles.backButtonText, currentQuestionIndex === 0 && styles.disabledBackButtonText]}>←</Text>
        </TouchableOpacity>

        <View style={styles.questionInfo}>
          <Text style={styles.questionCounter}>
            {currentQuestionIndex + 1} of {questions.length}
          </Text>
          <View style={styles.demoIndicatorSmall}>
            <Text style={styles.demoLabelSmall}>DEMO</Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View
            style={[
              styles.progressFill,
              { width: `${progress}%` }
            ]}
          />
        </View>
      </View>

      {/* Question Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.questionContainer}>
          <Text style={styles.questionTitle}>{currentQuestion.title}</Text>

          {currentQuestion.description && (
            <Text style={styles.questionDescription}>
              {currentQuestion.description}
            </Text>
          )}
        </View>

        <QuestionRenderer
          question={currentQuestion}
          answer={currentAnswer?.optionId}
          onAnswer={handleAnswer}
        />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {shouldShowContinueButton ? (
          <TouchableOpacity
            style={[
              styles.continueButton,
              !canContinue && styles.disabledButton
            ]}
            onPress={handleNext}
            disabled={!canContinue}
          >
            <Text style={[
              styles.continueButtonText,
              !canContinue && styles.disabledButtonText
            ]}>
              {isLastQuestion ? '✓ Complete Demo' : 'Continue →'}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.footerText}>
            {currentQuestion.type === 'rating' ? 'Select a rating to continue' : 'Select an option to continue'}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  disabledBackButton: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  backButtonText: {
    fontSize: 20,
    color: '#374151',
    fontWeight: '600',
  },
  disabledBackButtonText: {
    color: '#9CA3AF',
  },
  questionInfo: {
    alignItems: 'flex-end',
  },
  questionCounter: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  demoIndicatorSmall: {
    marginTop: 4,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  demoLabelSmall: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  progressBackground: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 3,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  questionContainer: {
    marginBottom: 32,
  },
  questionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 36,
    marginBottom: 12,
  },
  questionDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  continueButton: {
    backgroundColor: '#667eea',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
  completionContainer: {
    flex: 1,
  },
  completionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  demoIndicator: {
    position: 'absolute',
    top: 60,
    right: 20,
    alignItems: 'center',
    zIndex: 10,
  },
  demoAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  demoAvatarText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  demoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    textAlign: 'center',
  },
  completionIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  completionTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  completionSubtitle: {
    fontSize: 18,
    color: '#E0E7FF',
    textAlign: 'center',
    marginBottom: 24,
  },
  completionStats: {
    fontSize: 16,
    color: '#C7D2FE',
    textAlign: 'center',
    fontWeight: '500',
  },
  returnButton: {
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  returnButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
