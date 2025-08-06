import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSurveyEditorStore } from '../stores/surveyEditorStore';
import { useTemplateStore } from '../stores/templateStore';
import { SurveyTemplate } from '../types/survey';
import SurveyEditor from '../components/editor/SurveyEditor';
import DemoPreview from '../components/editor/DemoPreview';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../types/navigation';
const { width, height } = Dimensions.get('window');

type SurveyTemplateEditorScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SurveyTemplateEditor'>;
import { RouteProp } from '@react-navigation/native';
type SurveyTemplateEditorScreenRouteProp = RouteProp<RootStackParamList, 'SurveyTemplateEditor'>;


interface RouteParams {
  template?: SurveyTemplate;
}
interface DemoPreviewProps {
  template: SurveyTemplate;
  onComplete: () => void;
}
export default function SurveyTemplateEditorScreen() {
  const navigation = useNavigation<SurveyTemplateEditorScreenNavigationProp>();
  const route = useRoute<SurveyTemplateEditorScreenRouteProp>();
  const { template } = (route.params as RouteParams) || {};

  const {
    title,
    questions,
    demoMode,
    initializeEditor,
    startDemo,
    resetDemo,
    exportSurvey
  } = useSurveyEditorStore();

  const [viewMode, setViewMode] = useState<'edit' | 'demo'>('edit');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      initializeEditor(template);
      setIsInitialized(true);
    }
  }, [template, initializeEditor, isInitialized]);

  const handleBack = () => {
    Alert.alert(
      'Discard Changes?',
      'Are you sure you want to go back? Any unsaved changes will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() }
      ]
    );
  };

  const handleToggleDemo = () => {
    if (viewMode === 'edit') {
      setViewMode('demo');
      startDemo();
    } else {
      setViewMode('edit');
      resetDemo();
    }
  };

  const handleSaveSurvey = () => {
    const survey = exportSurvey();
    navigation.navigate('SurveyReview', { survey });
  };

  const handleDemoComplete = () => {
    Alert.alert(
      'Thank you for completing the survey!',
      'Your demo responses have been recorded. Ready to save your survey?',
      [
        { text: 'Continue Editing', onPress: () => setViewMode('edit') },
        { text: 'Save Survey', onPress: handleSaveSurvey }
      ]
    );
  };

  if (!isInitialized) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading Editor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>
            {questions.length} questions • {Math.ceil(questions.length * 0.7)} min
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.modeButton, viewMode === 'demo' && styles.demoModeButton]}
          onPress={handleToggleDemo}
          activeOpacity={0.8}
        >
          <Text style={[styles.modeButtonText, viewMode === 'demo' && styles.demoModeButtonText]}>
            {viewMode === 'edit' ? 'Demo' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Demo Mode Banner */}
      {viewMode === 'demo' && (
        <LinearGradient
          colors={['#FF6B6B', '#FF8E8E']}
          style={styles.demoBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.demoBannerText}>DEMO MODE</Text>
          <Text style={styles.demoBannerSubtext}>Interactive preview • Changes reset demo</Text>
        </LinearGradient>
      )}

      {/* Content */}
      <View style={styles.content}>
        {viewMode === 'edit' ? (
          <SurveyEditor />
        ) : (
          <DemoPreview template={template!} onComplete={handleDemoComplete} />
        )}
      </View>

      {/* Footer Actions */}
      {viewMode === 'edit' && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.previewButton}
            onPress={handleToggleDemo}
            activeOpacity={0.8}
          >
            <Text style={styles.previewButtonText}>Preview Survey</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveSurvey}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>Save & Continue</Text>
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
    fontWeight: '500',
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  backButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  modeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#667eea',
  },
  demoModeButton: {
    backgroundColor: '#FF6B6B',
  },
  modeButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  demoModeButtonText: {
    color: '#FFFFFF',
  },
  demoBanner: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  demoBannerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  demoBannerSubtext: {
    fontSize: 12,
    color: '#FFE5E5',
    marginTop: 2,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 40,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  previewButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  previewButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#667eea',
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
    color: '#FFFFFF',
    fontWeight: '600',
  },
});