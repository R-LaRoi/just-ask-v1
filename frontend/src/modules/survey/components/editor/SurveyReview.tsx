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
import { MaterialIcons } from '@expo/vector-icons'; // Replace this line

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
  const { saveSurvey, initializeEditor } = useSurveyEditorStore();

  // Initialize the store with template data when component mounts
  React.useEffect(() => {
    initializeEditor(template);
  }, [template, initializeEditor]);

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
        'Survey Saved!',
        'Your survey has been saved successfully and is ready to share.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error saving survey:', error);
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

  const handleCopyLink = async () => {
    try {
      // await Clipboard.setString(shareUrl);
      Alert.alert('Link Copied', 'Survey link copied to clipboard!');
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this survey: ${shareUrl}`,
        url: shareUrl,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderQuestionPreview = (question: any, index: number) => {
    const maxOptionsToShow = 3;
    const hasMoreOptions = question.options && question.options.length > maxOptionsToShow;
    const optionsToShow = question.options ? question.options.slice(0, maxOptionsToShow) : [];

    return (
      <View key={question.id || index} style={styles.questionPreview}>
        <View style={styles.questionHeader}>
          <View style={styles.questionNumber}>
            <Text style={styles.questionNumberText}>{index + 1}</Text>
          </View>
          <View style={styles.questionInfo}>
            <View style={styles.questionTitleRow}>
              <Text style={styles.questionTypeIcon}>📝</Text>
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

        {/* Options Preview */}
        {question.options && question.options.length > 0 && (
          <View style={styles.optionsPreview}>
            {optionsToShow.map((option: any, optionIndex: number) => (
              <View key={optionIndex} style={styles.optionItem}>
                <Text style={styles.optionBullet}>•</Text>
                <Text style={styles.optionText}>{option.text || option}</Text>
              </View>
            ))}
            {hasMoreOptions && (
              <Text style={styles.moreOptions}>
                +{question.options.length - maxOptionsToShow} more options
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  if (showDemo) {
    return (
      <View style={styles.container}>
        <View style={styles.demoHeader}>
          <TouchableOpacity
            style={styles.backToDemoButton}
            onPress={() => setShowDemo(false)}
          >
            <Text style={styles.backToDemoButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.demoTitle}>Demo Preview</Text>
        </View>
        <DemoPreview template={template} onComplete={() => setShowDemo(false)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Survey Overview */}
        <View style={styles.overviewSection}>
          <View style={styles.surveyHeader}>
            <View style={styles.surveyInfo}>
              <Text style={styles.surveyTitle}>{template.title}</Text>
              <Text style={styles.surveyDescription}>{template.description}</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Survey Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{template.questions.length}</Text>
              <Text style={styles.statLabel}>Questions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Math.ceil(template.questions.length * 0.5)}
              </Text>
              <Text style={styles.statLabel}>Est. Minutes</Text>
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
                <Text style={styles.copyButtonText}>Copy</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* QR Code */}
          <View style={styles.qrSection}>
            <Text style={styles.qrLabel}>QR Code</Text>
            <View style={styles.qrContainer}>
              <View style={styles.qrPlaceholder}>
                <Text style={styles.qrIcon}>QR</Text>
                <Text style={styles.qrText}>QR Code</Text>
                <Text style={styles.qrSubtext}>Scan to access survey</Text>
              </View>
              <TouchableOpacity style={styles.downloadQrButton}>
                <Text style={styles.downloadQrText}>Download</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Share Actions */}
          <View style={styles.shareActions}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Text style={styles.shareButtonText}>Share Link</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.embedButton}>
              <Text style={styles.embedButtonText}>Embed Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={handleStartDemo}
        >
          <MaterialIcons name="play-arrow" size={24} color="#ffffff" />
          <Text style={styles.navLabel}>Demo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, isSaving && styles.navItemDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <MaterialIcons name="bookmark" size={24} color={isSaving ? "#666666" : "#ffffff"} />
          <Text style={[styles.navLabel, isSaving && styles.navLabelDisabled]}>
            {isSaving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={onEdit}
        >
          <MaterialIcons name="edit" size={24} color="#ffffff" />
          <Text style={styles.navLabel}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(15, 15, 15, 1)',
  },
  scrollView: {
    flex: 1,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(15, 15, 15, 1)',
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
  },
  backToDemoButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(15, 15, 15, 1)',
    borderRadius: 8,
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(55, 55, 55, 0.72)',
  },
  backToDemoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  overviewSection: {
    padding: 24,
    backgroundColor: 'rgba(15, 15, 15, 1)',
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
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
    color: '#ffffff',
    marginBottom: 4,
  },
  surveyDescription: {
    fontSize: 16,
    color: '#cccccc',
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
    color: '#ffffff',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ffffff',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  questionsSection: {
    padding: 24,
    backgroundColor: 'rgba(15, 15, 15, 1)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  questionPreview: {
    backgroundColor: 'rgba(15, 15, 15, 1)',
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
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  questionNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
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
    color: '#ffffff',
    flex: 1,
  },
  requiredBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: '#EF4444',
    backgroundColor: '#2a1a1a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  questionDescription: {
    fontSize: 14,
    color: '#cccccc',
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
    color: '#ffffff',
    marginRight: 8,
  },
  optionText: {
    fontSize: 14,
    color: '#cccccc',
  },
  moreOptions: {
    fontSize: 12,
    color: '#cccccc',
    fontStyle: 'italic',
    marginTop: 4,
  },
  sharingSection: {
    padding: 24,
    backgroundColor: 'rgba(15, 15, 15, 1)',
  },
  linkContainer: {
    marginBottom: 24,
  },
  linkLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 15, 15, 1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(55, 55, 55, 0.72)',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    color: '#cccccc',
    marginRight: 12,
  },
  copyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f7fd04',
    borderRadius: 6,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  qrSection: {
    marginBottom: 24,
  },
  qrLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  qrContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 15, 15, 1)',
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
    color: '#ffffff',
    marginBottom: 4,
  },
  qrSubtext: {
    fontSize: 12,
    color: '#cccccc',
  },
  downloadQrButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(15, 15, 15, 1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(55, 55, 55, 0.72)',
  },
  downloadQrText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
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
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 15, 15, 1)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    paddingBottom: 34,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ffffff',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  navItemDisabled: {
    opacity: 0.5,
  },
  navLabel: {
    fontSize: 12,
    color: '#ffffff',
    marginTop: 4,
    fontWeight: '500',
  },
  navLabelDisabled: {
    color: '#666666',
  },
});