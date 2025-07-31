import { create } from 'zustand';
import { AuthStore } from '../types/auth';

export const useAuthStore = create<AuthStore>((set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  isOnboardingComplete: false,
  isLoading: false,

  // Actions
  signInWithGoogle: async () => {
    set({ isLoading: true });
    try {
      // TODO: Implement Google OAuth
      console.log('Google sign-in clicked');
      set({ isLoading: false });
    } catch (error) {
      console.error('Sign-in error:', error);
      set({ isLoading: false });
    }
  },

  signOut: () => {
    set({
      user: null,
      isAuthenticated: false,
      isOnboardingComplete: false,
    });
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },

  setOnboardingComplete: (complete) => {
    set({ isOnboardingComplete: complete });
  },
}));