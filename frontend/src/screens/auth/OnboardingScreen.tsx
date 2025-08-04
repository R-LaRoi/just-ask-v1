// src/screens/OnboardingScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAuthStore } from '../../stores/authStore';

type FormData = {
  name: string;
  email: string;
  socialHandle: string;
  gender: string;
  age: string;
  location: string;
};

const API_URL = 'http://localhost:3000'; // Change from 192.168.1.100

export default function OnboardingScreen({ navigation }: any) {
  const { user, authToken, setProfileCreated } = useAuthStore(); // Add setProfileCreated
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      socialHandle: '',
      gender: '',
      age: '',
      location: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!authToken) {
      Alert.alert('Error', 'You are not authenticated.');
      return;
    }

    console.log('Starting onboarding submission...', data);
    console.log('Auth token:', authToken ? 'Present' : 'Missing');
    console.log('API URL:', `${API_URL}/api/users/onboarding`);

    setIsSubmitting(true);
    try {
      console.log('Making API request...');
      const response = await fetch(`${API_URL}/api/users/onboarding`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to update profile.');
      }

      const responseData = await response.json();
      console.log('Success response:', responseData);

      // Success! Navigate to confirmation screen
      console.log('Setting profile created to true...');
      setProfileCreated(true); // Set flag to show confirmation screen
      console.log('Profile created flag set successfully');

    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Submission Error', error.message);
    } finally {
      console.log('Setting isSubmitting to false...');
      setIsSubmitting(false);
      console.log('isSubmitting set to false');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>Complete Your Profile</Text>
      <Text style={styles.subHeader}>Let's get to know you a little better.</Text>

      {/* Name Input */}
      <Text style={styles.label}>Name</Text>
      <Controller
        control={control}
        name="name"
        rules={{ required: 'Your name is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            nativeID="name"
            accessibilityLabel="Name"
          />
        )}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

      {/* Email is pre-filled and disabled */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        value={user?.email}
        editable={false}
        nativeID="email"
        accessibilityLabel="Email"
      />

      {/* Social Handle Input */}
      <Text style={styles.label}>Social Handle (e.g., @username)</Text>
      <Controller
        control={control}
        name="socialHandle"
        rules={{ required: 'Social handle is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            nativeID="socialHandle"
            accessibilityLabel="Social Handle"
          />
        )}
      />
      {errors.socialHandle && <Text style={styles.errorText}>{errors.socialHandle.message}</Text>}

      {/* Other Fields */}
      <Text style={styles.label}>Gender (Optional)</Text>
      <Controller
        name="gender"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            onChangeText={onChange}
            value={value}
            nativeID="gender"
            accessibilityLabel="Gender"
          />
        )}
      />

      <Text style={styles.label}>Age (Optional)</Text>
      <Controller
        name="age"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            onChangeText={onChange}
            value={value}
            keyboardType="number-pad"
            nativeID="age"
            accessibilityLabel="Age"
          />
        )}
      />

      <Text style={styles.label}>Location (Optional)</Text>
      <Controller
        name="location"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            onChangeText={onChange}
            value={value}
            nativeID="location"
            accessibilityLabel="Location"
          />
        )}
      />


      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Complete Profile</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222121', // Dark background to match image
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff', // White text on dark background
    marginBottom: 9.2, // Increased by 15% (was 8, now 9.2)
  },
  subHeader: {
    fontSize: 16,
    color: '#ffffff', // White text
    marginBottom: 34.5, // Increased by 15% (was 30, now 34.5)
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff', // White labels
    marginBottom: 6.9, // Increased by 15% (was 6, now 6.9)
    marginTop: 11.5, // Increased by 15% (was 10, now 11.5)
  },
  input: {
    backgroundColor: '#2d2c2c', // Dark background
    borderWidth: 0, // No border
    borderRadius: 25, // Keep rounded corners
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: '#ffffff', // White text
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledInput: {
    backgroundColor: '#f7f7f7', // Light gray for disabled
    borderColor: '#f7f7f7',
    color: '#222121',
  },
  errorText: {
    color: '#ff004d', // Bright pink for errors
    fontSize: 12,
    marginTop: 4.6, // Increased by 15% (was 4, now 4.6)
  },
  button: {
    backgroundColor: '#f7fd04', // Bright yellow button
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 46, // Increased by 15% (was 40, now 46)
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
