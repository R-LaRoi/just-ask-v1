import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../stores/authStore';
import { RootStackParamList } from '../types/navigation';
import Icon from 'react-native-vector-icons/Feather';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

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

  const handleCreateSurvey = () => {
    navigation.navigate('SurveyEditor');
  };

  const handleAudienceInsights = () => {
    Alert.alert(
      'Coming Soon!',
      'Audience insights will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const handleNavigation = (screen: string) => {
    // Handle navigation for bottom nav items
    console.log(`Navigate to ${screen}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>
              Survey says, {user?.name || 'creator name'} is awesome!
            </Text>
            <TouchableOpacity style={styles.profileIcon} onPress={handleSignOut}>
              <Icon name="user" size={20} color="#000000" />
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Create Survey Card */}
            <View style={styles.createSurveyCard}>
              <View style={styles.cardContent}>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Create a survey</Text>
                  <Text style={styles.cardSubtitle}>
                    Save time with a template{"\n"}or customize your own.
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.cardButton}
                onPress={handleCreateSurvey}
                activeOpacity={0.7}
              >
                <Text style={styles.cardButtonText}>GET STARTED</Text>
              </TouchableOpacity>
              <Image
                source={require('../../assets/q-mark.png')}
                style={styles.createSurveyImage}
              />
            </View>

            {/* Audience Insights Card */}
            <View style={styles.audienceInsightsCard}>
              <View style={styles.cardContent}>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Audience Insights</Text>
                  <Text style={styles.cardSubtitle}>
                    Understand your audience with detailed{"\n"}demographics and survey data.
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.cardButton}
                onPress={handleAudienceInsights}
                activeOpacity={0.7}
              >
                <Text style={styles.cardButtonText}>VIEW</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleNavigation('home')}
        >
          <Icon name="home" size={24} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleNavigation('create')}
        >
          <Icon name="plus" size={24} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleNavigation('insights')}
        >
          <Icon name="bar-chart-2" size={24} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleNavigation('bookmarks')}
        >
          <Icon name="bookmark" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: '#000000',
  },
  headerText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '400',
    flex: 1,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    padding: 30,
    gap: 20,
  },
  createSurveyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    height: screenHeight * 0.25, // Reduced height for mobile
    justifyContent: 'space-between',
    position: 'relative',
  },
  audienceInsightsCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    height: screenHeight * 0.25, // Reduced height for mobile
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  cardTextContainer: {
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
    fontFamily: 'System',
  },
  cardSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    lineHeight: 22,
    fontFamily: 'System',
  },
  cardButton: {
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 24,
    marginTop: 10,
    marginBottom: 24,
    backgroundColor: '#000000',
    alignSelf: 'flex-start',
  },
  cardButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f5f5f5',
    letterSpacing: 0.5,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  createSurveyImage: {
    width: 100,
    height: 100,
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
});