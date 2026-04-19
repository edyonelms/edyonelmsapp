import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import SelectUserScreen from '../screens/auth/SelectUserScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import SplashScreen from '../screens/splash/SplashScreen';
import LoginTeacherScreen from '../screens/auth/teacher/LoginTeacherScreen';
import LoginStudentScreen from '../screens/auth/student/LoginStudentScreen';
import AboutAppScreen from '../screens/more/AboutAppScreen';
import SchoolInfoScreen from '../screens/more/SchoolInfoScreen';
import RulesRegulationsScreen from '../screens/more/RulesRegulationsScreen';
import TermsConditionsScreen from '../screens/more/TermsConditionsScreen';
import PrivacyPolicyScreen from '../screens/more/PrivacyPolicyScreen';
import TermsOfUseScreen from '../screens/more/TermsOfUseScreen';
import StudentProfileScreen from '../screens/profile/StudentProfileScreen';
import TeacherProfileScreen from '../screens/profile/TeacherProfileScreen';
import ViewAnnouncementScreen from '../screens/announcement/ViewAnnouncementScreen';
import ContactSchoolScreen from '../screens/contactSchool/ContactSchoolScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="SelectUser"
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      {/* Onboarding */}
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />

      {/* Auth Flow */}
      <Stack.Screen name="SelectUser" component={SelectUserScreen} />
      <Stack.Screen name="TeacherLogin" component={LoginTeacherScreen} />
      <Stack.Screen name="StudentLogin" component={LoginStudentScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

      {/* Profile */}
      <Stack.Screen name="StudentProfile" component={StudentProfileScreen} />
      <Stack.Screen name="TeacherProfile" component={TeacherProfileScreen} />

      {/* More */}
      <Stack.Screen name="AboutAppMore" component={AboutAppScreen} />
      <Stack.Screen name="SchoolInfoMore" component={SchoolInfoScreen} />
      <Stack.Screen
        name="RulesRegulationsMore"
        component={RulesRegulationsScreen}
      />
      <Stack.Screen
        name="TermsConditionsMore"
        component={TermsConditionsScreen}
      />
      <Stack.Screen name="PrivacyPolicyMore" component={PrivacyPolicyScreen} />
      <Stack.Screen name="TermsOfUseMore" component={TermsOfUseScreen} />

      {/* Announcement */}
      <Stack.Screen name="ViewAnnouncement" component={ViewAnnouncementScreen} />

      {/* Contact School */}
      <Stack.Screen name="NewQuery" component={ContactSchoolScreen} />

      {/* Main App Flow */}
      <Stack.Screen name="DrawerRoot" component={DrawerNavigator} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
