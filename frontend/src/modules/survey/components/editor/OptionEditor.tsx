import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useSurveyEditorStore } from '../../stores/surveyEditorStore';
import { useEditorStore } from '../../stores/editorStore';

interface OptionEditorProps {
  option: string;
  optionIndex: number;
  questionId: number;
  onRemove: () => void;
  canRemove: boolean;
  useEditorStore?: boolean;
}

export default function OptionEditor({
  option,
  optionIndex,
  questionId,
  onRemove,
  canRemove,
  useEditorStore: useEditorStoreProp
}: OptionEditorProps) {
  // Use surveyEditorStore functions
  const { updateOption: updateOptionSurvey } = useSurveyEditorStore();
  
  // Use editorStore functions
  const { updateOption: updateOptionEditor } = useEditorStore();

  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState(option);

  const handleSave = () => {
    console.log('🔄 OptionEditor handleSave called:', {
      useEditorStoreProp,
      questionId,
      optionIndex,
      tempText,
      originalOption: option
    });
    
    if (useEditorStoreProp) {
      console.log('📝 Using editorStore updateOption');
      updateOptionEditor(questionId, optionIndex, tempText);
    } else {
      console.log('📝 Using surveyEditorStore updateOption');
      updateOptionSurvey(questionId, optionIndex.toString(), tempText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    console.log('❌ OptionEditor handleCancel called');
    setTempText(option);
    setIsEditing(false);
  };

  const handleRemoveClick = () => {
    console.log('🗑️ OptionEditor trash icon clicked!', {
      canRemove,
      questionId,
      optionIndex,
      option,
      useEditorStoreProp
    });
    
    if (onRemove) {
      console.log('✅ Calling onRemove function');
      onRemove();
    } else {
      console.log('❌ onRemove function is not defined!');
    }
  };

  console.log('🔍 OptionEditor render:', {
    option,
    optionIndex,
    questionId,
    canRemove,
    useEditorStoreProp,
    hasOnRemove: !!onRemove
  });

  return (
    <View style={styles.container}>
      {/* Drag Handle */}
      <View style={styles.dragHandle}>
        <View style={styles.dragDots} />
        <View style={styles.dragDots} />
        <View style={styles.dragDots} />
      </View>

      {/* Option Content */}
      <View style={styles.optionContent}>
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.editInput}
              value={tempText}
              onChangeText={setTempText}
              placeholder="Enter option text..."
              placeholderTextColor="#9CA3AF"
              autoFocus
              onSubmitEditing={handleSave}
            />
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>✕</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                activeOpacity={0.7}
              >
                <Text style={styles.saveButtonText}>✓</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.optionDisplay}
            onPress={() => {
              console.log('📝 Option text clicked, entering edit mode');
              setIsEditing(true);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.optionRadio} />
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Remove Button */}
      {canRemove && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={handleRemoveClick}
          activeOpacity={0.7}
        >
          <Text style={styles.removeButtonText}>🗑️</Text>
        </TouchableOpacity>
      )}
      
      {!canRemove && (
        <View style={styles.removeButton}>
          <Text style={[styles.removeButtonText, { opacity: 0.3 }]}>🗑️</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 8,
    minHeight: 50,
  },
  dragHandle: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  dragDots: {
    width: 3,
    height: 3,
    backgroundColor: '#9CA3AF',
    borderRadius: 1.5,
    marginVertical: 1,
  },
  optionContent: {
    flex: 1,
    paddingVertical: 8,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    marginRight: 8,
  },
  editActions: {
    flexDirection: 'row',
    gap: 4,
  },
  optionDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  removeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  removeButtonText: {
    fontSize: 16,
  },
  cancelButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  saveButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});