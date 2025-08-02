import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTemplateStore } from '../stores/templateStore';
import TemplateCard from '../components/TemplateCard';
import { SurveyTemplate } from '../types/survey';

const TemplateSelectionScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    templates,
    selectTemplate,
    createSurveyFromTemplate,
    error,
    resetError
  } = useTemplateStore();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleTemplateSelect = (template: SurveyTemplate) => {
    setSelectedTemplateId(template.id);
    selectTemplate(template.id);
  };

  const handleContinue = () => {
    if (!selectedTemplateId) {
      Alert.alert('Please select a template', 'Choose a template to continue');
      return;
    }

    createSurveyFromTemplate(selectedTemplateId);

    // Navigate to SurveyPreview (we'll create this next)
    navigation.navigate('SurveyPreview' as never);
  };

  const handleStartFromScratch = () => {
    Alert.alert(
      'Coming Soon!',
      'Custom survey builder will be available in the next update.',
      [{ text: 'OK' }]
    );
  };

  React.useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK', onPress: resetError }
      ]);
    }
  }, [error, resetError]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Pick Your Template</Text>
        <Text style={styles.headerSubtitle}>
          Choose a template to get started quickly
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelect={handleTemplateSelect}
            isSelected={selectedTemplateId === template.id}
          />
        ))}

        <TouchableOpacity
          style={styles.customButton}
          onPress={handleStartFromScratch}
          activeOpacity={0.8}
        >
          <View style={styles.customButtonContent}>
            <Text style={styles.customButtonIcon}>✨</Text>
            <Text style={styles.customButtonTitle}>Start from Scratch</Text>
            <Text style={styles.customButtonSubtitle}>Create a custom survey</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {selectedTemplateId && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue with Template</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTop: {
    marginBottom: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  backButtonText: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100, // Space for footer
  },
  customButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  customButtonContent: {
    alignItems: 'center',
  },
  customButtonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  customButtonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 4,
  },
  customButtonSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  continueButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TemplateSelectionScreen;