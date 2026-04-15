import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import SelectUserScreen from '../screens/auth/SelectUserScreen';
import LoginTeacherScreen from '../screens/auth/LoginTeacherScreen';
import LoginStudentScreen from '../screens/auth/LoginStudentScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Onboarding"
    >
      {/* Onboarding */}
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />

      {/* Auth Flow */}
      <Stack.Screen name="SelectUser" component={SelectUserScreen} />
      <Stack.Screen name="TeacherLogin" component={LoginTeacherScreen} />
      <Stack.Screen name="StudentLogin" component={LoginStudentScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

      {/* Main App Flow */}
      <Stack.Screen name="DrawerRoot" component={DrawerNavigator} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
