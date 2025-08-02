import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useAuthStore } from '../../stores/authStore';

// Required for expo-auth-session to work properly
WebBrowser.maybeCompleteAuthSession();

// Google OAuth discovery document
const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://www.googleapis.com/oauth2/v4/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

const getClientId = () => {
  const clientId = Platform.OS === 'ios'
    ? process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS
    : process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

  console.log(`Using ${Platform.OS} client ID:`, clientId);
  return clientId;
};

export default function WelcomeScreen() {
  const { signInWithGoogle, isLoading } = useAuthStore();

  // Add this to see what redirect URI is being generated
  const redirectUri = makeRedirectUri({
    scheme: 'just-ask-v1',
    path: 'auth',
  });

  console.log('Generated redirect URI:', redirectUri);

  // Set up Google OAuth request with web-optimized redirect configuration
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: getClientId(),
      scopes: ['openid', 'profile', 'email'],
      responseType: 'code',
      redirectUri: redirectUri,
      usePKCE: false, // Changed from true to false
      // Additional web-specific configuration
      extraParams: Platform.OS === 'web' ? {
        prompt: 'select_account', // Always show account selection on web
      } : {},
    },
    discovery
  );

  const handleGmailLogin = async () => {
    if (!request) {
      console.log('OAuth request not ready');
      return;
    }

    try {
      // For web, this will use redirect instead of popup
      const promptOptions = Platform.OS === 'web' ? {
        showInRecents: false,
      } : {};

      await signInWithGoogle(() => promptAsync(promptOptions));
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Main heading */}
        <View style={styles.headerSection}>
          <Text style={styles.mainTitle}>Just Ask</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>audience</Text>
            <Text style={styles.description}>fans</Text>
            <Text style={styles.description}>subscribers</Text>
            <Text style={styles.description}>friends</Text>
            <Text style={styles.description}>classmates ...</Text>
          </View>
        </View>

        {/* Login section */}
        <View style={styles.loginSection}>
          <TouchableOpacity
            style={[styles.gmailButton, isLoading && styles.gmailButtonDisabled]}
            onPress={handleGmailLogin}
            disabled={isLoading || !request}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.gmailButtonText}>login gmail</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  headerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 30,
  },
  descriptionContainer: {
    alignItems: 'flex-start',
  },
  description: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 24,
  },
  loginSection: {
    paddingBottom: 50,
  },
  gmailButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gmailButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  gmailButtonDisabled: {
    opacity: 0.6,
  },
});