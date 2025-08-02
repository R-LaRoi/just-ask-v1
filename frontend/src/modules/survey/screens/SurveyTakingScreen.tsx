import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTemplateStore } from '../stores/templateStore';
import ProgressBar from '../components/ProgressBar';
import QuestionRenderer from '../components/QuestionRenderer';

const { height: screenHeight } = Dimensions.get('window');

export default function SurveyTakingScreen() {
  const navigation = useNavigation();
  const {
    currentSurvey,
    selectedTemplate,
    updateSurveyResponse,
    completeSurvey
  } = useTemplateStore();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Enhanced animations
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const welcomeAnim = useRef(new Animated.Value(1)).current;

  const questions = selectedTemplate?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const currentAnswer = currentSurvey?.responses.find(
    r => r.questionId === currentQuestion?.id
  )?.answer;

  // Welcome screen effect
  useEffect(() => {
    if (showWelcome && selectedTemplate) {
      const timer = setTimeout(() => {
        Animated.timing(welcomeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setShowWelcome(false);
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedTemplate]);

  const handleAnswer = (answer: any) => {
    if (currentQuestion) {
      updateSurveyResponse(currentQuestion.id, answer);

      // Auto-advance for certain question types
      if (currentQuestion.type === 'multiple_choice' &&
        currentQuestion.subtype !== 'multi_select') {
        setTimeout(() => {
          handleNext();
        }, 600); // Small delay for visual feedback
      }
    }
  };

  const animateTransition = (callback: () => void) => {
    setIsTransitioning(true);

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      slideAnim.setValue(50);

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsTransitioning(false);
      });
    });
  };

  const handleNext = () => {
    if (isTransitioning) return;

    if (currentQuestionIndex < questions.length - 1) {
      animateTransition(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      });
    } else {
      // Survey complete with celebration animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      completeSurvey();
      setTimeout(() => {
        Alert.alert(
          '🎉 Survey Complete!',
          'Thank you for sharing your thoughts with us.',
          [
            {
              text: 'View Results',
              onPress: () => navigation.navigate('Dashboard' as never)
            }
          ]
        );
      }, 500);
    }
  };

  const handleBack = () => {
    if (isTransitioning) return;

    if (currentQuestionIndex > 0) {
      animateTransition(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      });
    } else {
      navigation.goBack();
    }
  };

  const canContinue = currentAnswer !== undefined || !currentQuestion?.required;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const shouldShowContinueButton = currentQuestion?.type !== 'multiple_choice' ||
    currentQuestion?.subtype === 'multi_select';

  // Welcome Screen
  if (showWelcome && selectedTemplate) {
    return (
      <SafeAreaView style={styles.welcomeContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#667eea" />
        <Animated.View style={[styles.welcomeContent, { opacity: welcomeAnim }]}>
          <Text style={styles.welcomeIcon}>{selectedTemplate.icon}</Text>
          <Text style={styles.welcomeTitle}>{selectedTemplate.title}</Text>
          <Text style={styles.welcomeDescription}>
            {selectedTemplate.questionCount} questions • {selectedTemplate.estimatedTime}
          </Text>
          <View style={styles.welcomeFooter}>
            <Text style={styles.welcomeFooterText}>Starting in a moment...</Text>
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Enhanced Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            disabled={isTransitioning}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.questionInfo}>
            <Text style={styles.questionCounter}>
              {currentQuestionIndex + 1} of {questions.length}
            </Text>
            {currentQuestion.required && (
              <Text style={styles.requiredIndicator}>Required</Text>
            )}
          </View>
        </View>

        {/* Enhanced Progress Bar */}
        <ProgressBar progress={progress} />

        {/* Question Content with Enhanced Animation */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <View style={styles.questionHeader}>
            <Text style={styles.questionTitle}>{currentQuestion.title}</Text>
            {currentQuestion.description && (
              <Text style={styles.questionDescription}>
                {currentQuestion.description}
              </Text>
            )}
          </View>

          <View style={styles.questionBody}>
            <QuestionRenderer
              question={currentQuestion}
              answer={currentAnswer}
              onAnswer={handleAnswer}
            />
          </View>
        </Animated.View>

        {/* Enhanced Continue Button */}
        {shouldShowContinueButton && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                !canContinue && styles.disabledButton,
                isTransitioning && styles.disabledButton
              ]}
              onPress={handleNext}
              disabled={!canContinue || isTransitioning}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.continueButtonText,
                !canContinue && styles.disabledButtonText
              ]}>
                {isLastQuestion ? '✓ Complete Survey' : 'Continue →'}
              </Text>
            </TouchableOpacity>

            {!currentQuestion.required && !currentAnswer && (
              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleNext}
                disabled={isTransitioning}
              >
                <Text style={styles.skipButtonText}>Skip this question</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Welcome Screen Styles
  welcomeContainer: {
    flex: 1,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  welcomeIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeDescription: {
    fontSize: 18,
    color: '#E0E7FF',
    textAlign: 'center',
    marginBottom: 40,
  },
  welcomeFooter: {
    alignItems: 'center',
  },
  welcomeFooterText: {
    fontSize: 14,
    color: '#C7D2FE',
    fontStyle: 'italic',
  },

  // Enhanced Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
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
  backButtonText: {
    fontSize: 20,
    color: '#374151',
    fontWeight: '600',
  },
  questionInfo: {
    alignItems: 'flex-end',
  },
  questionCounter: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  requiredIndicator: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
    marginTop: 2,
  },

  // Enhanced Content Styles
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  questionHeader: {
    marginBottom: 32,
  },
  questionTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 40,
    marginBottom: 12,
  },
  questionDescription: {
    fontSize: 18,
    color: '#6B7280',
    lineHeight: 28,
  },
  questionBody: {
    flex: 1,
  },

  // Enhanced Footer Styles
  footer: {
    padding: 24,
    paddingBottom: 40,
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
  skipButton: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
});