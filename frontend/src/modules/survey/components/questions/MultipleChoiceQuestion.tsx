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
    marginTop: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 25,
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
  selectedOption: {
    backgroundColor: '#f7fd04',
    borderColor: '#292929',
  },
  booleanOption: {
    paddingVertical: 18,
  },
  indicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#292929',
    marginRight: 16,
    backgroundColor: '#ffffff',
  },
  selectedIndicator: {
    backgroundColor: '#222121',
    borderColor: '#222121',
  },
  checkboxIndicator: {
    borderRadius: 4,
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#222121',
    fontWeight: '600',
  },
});