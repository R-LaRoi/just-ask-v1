import { AuthRequestPromptOptions, AuthSessionResult } from "expo-auth-session";

export interface User {
    id: string;
    email: string;
    name: string;
    picture?: string;
    platform?: string;
  
    onboardingComplete: boolean;
    profileCreated?: boolean;
}
  
export interface AuthState {
  user: User | null;
  authToken: string | null; 
  isAuthenticated: boolean;
  isOnboardingComplete: boolean;
  isLoading: boolean;
  isRehydrating: boolean;    
}
  
export interface AuthActions {
  signInWithGoogle: (promptAsync: (options?: AuthRequestPromptOptions) => Promise<AuthSessionResult>) => Promise<void>;
  signOut: () => Promise<void>;
  rehydrateAuth: () => Promise<void>;
  setOnboardingComplete: (complete: boolean) => void;
  setProfileCreated: (created: boolean) => void;
}
  
export type AuthStore = AuthState & AuthActions;