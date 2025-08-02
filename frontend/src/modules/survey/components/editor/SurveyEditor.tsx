import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useSurveyEditorStore } from '../../stores/surveyEditorStore';
import QuestionEditor from './QuestionEditor';

export default function SurveyEditor() {
  const {
    title,
    questions,
    updateSurveyTitle,
  } = useSurveyEditorStore();
  
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Survey Title Editor */}
      <View style={styles.titleSection}>
        <Text style={styles.sectionLabel}>Survey Title</Text>
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={updateSurveyTitle}
          placeholder="Enter survey title..."
          placeholderTextColor="#9CA3AF"
          multiline
          textAlignVertical="top"
        />
      </View>
      
      {/* Questions Editor */}
      <View style={styles.questionsSection}>
        <Text style={styles.sectionLabel}>Questions ({questions.length})</Text>
        
        {questions.map((question, index) => (
          <QuestionEditor
            key={question.id}
            question={question}
            questionIndex={index}
          />
        ))}
      </View>
      
      {/* Add Question Button */}
      <TouchableOpacity
        style={styles.addQuestionButton}
        activeOpacity={0.8}
      >
        <Text style={styles.addQuestionIcon}>+</Text>
        <Text style={styles.addQuestionText}>Add Question</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  titleSection: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  questionsSection: {
    marginBottom: 32,
  },
  addQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
  },
  addQuestionIcon: {
    fontSize: 24,
    color: '#6B7280',
    marginRight: 8,
  },
  addQuestionText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
});