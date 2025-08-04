import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useAuthStore } from '../../stores/authStore';

export default function ProfileCreatedScreen() {
  const { setOnboardingComplete } = useAuthStore();

  const handleContinueToDashboard = () => {
    setOnboardingComplete(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.checkmark}>✅</Text>
        <Text style={styles.title}>Profile Created!</Text>
        <Text style={styles.subtitle}>
          Welcome to Just Ask! Your profile has been successfully created.
        </Text>
        <Text style={styles.description}>
          You're all set to start connecting with your audience and getting the answers you need.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleContinueToDashboard}
        >
          <Text style={styles.buttonText}>Continue to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222121', // Dark background to match the image
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  checkmark: {
    fontSize: 80,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff', // White text on dark background
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff', // White text
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  description: {
    fontSize: 16,
    color: '#ffffff', // White text
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#f7fd04', // Bright yellow button to match onboarding
    borderRadius: 25, // Rounded button
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
    minWidth: 200,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#222121', // Dark text on yellow button
    fontSize: 18,
    fontWeight: 'bold',
  },
});