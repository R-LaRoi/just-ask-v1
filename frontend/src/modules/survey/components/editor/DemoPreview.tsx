import React, { useEffect } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { SurveyTemplate } from '../../types/survey';

const { width } = Dimensions.get('window');

interface DemoPreviewProps {
  template: SurveyTemplate;
  onComplete: () => void;
}

export default function DemoPreview({ template, onComplete }: DemoPreviewProps) {
  const {
    demoMode,
    answerDemoQuestion,
    nextDemoQuestion,
    completeDemo,
  } = useSurveyEditorStore();
  
  // Use template.questions instead of questions from store
  const questions = template.questions;
  const currentQuestion = questions[demoMode.currentQuestionIndex];
  const progress = ((demoMode.currentQuestionIndex + 1) / questions.length) * 100;
  const currentAnswer = demoMode.answers.find(a => a.questionId === currentQuestion?.id);
  
  useEffect(() => {
    if (demoMode.isCompleted) {
      onComplete();
    }
  }, [demoMode.isCompleted, onComplete]);
  
  const handleOptionSelect = (optionIndex: number) => {
    if (currentQuestion) {
      answerDemoQuestion(currentQuestion.id, optionIndex.toString());
      
      // Auto-advance after a short delay
      setTimeout(() => {
        nextDemoQuestion();
      }, 500);
    }
  };
  
  if (demoMode.isCompleted) {
    return (
      <View style={styles.completionContainer}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.completionGradient}
        >
          <Text style={styles.completionIcon}>🎉</Text>
          <Text style={styles.completionTitle}>Thank you!</Text>
          <Text style={styles.completionSubtitle}>
            You've completed the survey demo
          </Text>
          <Text style={styles.completionStats}>
            {demoMode.answers.length} of {questions.length} questions answered
          </Text>
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
        <Text style={styles.progressText}>
          {demoMode.currentQuestionIndex + 1} of {questions.length}
        </Text>
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
        
        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options?.map((option, index) => {
            const isSelected = currentAnswer?.optionId === index.toString();
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  isSelected && styles.selectedOption
                ]}
                onPress={() => handleOptionSelect(index)}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.optionRadio,
                  isSelected && styles.selectedRadio
                ]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <Text style={[
                  styles.optionText,
                  isSelected && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Select an option to continue
        </Text>
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
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
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
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    minHeight: 60,
  },
  selectedOption: {
    backgroundColor: '#EEF2FF',
    borderColor: '#667eea',
  },
  optionRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    borderColor: '#667eea',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#667eea',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  selectedOptionText: {
    color: '#667eea',
    fontWeight: '600',
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
  completionContainer: {
    flex: 1,
  },
  completionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
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
});