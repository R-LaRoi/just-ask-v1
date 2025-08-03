import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SurveyTemplate } from '../types/survey';

const { width } = Dimensions.get('window');

interface TemplateCardProps {
  template: SurveyTemplate;
  onSelect: (template: SurveyTemplate) => void;
  isSelected?: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onSelect,
  isSelected = false
}) => {
  const gradients = {
    'know-my-audience': ['#667eea', '#764ba2'],
    'product-feedback': ['#f093fb', '#f5576c'],
    'feature-feedback': ['#4facfe', '#00f2fe']
  };

  const gradient = gradients[template.id as keyof typeof gradients] || ['#667eea', '#764ba2'];

  return (
    <TouchableOpacity
      style={[styles.cardContainer, isSelected && styles.selectedCard]}
      onPress={() => onSelect(template)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={gradient as unknown as readonly [string, string]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>{template.icon}</Text>
            {isSelected && (
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedText}>✓</Text>
              </View>
            )}
          </View>

          <Text style={styles.cardTitle}>{template.title}</Text>
          <Text style={styles.cardDescription}>{template.description}</Text>
          <Text style={styles.cardCompletion}>✓ {template.completionRate}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 16,
  },
  selectedCard: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    minHeight: 140,
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardIcon: {
    fontSize: 32,
  },
  selectedBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 8,
  },
  cardCompletion: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
    fontWeight: '500',
  },
});

export default TemplateCard;