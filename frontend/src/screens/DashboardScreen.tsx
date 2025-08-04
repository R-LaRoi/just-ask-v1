import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../stores/authStore';
import { RootStackParamList } from '../types/navigation';

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen() {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const { user, signOut: logout } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleStartWithTemplate = () => {
    navigation.navigate('SurveyEditor');
  };

  const handleAudienceInsights = () => {
    Alert.alert(
      'Coming Soon!',
      'Audience insights will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const handleCustomQuiz = () => {
    Alert.alert(
      'Coming Soon!',
      'Custom quiz builder will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.welcomeSection}>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.userName}>{user?.name || 'User'} 👋</Text>
          </View>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Start with Template Section */}
          <TouchableOpacity 
            style={styles.templateSection} 
            onPress={handleStartWithTemplate}
            activeOpacity={0.7}
          >
            <Text style={styles.templateTitle}>Start with a Template</Text>
            <Text style={styles.templateSubtitle}>
              Choose from our popular templates to get started quickly
            </Text>
          </TouchableOpacity>

          {/* Audience Insights Section */}
          <TouchableOpacity 
            style={styles.insightsSection} 
            onPress={handleAudienceInsights}
            activeOpacity={0.7}
          >
            <Text style={styles.insightsTitle}>Audience Insights</Text>
            <Text style={styles.insightsSubtitle}>
              See your stats from quizzes in real time
            </Text>
          </TouchableOpacity>

          {/* Custom Quiz Section */}
          <TouchableOpacity 
            style={styles.customSection} 
            onPress={handleCustomQuiz}
            activeOpacity={0.7}
          >
            <Text style={styles.customTitle}>Custom Quiz</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7', // Light gray background
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },
  welcomeSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#222121', // Dark Gray/Black text
    fontWeight: '400',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222121', // Dark Gray/Black text
    marginTop: 4,
  },
  signOutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff', // White button
  },
  signOutText: {
    fontSize: 14,
    color: '#222121', // Dark text
    fontWeight: '500',
  },
  mainContent: {
    paddingHorizontal: 24,
    gap: 16,
  },
  templateSection: {
    backgroundColor: '#ff004d', // Bright Pink card
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  templateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff', // White text on pink background
    marginBottom: 8,
  },
  templateSubtitle: {
    fontSize: 16,
    color: '#ffffff', // White text on pink background
    lineHeight: 24,
  },
  insightsSection: {
    backgroundColor: '#222121', // Dark Gray/Black card
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  insightsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff', // White text on dark background
    marginBottom: 8,
  },
  insightsSubtitle: {
    fontSize: 16,
    color: '#ffffff', // White text on dark background
    lineHeight: 24,
  },
  customSection: {
    backgroundColor: '#f7fd04', // Bright Yellow card
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  customTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222121', // Dark text on yellow background
  },
});