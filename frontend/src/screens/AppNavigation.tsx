import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { RootStackParamList } from '../types/navigation';
import WelcomeScreen from './auth/WelcomeScreen';
import OnboardingScreen from './auth/OnboardingScreen';
import ProfileCreatedScreen from '../screens/auth/ProfileCreatedScreen';
import DashboardScreen from './DashboardScreen';
import SurveyTakingScreen from '../modules/survey/screens/SurveyTakingScreen';
import SurveyEditorScreen from '../modules/survey/screens/SurveyEditorScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const {
    isAuthenticated,
    isOnboardingComplete,
    isRehydrating,
    rehydrateAuth,
    user
  } = useAuthStore();

  // Check for stored auth token on app start
  useEffect(() => {
    rehydrateAuth();
  }, []);

  // Show loading screen while checking stored auth
  if (isRehydrating) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  // Check if profile was just created (intermediate state)
  const isProfileCreated = user?.profileCreated || false;

  // Add debugging logs
  console.log('Navigation Debug:', {
    isAuthenticated,
    isOnboardingComplete,
    isProfileCreated,
    user: user
  });

  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
      ) : !isOnboardingComplete && !isProfileCreated ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : isProfileCreated && !isOnboardingComplete ? (
        <Stack.Screen name="ProfileCreated" component={ProfileCreatedScreen} />
      ) : (
        // Main app screens
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          {/* Remove this line: */}
          {/* <Stack.Screen name="TemplateSelection" component={TemplateSelectionScreen} /> */}
          <Stack.Screen name="SurveyEditor" component={SurveyEditorScreen} />
          <Stack.Screen name="SurveyTaking" component={SurveyTakingScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});