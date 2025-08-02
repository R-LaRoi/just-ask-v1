import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Question } from '../../types/survey';

interface MultipleChoiceQuestionProps {
  question: Question;
  selectedAnswer?: string | string[];
  onAnswer: (answer: string | string[]) => void;
}

export default function MultipleChoiceQuestion({ 
  question, 
  selectedAnswer, 
  onAnswer 
}: MultipleChoiceQuestionProps) {
  const isBoolean = question.subtype === 'boolean';
  const isMultiSelect = question.subtype === 'multi_select';
  
  const handleOptionPress = (option: string) => {
    if (isMultiSelect) {
      const currentAnswers = Array.isArray(selectedAnswer) ? selectedAnswer : [];
      const newAnswers = currentAnswers.includes(option)
        ? currentAnswers.filter(a => a !== option)
        : [...currentAnswers, option];
      onAnswer(newAnswers);
    } else {
      onAnswer(option);
    }
  };

  const isSelected = (option: string) => {
    if (Array.isArray(selectedAnswer)) {
      return selectedAnswer.includes(option);
    }
    return selectedAnswer === option;
  };

  return (
    <View style={styles.container}>
      {question.options?.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            isSelected(option) && styles.selectedOption,
            isBoolean && styles.booleanOption,
          ]}
          onPress={() => handleOptionPress(option)}
          activeOpacity={0.7}
        >
          <View style={[
            styles.indicator,
            isSelected(option) && styles.selectedIndicator,
            isMultiSelect && styles.checkboxIndicator,
          ]} />
          <Text style={[
            styles.optionText,
            isSelected(option) && styles.selectedOptionText,
          ]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    backgroundColor: '#EEF2FF',
    borderColor: '#667eea',
  },
  booleanOption: {
    paddingVertical: 24,
  },
  indicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 16,
  },
  selectedIndicator: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  checkboxIndicator: {
    borderRadius: 4,
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  selectedOptionText: {
    color: '#667eea',
    fontWeight: '600',
  },
});