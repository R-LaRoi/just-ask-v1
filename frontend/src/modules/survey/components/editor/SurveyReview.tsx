import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Share,
  Dimensions,
} from 'react-native';
// import Clipboard from '@react-native-clipboard/clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { SurveyTemplate } from '../../types/survey';
import DemoPreview from './DemoPreview';

const { width } = Dimensions.get('window');

interface SurveyReviewProps {
  template: SurveyTemplate;
  onEdit: () => void;
  onSave: () => Promise<void>;
}

import { useSurveyEditorStore } from '../../stores/surveyEditorStore';

export default function SurveyReview({ template, onEdit, onSave }: SurveyReviewProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [shareUrl, setShareUrl] = useState(`https://justask.app/survey/${template.id}`);
  const { saveSurvey } = useSurveyEditorStore();

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Use the store's saveSurvey method which calls the API
      const response = await saveSurvey();

      // Update share URL from response
      if (response && response.shareUrl) {
        setShareUrl(response.shareUrl);
      }

      Alert.alert(
        'Survey Saved! 🎉',
        'Your survey has been saved successfully and is ready to share.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Save Failed',
        'There was an error saving your survey. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartDemo = () => {
    setShowDemo(true);
  };

  const handleDemoComplete = () => {
    setShowDemo(false);
    Alert.alert(
      'Demo Completed! 🎉',
      'You\'ve successfully tested your survey. Ready to share it with others?',
      [{ text: 'OK' }]
    );
  };

  const handleCopyLink = async () => {
    try {
      // Temporary fallback - you can implement proper clipboard later
      Alert.alert('Copy Link', `Survey link: ${shareUrl}\n\nPlease copy this link manually.`);
    } catch (error) {
      Alert.alert('Copy Failed', 'Unable to copy link to clipboard.');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my survey: ${template.title}\n\n${shareUrl}`,
        url: shareUrl,
        title: template.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderQuestionPreview = (question: any, index: number) => {
    const getQuestionTypeIcon = (type: string) => {
      switch (type) {
        case 'multiple_choice': return '☑️';
        case 'text_input': return '📝';
        case 'rating': return '⭐';
        case 'slider': return '🎚️';
        case 'date': return '📅';
        case 'file_upload': return '📎';
        default: return '❓';
      }
    };

    return (
      <View key={question.id} style={styles.questionPreview}>
        <View style={styles.questionHeader}>
          <View style={styles.questionNumber}>
            <Text style={styles.questionNumberText}>{index + 1}</Text>
          </View>
          <View style={styles.questionInfo}>
            <View style={styles.questionTitleRow}>
              <Text style={styles.questionTypeIcon}>
                {getQuestionTypeIcon(question.type)}
              </Text>
              <Text style={styles.questionTitle}>{question.title}</Text>
              {question.required && (
                <Text style={styles.requiredBadge}>Required</Text>
              )}
            </View>
            {question.description && (
              <Text style={styles.questionDescription}>{question.description}</Text>
            )}
          </View>
        </View>

        {question.options && (
          <View style={styles.optionsPreview}>
            {question.options.slice(0, 3).map((option: string, optIndex: number) => (
              <View key={optIndex} style={styles.optionItem}>
                <Text style={styles.optionBullet}>•</Text>
                <Text style={styles.optionText}>{option}</Text>
              </View>
            ))}
            {question.options.length > 3 && (
              <Text style={styles.moreOptions}>
                +{question.options.length - 3} more options
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  // If demo is active, show demo screen
  if (showDemo) {
    return (
      <View style={styles.container}>
        <View style={styles.demoHeader}>
          <TouchableOpacity
            style={styles.backToDemoButton}
            onPress={() => setShowDemo(false)}
          >
            <Text style={styles.backToDemoButtonText}>← Back to Review</Text>
          </TouchableOpacity>
          <Text style={styles.demoTitle}>Survey Demo</Text>
        </View>
        <DemoPreview
          template={template}
          onComplete={handleDemoComplete}
          useEditorStore={false}
        />
      </View>
    );
  }

  // Main review screen
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Survey Overview */}
        <View style={styles.overviewSection}>
          <View style={styles.surveyHeader}>
            <Text style={styles.surveyIcon}>{template.icon}</Text>
            <View style={styles.surveyInfo}>
              <Text style={styles.surveyTitle}>{template.title}</Text>
              <Text style={styles.surveyDescription}>{template.description}</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
              <Text style={styles.editButtonText}>✏️ Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{template.questionCount}</Text>
              <Text style={styles.statLabel}>Questions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{template.estimatedTime}</Text>
              <Text style={styles.statLabel}>Est. Time</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {template.questions.filter(q => q.required).length}
              </Text>
              <Text style={styles.statLabel}>Required</Text>
            </View>
          </View>
        </View>

        {/* Questions Preview */}
        <View style={styles.questionsSection}>
          <Text style={styles.sectionTitle}>Questions Preview</Text>
          {template.questions.map((question, index) =>
            renderQuestionPreview(question, index)
          )}
        </View>

        {/* Sharing Options */}
        <View style={styles.sharingSection}>
          <Text style={styles.sectionTitle}>Share Your Survey</Text>

          {/* Survey Link */}
          <View style={styles.linkContainer}>
            <Text style={styles.linkLabel}>Survey Link</Text>
            <View style={styles.linkRow}>
              <Text style={styles.linkText} numberOfLines={1}>{shareUrl}</Text>
              <TouchableOpacity style={styles.copyButton} onPress={handleCopyLink}>
                <Text style={styles.copyButtonText}>📋 Copy</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* QR Code */}
          <View style={styles.qrSection}>
            <Text style={styles.qrLabel}>QR Code</Text>
            <View style={styles.qrContainer}>
              <View style={styles.qrPlaceholder}>
                <Text style={styles.qrIcon}>📱</Text>
                <Text style={styles.qrText}>QR Code</Text>
                <Text style={styles.qrSubtext}>Scan to access survey</Text>
              </View>
              <TouchableOpacity style={styles.downloadQrButton}>
                <Text style={styles.downloadQrText}>💾 Download</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Share Actions */}
          <View style={styles.shareActions}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Text style={styles.shareButtonText}>📤 Share Link</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.embedButton}>
              <Text style={styles.embedButtonText}>🔗 Embed Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar - Mobile First */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <LinearGradient
            colors={isSaving ? ['#9CA3AF', '#6B7280'] : ['#667eea', '#764ba2']}
            style={styles.saveButtonGradient}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? '💾 Saving...' : '🚀 Save & Publish'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.demoBottomButton}
          onPress={handleStartDemo}
        >
          <Text style={styles.demoBottomButtonText}>▶️ Test Demo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editBottomButton}
          onPress={onEdit}
        >
          <Text style={styles.editBottomButtonText}>✏️ Edit Survey</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(15, 15, 15, 1)', // Changed from #0b0b0b
  },
  scrollView: {
    flex: 1,
  },
  // Demo-specific styles
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(15, 15, 15, 1)', // Changed from #0b0b0b
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
  },
  backToDemoButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(15, 15, 15, 1)', // Changed from #333333
    borderRadius: 8,
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(55, 55, 55, 0.72)',
  },
  backToDemoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff', // Changed from #374151 to white
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff', // Changed from #111827 to white
  },
  // Existing styles
  overviewSection: {
    padding: 24,
    backgroundColor: 'rgba(15, 15, 15, 1)', // Changed from #0b0b0b
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff', // Changed from #F3F4F6 to white
  },
  surveyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  surveyIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  surveyInfo: {
    flex: 1,
  },
  surveyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff', // Changed from #111827 to white
    marginBottom: 4,
  },
  surveyDescription: {
    fontSize: 16,
    color: '#cccccc', // Changed from #6B7280 to light gray
    lineHeight: 24,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(15, 15, 15, 1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(55, 55, 55, 0.72)',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff', // Changed from #374151 to white
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ffffff', // Changed from #F3F4F6 to white
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff', // Changed from '#f7fd04' to white
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#ffffff', // Changed from '#cccccc' to white
    fontWeight: '500',
  },
  questionsSection: {
    padding: 24,
    backgroundColor: 'rgba(15, 15, 15, 1)', // Changed from #0b0b0b
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff', // Changed from #111827 to white
    marginBottom: 16,
  },
  questionPreview: {
    backgroundColor: 'rgba(15, 15, 15, 1)', // Changed from #1a1a1a
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(55, 55, 55, 0.72)',
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  questionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff', // Changed from '#f7fd04' to white
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  questionNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000', // Keeping black for contrast with white background
  },
  questionInfo: {
    flex: 1,
  },
  questionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  questionTypeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff', // Changed from #111827 to white
    flex: 1,
  },
  requiredBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: '#EF4444',
    backgroundColor: '#2a1a1a', // Changed from #FEF2F2 to dark background
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#EF4444', // Added red border
  },
  questionDescription: {
    fontSize: 14,
    color: '#cccccc', // Changed from #6B7280 to light gray
    lineHeight: 20,
  },
  optionsPreview: {
    marginTop: 12,
    paddingLeft: 40,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  optionBullet: {
    fontSize: 16,
    color: '#ffffff', // Changed from #9CA3AF to white
    marginRight: 8,
  },
  optionText: {
    fontSize: 14,
    color: '#cccccc', // Changed from #374151 to light gray
  },
  moreOptions: {
    fontSize: 12,
    color: '#cccccc', // Changed from #6B7280 to light gray
    fontStyle: 'italic',
    marginTop: 4,
  },
  sharingSection: {
    padding: 24,
    backgroundColor: 'rgba(15, 15, 15, 1)', // Changed from #0b0b0b
  },
  linkContainer: {
    marginBottom: 24,
  },
  linkLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff', // Changed from #374151 to white
    marginBottom: 8,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 15, 15, 1)', // Changed from #1a1a1a
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(55, 55, 55, 0.72)',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    color: '#cccccc', // Changed from #6B7280 to light gray
    marginRight: 12,
  },
  copyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f7fd04', // Changed to your progress color
    borderRadius: 6,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000', // Changed to black for contrast
  },
  qrSection: {
    marginBottom: 24,
  },
  qrLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff', // Changed from #374151 to white
    marginBottom: 8,
  },
  qrContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 15, 15, 1)', // Changed from #1a1a1a
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(55, 55, 55, 0.72)',
    padding: 16,
  },
  qrPlaceholder: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  qrIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  qrText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff', // Changed from #374151 to white
    marginBottom: 4,
  },
  qrSubtext: {
    fontSize: 12,
    color: '#cccccc', // Changed from #6B7280 to light gray
  },
  downloadQrButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(15, 15, 15, 1)', // Changed from #333333
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(55, 55, 55, 0.72)',
  },
  downloadQrText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff', // Changed from #374151 to white
  },
  shareActions: {
    flexDirection: 'row',
    gap: 12,
  },
  shareButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#10B981',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(55, 55, 55, 0.72)',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  embedButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#6B7280',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(55, 55, 55, 0.72)',
  },
  embedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomBar: {
    flexDirection: 'column',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 34,
    backgroundColor: 'rgba(15, 15, 15, 1)', // Changed from #0b0b0b
    borderTopWidth: 1,
    borderTopColor: '#ffffff',
    gap: 12,
  },
  editBottomButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: 'rgba(15, 15, 15, 1)', // Changed from #333333
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(55, 55, 55, 0.72)',
  },
  editBottomButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff', // Changed from #374151 to white
  },
  demoBottomButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#10B981',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(55, 55, 55, 0.72)', // Changed from #ffffff
  },
  demoBottomButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  saveButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(55, 55, 55, 0.72)', // Changed from #ffffff
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonGradient: {
    paddingVertical: 18, // Slightly larger for primary action
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});