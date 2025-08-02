import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Question } from '../../types/survey';

interface TextInputQuestionProps {
  question: Question;
  value?: string;
  onAnswer: (answer: string) => void;
}

export default function TextInputQuestion({ 
  question, 
  value = '', 
  onAnswer 
}: TextInputQuestionProps) {
  const [inputValue, setInputValue] = useState(value);
  
  const isLongText = question.subtype === 'long_text';
  const isEmail = question.subtype === 'email';
  
  const handleTextChange = (text: string) => {
    setInputValue(text);
    onAnswer(text);
  };

  const getKeyboardType = () => {
    if (isEmail) return 'email-address';
    return 'default';
  };

  const getPlaceholder = () => {
    if (question.placeholder) return question.placeholder;
    if (isEmail) return 'Enter your email address';
    if (isLongText) return 'Type your answer here...';
    return 'Your answer';
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.textInput,
            isLongText && styles.longTextInput,
          ]}
          value={inputValue}
          onChangeText={handleTextChange}
          placeholder={getPlaceholder()}
          placeholderTextColor="#9CA3AF"
          keyboardType={getKeyboardType()}
          autoCapitalize={isEmail ? 'none' : 'sentences'}
          autoCorrect={!isEmail}
          multiline={isLongText}
          numberOfLines={isLongText ? 4 : 1}
          textAlignVertical={isLongText ? 'top' : 'center'}
          returnKeyType={isLongText ? 'default' : 'done'}
          blurOnSubmit={!isLongText}
        />
      </View>
      
      {question.description && (
        <Text style={styles.helpText}>{question.description}</Text>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
  },
  inputContainer: {
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#374151',
    minHeight: 56,
  },
  longTextInput: {
    minHeight: 120,
    paddingTop: 16,
  },
  helpText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    lineHeight: 20,
  },
});