export interface User {
    id: string;
    email: string;
    name: string;
    picture?: string;
    platform?: string;
    bio?: string;
  }
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isOnboardingComplete: boolean;
    isLoading: boolean;
  }
  
  export interface AuthActions {
    signInWithGoogle: () => Promise<void>;
    signOut: () => void;
    setUser: (user: User | null) => void;
    setOnboardingComplete: (complete: boolean) => void;
  }
  
  export type AuthStore = AuthState & AuthActions;