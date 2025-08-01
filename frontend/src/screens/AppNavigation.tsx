import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useAuthStore } from '../stores/authStore';
import WelcomeScreen from './auth/WelcomeScreen';
import OnboardingScreen from './auth/OnboardingScreen';
// import DashboardScreen from './DashboardScreen'; // You'll create this next

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { 
    isAuthenticated, 
    isOnboardingComplete, 
    isRehydrating, 
    rehydrateAuth 
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
      ) : !isOnboardingComplete ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        // TODO: Add your main app screens here
        <Stack.Screen name="Dashboard" component={() => <View><Text>Dashboard Coming Soon!</Text></View>} />
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