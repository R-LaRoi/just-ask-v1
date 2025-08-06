import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import { useAuthStore } from '../../stores/authStore';

const { width, height } = Dimensions.get('window');

export default function ProfileCreatedScreen() {
  const { setOnboardingComplete } = useAuthStore();

  const handleContinueToDashboard = () => {
    setOnboardingComplete(true);
  };

  return (
    <View style={styles.container}>
      {/* Video Background */}
      <Video
        source={{ uri: 'https://res.cloudinary.com/do5wpgk5o/video/upload/v1754402003/ask-vid-blk_lly43z.mp4' }}
        style={styles.backgroundVideo}
        resizeMode="cover"
        repeat={true}
        muted={true}
        playInBackground={false}
        playWhenInactive={false}
      />

      {/* Content Overlay */}
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Profile Created!</Text>
          <Text style={styles.subtitle}>
            Welcome to Just Ask! Your profile has been successfully created.
          </Text>
          <Text style={styles.description}>
            You're all set to start connecting with your audience and getting the answers you need.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={handleContinueToDashboard}
          >
            <Text style={styles.buttonText}>Continue to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent overlay for better text readability
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  button: {
    backgroundColor: '#f7fd04',
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
    minWidth: 200,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#222121',
    fontSize: 18,
    fontWeight: 'bold',
  },
});