// authStore.ts

import { create } from 'zustand';
import { AuthStore, User } from '../types/auth';
import { AuthRequestPromptOptions, AuthSessionResult, makeRedirectUri } from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Remove these lines as we're now importing from config/env.ts
// const API_URL = 'http://192.168.1.100:3000'; // Replace with your actual API URL
// Then remove or comment out the existing API_URL line:
// const API_URL = 'http://192.168.1.100:3000';

export const useAuthStore = create<AuthStore>((set) => ({
  // --- STATE ---
  user: null,
  authToken: null, // This holds the JWT from *your* backend
  isAuthenticated: false,
  isOnboardingComplete: false,
  isLoading: false,
  
  isRehydrating: true, // Used to show a loading screen on app start

  /**
   * Handles the entire Google Sign-In flow, from showing the prompt
   * to authenticating with our backend and storing the session token.
   */
  
  signInWithGoogle: async (promptAsync) => {
    set({ isLoading: true });
    try {
      // 1. Show the Google login prompt to the user
      const result = await promptAsync();
  
      // 2. Check if the login was successful and we received an authorization code
      if (result.type === 'success' && result.params.code) {
        const { code } = result.params;
        const API_URL = process.env.EXPO_PUBLIC_API_URL;
        
        // 3. Send the authorization code to our backend
        const backendResponse = await fetch(`${API_URL}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            code: code,
            redirectUri: makeRedirectUri({
              scheme: 'just-ask-v1',
              path: 'auth',
            })
          }),
        });
  
        if (!backendResponse.ok) {
          const errorData = await backendResponse.json();
          throw new Error(errorData.message || 'Authentication with backend failed.');
        }
  
        // 4. Get our own app token (JWT) and user data from the backend
        const { token, user } = await backendResponse.json();
  
        // 5. Store our app token securely on the device for session persistence
        await AsyncStorage.setItem('authToken', token);
  
        // 6. Update the app state to reflect the successful login
        set({
          user,
          authToken: token,
          isAuthenticated: true,
          isOnboardingComplete: user.onboardingComplete,
          isLoading: false,
        });
      } else {
        // The user cancelled the login prompt
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Full Sign-in process error:', error);
      // Ensure we are fully logged out on any failure
      await AsyncStorage.removeItem('authToken');
      set({ isLoading: false, authToken: null, user: null, isAuthenticated: false });
    }
  },

  /**
   * Logs the user out by clearing the token from storage and resetting the state.
   */
  signOut: async () => {
    set({ isLoading: true });
    await AsyncStorage.removeItem('authToken');
    set({
      user: null,
      authToken: null,
      isAuthenticated: false,
      isOnboardingComplete: false,
      isLoading: false,
    });
  },

  /**
   * Checks for a stored token on app startup to keep the user logged in.
   */
  rehydrateAuth: async () => {
    console.log('Starting rehydrateAuth...');
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('Token from storage:', token ? 'exists' : 'null');
      if (token) {
        set({ authToken: token, isAuthenticated: true });
      }
    } catch (e) {
      console.error("Failed to rehydrate auth token from storage", e);
    } finally {
      console.log('Setting isRehydrating to false');
      // After checking storage, we are no longer rehydrating
      set({ isRehydrating: false });
    }
  },

  /**
   * Updates the onboarding status in the state.
   */
  setOnboardingComplete: (complete: boolean) => {
    set({ isOnboardingComplete: complete });
  },
}));