import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  Animated,
  Modal,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEditorStore } from '../stores/editorStore';
import { Question, SurveyTemplate } from '../types/survey';
import TemplateSelector from '../components/editor/TemplateSelector';
import QuestionEditor from '../components/editor/QuestionEditor';
import DemoPreview from '../components/editor/DemoPreview';

import SurveyReview from '../components/editor/SurveyReview';

const { width, height } = Dimensions.get('window');

type EditorStep = 'template' | 'edit' | 'demo' | 'review';

export default function SurveyEditorScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { template } = (route.params as { template?: SurveyTemplate }) || {};
  const {
    editingTemplate,
    isDemoMode,
    createNewTemplate,
    loadTemplate,
    updateTemplateTitle,
    updateTemplateDescription,
    addQuestion,
    deleteQuestion,
    startDemo,
    stopDemo,
    saveTemplate
  } = useEditorStore();

  const [currentStep, setCurrentStep] = useState<EditorStep>('template');
  const [showQuestionTypes, setShowQuestionTypes] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (template) {
      loadTemplate(template);
      setCurrentStep('edit'); // Skip template selection if template is provided
    } else if (!editingTemplate) {
      createNewTemplate();
    }
  }, [template]);

  const handleStepChange = (step: EditorStep) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();

    setCurrentStep(step);
  };

  const handleStartDemo = () => {
    startDemo();
    handleStepChange('demo');
  };

  const handleStopDemo = () => {
    stopDemo();
    handleStepChange('edit');
  };

  const handleSaveAndReview = () => {
    handleStepChange('review');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>
          {currentStep === 'template' && 'Choose Template'}
          {currentStep === 'edit' && 'Edit Survey'}
          {currentStep === 'demo' && 'Demo Preview'}
          {currentStep === 'review' && 'Review & Share'}
        </Text>
        {editingTemplate && (
          <Text style={styles.headerSubtitle}>
            {editingTemplate.questionCount} questions
          </Text>
        )}
      </View>

      <View style={styles.headerActions}>
        {/* Remove the demo button from edit step */}
        {currentStep === 'demo' && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleStopDemo}
          >
            <Text style={styles.editButtonText}>✏️ Edit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {['template', 'edit', 'demo', 'review'].map((step, index) => (
        <View key={step} style={styles.stepContainer}>
          <TouchableOpacity
            style={[
              styles.stepDot,
              currentStep === step && styles.stepDotActive,
              index < ['template', 'edit', 'demo', 'review'].indexOf(currentStep) && styles.stepDotCompleted
            ]}
            onPress={() => handleStepChange(step as EditorStep)}
          >
            <Text style={[
              styles.stepNumber,
              (currentStep === step || index < ['template', 'edit', 'demo', 'review'].indexOf(currentStep)) && styles.stepNumberActive
            ]}>
              {index + 1}
            </Text>
          </TouchableOpacity>
          {index < 3 && (
            <View style={[
              styles.stepLine,
              index < ['template', 'edit', 'demo', 'review'].indexOf(currentStep) && styles.stepLineCompleted
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderContent = () => {
    switch (currentStep) {
      case 'template':
        return (
          <TemplateSelector
            onSelectTemplate={(template) => {
              loadTemplate(template);
              handleStepChange('edit');
            }}
            onCreateNew={() => {
              createNewTemplate();
              handleStepChange('edit');
            }}
          />
        );

      case 'edit':
        return (
          <View style={styles.editContainer}>
            {/* Template Header Editing */}
            <View style={styles.templateHeader}>
              <TouchableOpacity
                style={styles.titleContainer}
                onPress={() => setEditingTitle(true)}
              >
                {editingTitle ? (
                  <TextInput
                    style={styles.titleInput}
                    value={editingTemplate?.title}
                    onChangeText={updateTemplateTitle}
                    onBlur={() => setEditingTitle(false)}
                    autoFocus
                    placeholder="Survey Title"
                  />
                ) : (
                  <Text style={styles.templateTitle}>
                    {editingTemplate?.title || 'Untitled Survey'}
                  </Text>
                )}
                <Text style={styles.editIcon}>✏️</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.descriptionContainer}
                onPress={() => setEditingDescription(true)}
              >
                {editingDescription ? (
                  <TextInput
                    style={styles.descriptionInput}
                    value={editingTemplate?.description}
                    onChangeText={updateTemplateDescription}
                    onBlur={() => setEditingDescription(false)}
                    autoFocus
                    placeholder="Survey description"
                  />
                ) : (
                  <Text style={styles.templateDescription}>
                    {editingTemplate?.description || 'Add description'}
                  </Text>
                )}
                <Text style={styles.editIcon}>✏️</Text>
              </TouchableOpacity>
            </View>

            {/* Questions List */}
            <ScrollView style={styles.questionsContainer}>
              {editingTemplate?.questions.map((question, index) => (
                <QuestionEditor
                  key={question.id}
                  question={question}
                  questionIndex={index}
                  isLast={index === editingTemplate.questions.length - 1}
                  useEditorStore={true}
                />
              ))}

              {/* Add Question Button */}
              <TouchableOpacity
                style={styles.addQuestionButton}
                onPress={() => setShowQuestionTypes(true)}
              >
                <Text style={styles.addQuestionIcon}>+</Text>
                <Text style={styles.addQuestionText}>Add Question</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        );

      case 'demo':
        return (
          <DemoPreview
            template={editingTemplate!}
            onComplete={() => handleStepChange('review')}
            useEditorStore={true}
          />
        );

      case 'review':
        return (
          <SurveyReview
            template={editingTemplate!}
            onEdit={() => handleStepChange('edit')}
            onSave={saveTemplate}
          />
        );

      default:
        return null;
    }
  };

  if (!editingTemplate) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {renderHeader()}
      {renderStepIndicator()}

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {renderContent()}
      </Animated.View>

      {/* Question Type Modal */}
      <Modal
        visible={showQuestionTypes}
        transparent
        animationType="slide"
        onRequestClose={() => setShowQuestionTypes(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.questionTypeModal}>
            <Text style={styles.modalTitle}>Add Question</Text>

            // Fix the modal onPress handler (around line 313)
            {[
              { type: 'multiple_choice', icon: '☑️', title: 'Multiple Choice', desc: 'Single or multiple selection' },
              { type: 'text_input', icon: '📝', title: 'Text Input', desc: 'Short or long text response' },
              { type: 'rating', icon: '⭐', title: 'Rating', desc: 'Star rating or number scale' },
              { type: 'slider', icon: '🎚️', title: 'Slider', desc: 'Range selection' },
              { type: 'date', icon: '📅', title: 'Date', desc: 'Date picker' },
              { type: 'file_upload', icon: '📎', title: 'File Upload', desc: 'Image or document upload' }
            ].map((questionType) => (
              <TouchableOpacity
                key={questionType.type}
                style={styles.questionTypeOption}
                onPress={() => {
                  addQuestion(questionType.type as Question['type']);
                  setShowQuestionTypes(false);
                }}
              >
                <Text style={styles.questionTypeIcon}>{questionType.icon}</Text>
                <View style={styles.questionTypeInfo}>
                  <Text style={styles.questionTypeTitle}>{questionType.title}</Text>
                  <Text style={styles.questionTypeDesc}>{questionType.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowQuestionTypes(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Action Bar - Mobile First */}
      {currentStep === 'edit' && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveAndReview}
          >
            <Text style={styles.saveButtonText}>Save & Review</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  headerActions: {
    width: 44,
    alignItems: 'flex-end',
  },
  demoButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#667eea',
    borderRadius: 16,
  },
  demoButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F59E0B',
    borderRadius: 16,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#F9FAFB',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: '#667eea',
  },
  stepDotCompleted: {
    backgroundColor: '#10B981',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  stepLineCompleted: {
    backgroundColor: '#10B981',
  },
  content: {
    flex: 1,
  },
  editContainer: {
    flex: 1,
  },
  templateHeader: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  templateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: '#667eea',
    paddingBottom: 4,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  templateDescription: {
    fontSize: 16,
    color: '#6B7280',
    flex: 1,
  },
  descriptionInput: {
    fontSize: 16,
    color: '#6B7280',
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: '#667eea',
    paddingBottom: 4,
  },
  editIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  questionsContainer: {
    flex: 1,
    padding: 20,
  },
  addQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    marginTop: 16,
  },
  addQuestionIcon: {
    fontSize: 24,
    color: '#667eea',
    marginRight: 8,
  },
  addQuestionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  questionTypeModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: height * 0.8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
  },
  questionTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  questionTypeIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  questionTypeInfo: {
    flex: 1,
  },
  questionTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  questionTypeDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalCloseButton: {
    marginTop: 20,
    marginHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34, // Extra padding for safe area
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveButton: {
    width: '100%',
    paddingVertical: 18,
    backgroundColor: '#667eea',
    borderRadius: 12,
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
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});