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
        <View style={[styles.templateContent, isSelected && styles.templateContentSelected]}>
          <View style={styles.templateHeader}>
            <Text style={styles.templateIcon}>{template.icon}</Text>
            <View style={styles.templateInfo}>
              <Text style={styles.templateTitle}>
                {template.title}
              </Text>
              <Text style={styles.templateDescription}>
                {template.description}
              </Text>
            </View>
          </View>

          <View style={styles.templateStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {template.questionCount}
              </Text>
              <Text style={styles.statLabel}>
                Questions
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {template.estimatedTime}
              </Text>
              <Text style={styles.statLabel}>
                Duration
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {template.completionRate.split('%')[0]}%
              </Text>
              <Text style={styles.statLabel}>
                Completion
              </Text>
            </View>
          </View>

          {isSelected && (
            <View style={styles.selectedIndicator}>
              <Text style={styles.selectedIcon}>✓</Text>
            </View>
          )}
        </View>
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
          <View style={styles.createNewContent}>
            <View style={styles.createNewTextContainer}>
              <Text style={styles.createNewIcon}>+</Text>
              <Text style={styles.createNewTitle}>Start from Scratch</Text>
              <Text style={styles.createNewSubtitle}>
                Create a custom survey with your own questions
              </Text>
            </View>
            <View style={styles.createNewArrow}>
              <Text style={styles.arrowIcon}>→</Text>
            </View>
          </View>
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
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#000000',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#B0B0B0',
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
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  createNewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  createNewTextContainer: {
    flex: 1,
  },
  createNewIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  createNewTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  createNewSubtitle: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  createNewArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '600',
  },
  templatesSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  templateCard: {
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
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
    shadowColor: '#FFD700',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  templateContent: {
    padding: 20,
    position: 'relative',
  },
  templateContentSelected: {
    backgroundColor: '#000000',
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
    color: '#000000',
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
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
    color: '#000000',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIcon: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '700',
  },
});