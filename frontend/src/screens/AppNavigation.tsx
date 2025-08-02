import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useAuthStore } from '../stores/authStore';
import WelcomeScreen from './auth/WelcomeScreen';
import OnboardingScreen from './auth/OnboardingScreen';
import ProfileCreatedScreen from '../screens/auth/ProfileCreatedScreen';
// import DashboardScreen from './DashboardScreen'; // You'll create this next

const Stack = createNativeStackNavigator();

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
        <Stack.Screen name="Dashboard" component={() =>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Dashboard Coming Soon!</Text>
          </View>
        } />
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