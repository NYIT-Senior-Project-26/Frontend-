import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Onboarding
import SplashScreen from '../screens/onboarding/SplashScreen';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import AuthScreen from '../screens/onboarding/AuthScreen';
import MFAScreen from '../screens/onboarding/MFAScreen';
import PrivacyConsentScreen from '../screens/onboarding/PrivacyConsentScreen';
import ProfileSetupScreen from '../screens/onboarding/ProfileSetupScreen';

// Main
import HomeScreen from '../screens/main/HomeScreen';
import SymptomInputScreen from '../screens/main/SymptomInputScreen';
import AdaptiveQAScreen from '../screens/main/AdaptiveQAScreen';
import HistoryScreen from '../screens/main/HistoryScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

// Results
import DiagnosisResultScreen from '../screens/results/DiagnosisResultScreen';
import TriageScreen from '../screens/results/TriageScreen';
import NearbyProvidersScreen from '../screens/results/NearbyProvidersScreen';
import PharmacyScreen from '../screens/results/PharmacyScreen';
import TelehealthScreen from '../screens/results/TelehealthScreen';

import { colors } from '../constants/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Check') iconName = focused ? 'medical' : 'medical-outline';
          else if (route.name === 'History') iconName = focused ? 'time' : 'time-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          paddingBottom: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Check" component={SymptomInputScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        {/* Onboarding Stack */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="MFA" component={MFAScreen} />
        <Stack.Screen name="PrivacyConsent" component={PrivacyConsentScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />

        {/* Main App */}
        <Stack.Screen name="MainApp" component={MainTabs} />

        {/* Result Screens */}
        <Stack.Screen
          name="AdaptiveQA"
          component={AdaptiveQAScreen}
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="DiagnosisResult"
          component={DiagnosisResultScreen}
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="Triage"
          component={TriageScreen}
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="NearbyProviders"
          component={NearbyProvidersScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="Pharmacy"
          component={PharmacyScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="Telehealth"
          component={TelehealthScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
