import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Question } from '../../types/survey';

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
  const isStarRating = question.subtype === 'star_rating' || !question.subtype;
  const isNumberScale = question.subtype === 'number_scale';
  
  const maxRating = question.maxValue || 5;
  const minRating = question.minValue || 1;
  
  const handleRatingPress = (value: number) => {
    onAnswer(value);
  };

  const renderStarRating = () => {
    return (
      <View style={styles.starsContainer}>
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const isSelected = rating !== undefined && starValue <= rating;
          
          return (
            <TouchableOpacity
              key={index}
              style={styles.starButton}
              onPress={() => handleRatingPress(starValue)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.star,
                isSelected && styles.selectedStar,
              ]}>
                ★
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
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
              activeOpacity={0.7}
            >
              <Text style={[
                styles.numberText,
                isSelected && styles.selectedNumberText,
              ]}>
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
      {isStarRating ? renderStarRating() : renderNumberScale()}
      
      {rating !== undefined && (
        <Text style={styles.ratingLabel}>
          {isStarRating 
            ? `${rating} out of ${maxRating} stars`
            : `Rating: ${rating}`
          }
        </Text>
      )}
      
      {question.description && (
        <Text style={styles.helpText}>{question.description}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  starButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  star: {
    fontSize: 40,
    color: '#E5E7EB',
  },
  selectedStar: {
    color: '#F59E0B',
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