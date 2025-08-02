import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSurveyEditorStore } from '../../stores/surveyEditorStore';
import { Question } from '../../types/survey';
import OptionEditor from './OptionEditor';

interface QuestionEditorProps {
  question: Question;
  questionIndex: number;
  isLast?: boolean;
}

export default function QuestionEditor({ question, questionIndex, isLast }: QuestionEditorProps) {
  const {
    updateQuestionText,
    addOption,
    removeOption,
    reorderOptions,
  } = useSurveyEditorStore();
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(question.title);
  const [showAddOption, setShowAddOption] = useState(false);
  const [newOptionText, setNewOptionText] = useState('');
  
  const handleTitleSave = () => {
    updateQuestionText(question.id, tempTitle);
    setIsEditingTitle(false);
  };
  
  const handleTitleCancel = () => {
    setTempTitle(question.title);
    setIsEditingTitle(false);
  };
  
  const handleAddOption = () => {
    if (newOptionText.trim()) {
      addOption(question.id, newOptionText.trim());
      setNewOptionText('');
      setShowAddOption(false);
    }
  };
  
  const handleRemoveOption = (optionIndex: number) => {
    if (question.options && question.options.length > 2) {
      Alert.alert(
        'Remove Option',
        `Are you sure you want to remove "${question.options[optionIndex]}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => removeOption(question.id, optionIndex.toString())
          }
        ]
      );
    } else {
      Alert.alert('Cannot Remove', 'Questions must have at least 2 options.');
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Question Header */}
      <View style={styles.questionHeader}>
        <View style={styles.questionNumber}>
          <Text style={styles.questionNumberText}>{questionIndex + 1}</Text>
        </View>
        
        <View style={styles.questionInfo}>
          <Text style={styles.questionType}>Multiple Choice</Text>
          {question.required && (
            <Text style={styles.requiredBadge}>Required</Text>
          )}
        </View>
      </View>
      
      {/* Question Title */}
      <View style={styles.titleContainer}>
        {isEditingTitle ? (
          <View style={styles.titleEditContainer}>
            <TextInput
              style={styles.titleInput}
              value={tempTitle}
              onChangeText={setTempTitle}
              placeholder="Enter question text..."
              placeholderTextColor="#9CA3AF"
              multiline
              autoFocus
              textAlignVertical="top"
            />
            <View style={styles.titleActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleTitleCancel}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleTitleSave}
                activeOpacity={0.7}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.titleDisplay}
            onPress={() => setIsEditingTitle(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.titleText}>{question.title}</Text>
            <Text style={styles.editHint}>Tap to edit</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Options */}
      <View style={styles.optionsContainer}>
        <Text style={styles.optionsLabel}>Answer Options</Text>
        
        {question.options?.map((option, index) => (
          <OptionEditor
            key={index}
            option={option}
            optionIndex={index}
            questionId={question.id}
            onRemove={() => handleRemoveOption(index)}
            canRemove={(question.options?.length || 0) > 2}
          />
        ))}
        
        {/* Add Option */}
        {showAddOption ? (
          <View style={styles.addOptionContainer}>
            <TextInput
              style={styles.addOptionInput}
              value={newOptionText}
              onChangeText={setNewOptionText}
              placeholder="Enter new option..."
              placeholderTextColor="#9CA3AF"
              autoFocus
              onSubmitEditing={handleAddOption}
            />
            <View style={styles.addOptionActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowAddOption(false);
                  setNewOptionText('');
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddOption}
                activeOpacity={0.7}
              >
                <Text style={styles.saveButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addOptionButton}
            onPress={() => setShowAddOption(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.addOptionIcon}>+</Text>
            <Text style={styles.addOptionText}>Add Option</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  questionNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  questionInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questionType: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  requiredBadge: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  titleContainer: {
    marginBottom: 20,
  },
  titleEditContainer: {
    borderWidth: 2,
    borderColor: '#667eea',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    padding: 16,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  titleActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    paddingTop: 0,
    gap: 8,
  },
  titleDisplay: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    minHeight: 60,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 24,
  },
  editHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    fontStyle: 'italic',
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  addOptionContainer: {
    borderWidth: 2,
    borderColor: '#667eea',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    marginTop: 8,
  },
  addOptionInput: {
    fontSize: 16,
    color: '#111827',
    padding: 16,
    minHeight: 50,
  },
  addOptionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    paddingTop: 0,
    gap: 8,
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginTop: 8,
  },
  addOptionIcon: {
    fontSize: 18,
    color: '#6B7280',
    marginRight: 6,
  },
  addOptionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#667eea',
  },
  saveButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});