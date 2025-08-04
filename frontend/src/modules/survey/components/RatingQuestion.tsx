import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Question } from '../types/survey';

interface RatingQuestionProps {
  question: Question;
  rating?: number;
  onAnswer: (rating: number) => void;
}

export default function RatingQuestion({
  question,
  rating,
  onAnswer
}: RatingQuestionProps) {
  const maxRating = question.maxValue || 5;
  const minRating = question.minValue || 1;

  const handleRatingPress = (value: number) => {
    onAnswer(value);
  };

  const renderNumberScale = () => {
    const numbers = [];
    for (let i = minRating; i <= maxRating; i++) {
      numbers.push(i);
    }

    return (
      <View style={styles.numbersContainer}>
        {numbers.map((number) => {
          const isSelected = rating === number;

          return (
            <TouchableOpacity
              key={number}
              style={[
                styles.numberButton,
                isSelected && styles.selectedNumberButton,
              ]}
              onPress={() => handleRatingPress(number)}
            >
              <Text
                style={[
                  styles.numberText,
                  isSelected && styles.selectedNumberText,
                ]}
              >
                {number}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderNumberScale()}

      {rating && (
        <Text style={styles.ratingLabel}>
          Rating: {rating}/{maxRating}
        </Text>
      )}

      <Text style={styles.helpText}>
        {question.description || 'Select a rating from 1 to 5'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    alignItems: 'center',
  },
  numbersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  numberButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
  },
  selectedNumberButton: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  numberText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  selectedNumberText: {
    color: '#FFFFFF',
  },
  ratingLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '500',
  },
  helpText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
});