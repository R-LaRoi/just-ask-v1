import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
// import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  duration?: number;
}

export default function LoadingScreen({
  onLoadingComplete,
  duration = 4000
}: LoadingScreenProps) {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    // Show logo for 2 seconds, then switch to video
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 3000);

    // Complete loading after total duration
    const completeTimer = setTimeout(() => {
      if (onLoadingComplete) {
        onLoadingComplete();
      }
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onLoadingComplete, duration]);

  if (!showVideo) {
    // Logo stage - simple and reliable
    return (
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/ask-script.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    );
  }

  // Video stage - using Cloudinary URL
  // return (
  //   <View style={styles.videoContainer}>
  //     <Video
  //       source={{ uri: 'https://res.cloudinary.com/do5wpgk5o/video/upload/v1754402005/ask-vid-white_yxwqid.mp4' }}
  //       style={styles.video}
  //       muted
  //       repeat
  //       paused={false}
  //       resizeMode="cover"
  //       onLoad={() => console.log('Video loaded from URL')}
  //       onError={(error) => console.log('Video error:', error)}
  //       onProgress={(data) => console.log('Video progress:', data.currentTime)}
  //     />
  //   </View>
  // );
}

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 500,
    height: 240,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    margin: 0,
    padding: 0,
  },
  video: {
    width: width,
    height: height,
    margin: 0,
    padding: 0,
  },
});