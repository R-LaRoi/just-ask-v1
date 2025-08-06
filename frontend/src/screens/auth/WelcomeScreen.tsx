import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useAuthStore } from '../../stores/authStore';
import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');

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
    <View style={styles.container}>
      {/* Video Background */}
      <Video
        source={{ uri: 'https://res.cloudinary.com/do5wpgk5o/video/upload/v1754402005/ask-vid-white_yxwqid.mp4' }}
        style={styles.backgroundVideo}
        muted
        repeat
        paused={false}
        resizeMode="cover"
        onLoad={() => console.log('Video loaded from URL')}
        onError={(error) => console.log('Video error:', error)}
      />

      {/* Content box matching the uploaded design */}
      <View style={styles.contentBox}>
        <Image
          source={require('../../../assets/ask-script.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>Creators -</Text>

        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleGmailLogin}
          disabled={isLoading || !request}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <>
              <Image
                source={require('../../../assets/g_icon.png')}
                style={styles.googleIcon}
                resizeMode="contain"
              />
              <Text style={styles.loginButtonText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundVideo: {
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    left: 0,
  },
  contentBox: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#000000',
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 280,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 32,
    color: '#000000',
    marginBottom: 40,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#2c2c2c',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  loginButtonText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '500',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
});