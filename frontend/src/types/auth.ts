import { AuthRequestPromptOptions, AuthSessionResult } from "expo-auth-session";

export interface User {
    id: string;
    email: string;
    name: string;
    picture?: string;
    platform?: string;
    bio?: string;
    onboardingComplete: boolean;
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
    signInWithGoogle: (options?: AuthRequestPromptOptions) => Promise<AuthSessionResult>;
    signOut: () => Promise<void>;
    setUser: (user: User | null) => void;
    rehydrateAuth: () => Promise<void>
    setOnboardingComplete: (complete: boolean) => void;
  
  }
  
  export type AuthStore = AuthState & AuthActions;