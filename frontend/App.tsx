import React from 'react';
import { StatusBar } from 'expo-status-bar';
import WelcomeScreen from './src/screens/auth/WelcomeScreen';

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <WelcomeScreen />
    </>
  );
}