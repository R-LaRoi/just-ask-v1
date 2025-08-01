import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

export default function WelcomeScreen() {
  const handleGmailLogin = () => {
    console.log('Gmail login pressed!');
    // TODO: Implement Google OAuth login
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
          <TouchableOpacity style={styles.gmailButton} onPress={handleGmailLogin}>
            <Text style={styles.gmailButtonText}>login gmail</Text>
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
});