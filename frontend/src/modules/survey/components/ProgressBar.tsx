import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
}

export default function ProgressBar({ progress, height = 4 }: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const isActive = clampedProgress > 0;

  return (
    <View style={styles.container}>
      {/* Progress Number Display */}
      <View style={styles.progressTextContainer}>
        <Text style={styles.progressText}>
          {Math.round(clampedProgress)}%
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressContainer, { height }]}>
        <View style={[
          styles.background,
          { backgroundColor: isActive ? '#f7fd04' : '#FFFFFF' }
        ]}>
          <View
            style={[
              styles.progress,
              {
                width: `${clampedProgress}%`,
                backgroundColor: isActive ? '#f7fd04' : '#FFFFFF'
              }
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
    alignItems: 'center',
  },
  progressTextContainer: {
    backgroundColor: '#000000',
    borderWidth: 0.5,
    borderColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
    alignSelf: 'center',
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
  },
  background: {
    flex: 1,
    borderRadius: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  progress: {
    height: '100%',
    borderRadius: 2,
  },
});