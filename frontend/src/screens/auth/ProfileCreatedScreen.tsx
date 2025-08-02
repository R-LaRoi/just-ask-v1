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
    backgroundColor: '#f4f4f8',
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
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  description: {
    fontSize: 16,
    color: '#888',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
    minWidth: 200,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});