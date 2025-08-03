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
import Clipboard from '@react-native-clipboard/clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { SurveyTemplate } from '../../types/survey';
import DemoPreview from './DemoPreview';

const { width } = Dimensions.get('window');

interface SurveyReviewProps {
  template: SurveyTemplate;
  onEdit: () => void;
  onSave: () => Promise<void>;
}

export default function SurveyReview({ template, onEdit, onSave }: SurveyReviewProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [shareUrl] = useState(`https://justask.app/survey/${template.id}`);
  const [qrCodeUrl] = useState(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave();
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

  // Update the handleCopyLink function to use a fallback:
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

      return (
        <View style={styles.container}>
          {/* Bottom Action Bar */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.editBottomButton}
              onPress={onEdit}
            >
              <Text style={styles.editBottomButtonText}>✏️ Edit Survey</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.demoBottomButton}
              onPress={handleStartDemo}
            >
              <Text style={styles.demoBottomButtonText}>▶️ Test Demo</Text>
            </TouchableOpacity>

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
          </View>
        </View>
      );
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  overviewSection: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
    color: '#111827',
    marginBottom: 4,
  },
  surveyDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#667eea',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  questionsSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  questionPreview: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  questionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  questionNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
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
    color: '#111827',
    flex: 1,
  },
  requiredBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: '#EF4444',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  questionDescription: {
    fontSize: 14,
    color: '#6B7280',
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
    color: '#9CA3AF',
    marginRight: 8,
  },
  optionText: {
    fontSize: 14,
    color: '#374151',
  },
  moreOptions: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 4,
  },
  sharingSection: {
    padding: 24,
    backgroundColor: '#F9FAFB',
  },
  linkContainer: {
    marginBottom: 24,
  },
  linkLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    marginRight: 12,
  },
  copyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#667eea',
    borderRadius: 6,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  qrSection: {
    marginBottom: 24,
  },
  qrLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  qrContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    color: '#374151',
    marginBottom: 4,
  },
  qrSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  downloadQrButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  downloadQrText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
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
  },
  embedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  editBottomButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
  },
  editBottomButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  saveButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});