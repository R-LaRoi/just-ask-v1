import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../stores/authStore';
import { RootStackParamList } from '../types/navigation';
import LoadingScreen from './LoadingScreen';
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

  const [showCustomLoading, setShowCustomLoading] = useState(true);

  // Check for stored auth token on app start
  useEffect(() => {
    rehydrateAuth();
  }, []);

  // Show custom loading screen first, then go directly to auth
  if (showCustomLoading) {
    return (
      <LoadingScreen
        onLoadingComplete={() => setShowCustomLoading(false)}
        duration={3000}
      />
    );
  }

  // Simplified flow - after loading, go directly to auth if not authenticated
  if (isRehydrating) {
    return (
      <LoadingScreen
        onLoadingComplete={() => { }}
        duration={500}
      />
    );
  }

  // Check if profile was just created (intermediate state)
  const isProfileCreated = user?.profileCreated || false;

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
          <Stack.Screen name="SurveyEditor" component={SurveyEditorScreen} />
          <Stack.Screen name="SurveyTaking" component={SurveyTakingScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}