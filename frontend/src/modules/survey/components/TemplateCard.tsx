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
    'know-my-audience': ['#FFFFFF', '#FFFFFF'], // Changed to white
    'product-feedback': ['#f7fd04', '#f7fd04'], // Changed to your yellow
    'simple-poll': ['#FFFFFF', '#f7fd04'],  // White to yellow gradient
    'feature-feedback': ['#f7fd04', '#FFFFFF']  // Yellow to white gradient
  };

  const gradient = gradients[template.id as keyof typeof gradients] || ['#FFFFFF', '#FFFFFF'];

  // Determine text color based on background
  const isWhiteBackground = gradient[0] === '#FFFFFF' && gradient[1] === '#FFFFFF';
  const textColor = isWhiteBackground ? '#000000' : '#000000'; // Black text for both white and yellow

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
            <Text style={[styles.cardIcon, { color: textColor }]}>{template.icon}</Text>
            {isSelected && (
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedText}>✓</Text>
              </View>
            )}
          </View>

          <Text style={[styles.cardTitle, { color: textColor }]}>{template.title}</Text>
          <Text style={[styles.cardDescription, { color: textColor, opacity: 0.7 }]}>{template.description}</Text>
          <Text style={[styles.cardCompletion, { color: textColor, opacity: 0.6 }]}>✓ {template.completionRate}</Text>
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
    borderWidth: 0.5,
    borderColor: '#000000', // Added black border
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
    backgroundColor: '#000000', // Changed to black background
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#FFFFFF', // White border
  },
  selectedText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  cardCompletion: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default TemplateCard;