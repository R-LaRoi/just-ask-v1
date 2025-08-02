import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SurveyTemplate } from '../../types/survey';
import { SURVEY_TEMPLATES } from '../../data/templates';

const { width } = Dimensions.get('window');

interface TemplateSelectorProps {
  onSelectTemplate: (template: SurveyTemplate) => void;
  onCreateNew: () => void;
}

export default function TemplateSelector({ onSelectTemplate, onCreateNew }: TemplateSelectorProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const handleTemplateSelect = (template: SurveyTemplate) => {
    setSelectedTemplateId(template.id);
    // Auto-select template after a brief delay for visual feedback
    setTimeout(() => {
      onSelectTemplate(template);
    }, 200);
  };

  const renderTemplateCard = (template: SurveyTemplate) => {
    const isSelected = selectedTemplateId === template.id;

    return (
      <TouchableOpacity
        key={template.id}
        style={[
          styles.templateCard,
          isSelected && styles.templateCardSelected
        ]}
        onPress={() => handleTemplateSelect(template)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isSelected ? ['#667eea', '#764ba2'] : ['#f8fafc', '#e2e8f0']}
          style={styles.templateGradient}
        >
          <View style={styles.templateHeader}>
            <Text style={styles.templateIcon}>{template.icon}</Text>
            <View style={styles.templateInfo}>
              <Text style={[
                styles.templateTitle,
                isSelected && styles.templateTitleSelected
              ]}>
                {template.title}
              </Text>
              <Text style={[
                styles.templateDescription,
                isSelected && styles.templateDescriptionSelected
              ]}>
                {template.description}
              </Text>
            </View>
          </View>

          <View style={styles.templateStats}>
            <View style={styles.statItem}>
              <Text style={[
                styles.statValue,
                isSelected && styles.statValueSelected
              ]}>
                {template.questionCount}
              </Text>
              <Text style={[
                styles.statLabel,
                isSelected && styles.statLabelSelected
              ]}>
                Questions
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[
                styles.statValue,
                isSelected && styles.statValueSelected
              ]}>
                {template.estimatedTime}
              </Text>
              <Text style={[
                styles.statLabel,
                isSelected && styles.statLabelSelected
              ]}>
                Duration
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[
                styles.statValue,
                isSelected && styles.statValueSelected
              ]}>
                {template.completionRate.split('%')[0]}%
              </Text>
              <Text style={[
                styles.statLabel,
                isSelected && styles.statLabelSelected
              ]}>
                Completion
              </Text>
            </View>
          </View>

          {isSelected && (
            <View style={styles.selectedIndicator}>
              <Text style={styles.selectedIcon}>✓</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choose a Template</Text>
        <Text style={styles.headerSubtitle}>
          Start with a proven template or create your own
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Create New Template Option */}
        <TouchableOpacity
          style={styles.createNewCard}
          onPress={onCreateNew}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.createNewGradient}
          >
            <View style={styles.createNewContent}>
              <Text style={styles.createNewIcon}>✨</Text>
              <Text style={styles.createNewTitle}>Start from Scratch</Text>
              <Text style={styles.createNewSubtitle}>
                Create a custom survey with your own questions
              </Text>
            </View>
            <View style={styles.createNewArrow}>
              <Text style={styles.arrowIcon}>→</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Template Options */}
        <View style={styles.templatesSection}>
          <Text style={styles.sectionTitle}>Popular Templates</Text>
          {SURVEY_TEMPLATES.map(renderTemplateCard)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  createNewCard: {
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  createNewGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  createNewContent: {
    flex: 1,
  },
  createNewIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  createNewTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  createNewSubtitle: {
    fontSize: 14,
    color: '#E0E7FF',
    lineHeight: 20,
  },
  createNewArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  templatesSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  templateCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templateCardSelected: {
    shadowColor: '#667eea',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  templateGradient: {
    padding: 20,
    position: 'relative',
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  templateIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  templateInfo: {
    flex: 1,
  },
  templateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  templateTitleSelected: {
    color: '#FFFFFF',
  },
  templateDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  templateDescriptionSelected: {
    color: '#E0E7FF',
  },
  templateStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  statValueSelected: {
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  statLabelSelected: {
    color: '#C7D2FE',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});