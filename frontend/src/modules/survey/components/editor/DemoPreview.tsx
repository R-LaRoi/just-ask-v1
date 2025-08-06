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
import Video from 'react-native-video';
import { useSurveyEditorStore } from '../../stores/surveyEditorStore';
import { useEditorStore } from '../../stores/editorStore';

import { SurveyTemplate } from '../../types/survey';
import QuestionRenderer from '../QuestionRenderer';

const { width, height } = Dimensions.get('window');

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
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
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
      <View style={styles.container}>
        {/* Video Background */}
        <Video
          source={{ uri: 'https://res.cloudinary.com/do5wpgk5o/video/upload/v1754402003/ask-vid-blk_lly43z.mp4' }}
          style={styles.backgroundVideo}
          resizeMode="cover"
          repeat={true}
          muted={true}
          playInBackground={false}
          playWhenInactive={false}
        />

        {/* Content Overlay */}
        <View style={styles.overlay}>
          <View style={styles.completionContent}>
            <Text style={styles.completionTitle}>Thank you!</Text>
            <Text style={styles.completionSubtitle}>
              You've completed the survey demo
            </Text>
            <Text style={styles.completionDescription}>
              {answers.length} of {questions.length} questions answered
            </Text>

            <TouchableOpacity
              style={styles.returnButton}
              onPress={onComplete}
            >
              <Text style={styles.returnButtonText}>Return to Editor</Text>
            </TouchableOpacity>
          </View>
        </View>
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
        style={styles.scrollViewContainer}
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
    backgroundColor: '#ffffff', // Back to white
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontSize: 18,
    color: '#666666',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#292929',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledBackButton: {
    backgroundColor: '#f7f7f7',
    borderColor: '#f7f7f7',
  },
  backButtonText: {
    fontSize: 20,
    color: '#333333',
    fontWeight: '600',
  },
  disabledBackButtonText: {
    color: '#666666',
  },
  questionInfo: {
    alignItems: 'flex-end',
  },
  questionCounter: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
  demoIndicatorSmall: {
    marginTop: 4,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
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
    backgroundColor: '#ffffff',
  },
  progressBackground: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 3,
  },
  completionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
    // Remove justifyContent: 'center' and alignItems: 'center' to restore original spacing
  },
  questionContainer: {
    marginBottom: 32,
  },
  questionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    lineHeight: 36,
    marginBottom: 12,
    textAlign: 'center',
  },
  questionDescription: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#ffffff',
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  continueButton: {
    backgroundColor: '#f7fd04',
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#222121',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: '#666666',
  },
  completionContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
  completionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  completionSubtitle: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  completionDescription: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  returnButton: {
    backgroundColor: '#f7fd04',
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
    minWidth: 200,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  returnButtonText: {
    color: '#222121',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
