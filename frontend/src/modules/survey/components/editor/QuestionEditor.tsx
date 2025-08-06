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
import { useEditorStore } from '../../stores/editorStore';
import { Question } from '../../types/survey';
import OptionEditor from '../editor/OptionEditor';

interface QuestionEditorProps {
  question: Question;
  questionIndex: number;
  isLast?: boolean;
  useEditorStore?: boolean;
}

export default function QuestionEditor({ question, questionIndex, isLast, useEditorStore: useEditorStoreProp }: QuestionEditorProps) {
  const {
    updateQuestionText: updateQuestionTextSurvey,
    addOption: addOptionSurvey,
    removeOption: removeOptionSurvey,
    reorderOptions: reorderOptionsSurvey,
    deleteQuestion: deleteQuestionSurvey,
  } = useSurveyEditorStore();

  const {
    updateQuestion,
    addOption: addOptionEditor,
    deleteOption,
    deleteQuestion: deleteQuestionEditor,
    reorderOptions: reorderOptionsEditor,
  } = useEditorStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(question.title);
  const [showAddOption, setShowAddOption] = useState(false);
  const [newOptionText, setNewOptionText] = useState('');

  const handleTitleSave = () => {
    if (useEditorStoreProp) {
      updateQuestion(question.id, { title: tempTitle });
    } else {
      updateQuestionTextSurvey(question.id, tempTitle);
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTempTitle(question.title);
    setIsEditingTitle(false);
  };

  const handleAddOption = () => {
    if (newOptionText.trim()) {
      if (useEditorStoreProp) {
        addOptionEditor(question.id, newOptionText.trim());
      } else {
        addOptionSurvey(question.id, newOptionText.trim());
      }
      setNewOptionText('');
      setShowAddOption(false);
    }
  };

  const handleRemoveOption = (optionIndex: number) => {
    // Replace all console.log statements to remove emojis:
    console.log('QuestionEditor handleRemoveOption called:', {
      optionIndex,
      questionId: question.id,
      optionsLength: question.options?.length,
      useEditorStoreProp,
      optionToRemove: question.options?.[optionIndex]
    });

    if (question.options && question.options.length > 2) {
      console.log('🔄 Performing direct deletion (no confirmation)');

      if (useEditorStoreProp) {
        console.log('📝 Using editorStore deleteOption');
        try {
          deleteOption(question.id, optionIndex);
          console.log('✅ deleteOption called successfully');
        } catch (error) {
          console.error('❌ Error calling deleteOption:', error);
        }
      } else {
        console.log('📝 Using surveyEditorStore removeOption');
        try {
          removeOptionSurvey(question.id, optionIndex.toString());
          console.log('✅ removeOptionSurvey called successfully');
        } catch (error) {
          console.error('❌ Error calling removeOptionSurvey:', error);
        }
      }
    } else {
      console.log('❌ Cannot remove option - minimum 2 options required');
      console.log('⚠️ Questions must have at least 2 options.');
    }
  };

  const handleDeleteQuestion = () => {
    console.log('🗑️ QuestionEditor handleDeleteQuestion called:', {
      questionId: question.id,
      questionTitle: question.title,
      useEditorStoreProp,
      questionIndex
    });
    
    // TEMPORARY: Skip Alert and directly call delete for testing
    console.log('🔥 Bypassing Alert - directly calling delete...');
    console.log('🔍 Store functions available:', {
      deleteQuestionEditor: typeof deleteQuestionEditor,
      deleteQuestionSurvey: typeof deleteQuestionSurvey
    });
    
    try {
      if (useEditorStoreProp) {
        console.log('📝 Using editorStore deleteQuestionEditor with questionId:', question.id);
        deleteQuestionEditor(question.id);
        console.log('✅ deleteQuestionEditor called successfully');
      } else {
        console.log('📝 Using surveyEditorStore deleteQuestionSurvey with questionId:', question.id);
        deleteQuestionSurvey(question.id);
        console.log('✅ deleteQuestionSurvey called successfully');
      }
    } catch (error) {
      console.error('❌ Error in delete operation:', error);
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

        {/* Delete Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteQuestion}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteButtonText}>⊖</Text>
        </TouchableOpacity>
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
            useEditorStore={useEditorStoreProp}
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
    backgroundColor: 'rgba(15, 15, 15, 1)', // Changed from #1a1a1a
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(55, 55, 55, 0.72)',
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
    backgroundColor: '#f7fd04', // Changed to your progress color
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  questionNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000', // Changed to black for contrast with yellow
  },
  questionInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questionType: {
    fontSize: 14,
    color: '#cccccc', // Changed from #6B7280 to light gray
    fontWeight: '500',
  },
  requiredBadge: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
    backgroundColor: '#2a1a1a', // Changed from #FEF2F2 to dark background
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444', // Added red border
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(15, 15, 15, 1)', // Changed from #333333
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: 'rgba(55, 55, 55, 0.72)',
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#ffffff', // Added white color
  },
  titleContainer: {
    marginBottom: 20,
  },
  titleEditContainer: {
    borderWidth: 2,
    borderColor: '#f7fd04', // Changed from #667eea to your progress color
    borderRadius: 12,
    backgroundColor: 'rgba(15, 15, 15, 1)', // Changed from #2a2a2a
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff', // Changed from #111827 to white
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
    backgroundColor: 'rgba(15, 15, 15, 1)', // Changed from #2a2a2a
    borderWidth: 1,
    borderColor: 'rgba(55, 55, 55, 0.72)',
    borderRadius: 12,
    padding: 16,
    minHeight: 60,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff', // Changed from #111827 to white
    lineHeight: 24,
  },
  editHint: {
    fontSize: 12,
    color: '#cccccc', // Changed from #9CA3AF to light gray
    marginTop: 4,
    fontStyle: 'italic',
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff', // Changed from #374151 to white
    marginBottom: 12,
  },
  addOptionContainer: {
    borderWidth: 2,
    borderColor: '#f7fd04', // Changed from #667eea to your progress color
    borderRadius: 12,
    backgroundColor: 'rgba(15, 15, 15, 1)', // Changed from #2a2a2a
    marginTop: 8,
  },
  addOptionInput: {
    fontSize: 16,
    color: '#ffffff', // Changed from #111827 to white
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
    backgroundColor: 'rgba(15, 15, 15, 1)', // Changed from #333333
    borderWidth: 1,
    borderColor: 'rgba(55, 55, 55, 0.72)',
    marginTop: 8,
  },
  addOptionIcon: {
    fontSize: 18,
    color: '#ffffff', // Changed from #6B7280 to white
    marginRight: 6,
  },
  addOptionText: {
    fontSize: 14,
    color: '#ffffff', // Changed from #6B7280 to white
    fontWeight: '500',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: 'rgba(15, 15, 15, 1)', // Changed from #333333
    borderWidth: 1,
    borderColor: 'rgba(55, 55, 55, 0.72)',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#ffffff', // Changed from #6B7280 to white
    fontWeight: '500',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#f7fd04', // Changed from #667eea to your progress color
    borderWidth: 1,
    borderColor: '#000000', // Added black border for contrast
  },
  saveButtonText: {
    fontSize: 14,
    color: '#000000', // Changed from #FFFFFF to black for contrast
    fontWeight: '600',
  },
});