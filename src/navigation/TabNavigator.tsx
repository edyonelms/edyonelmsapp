import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity } from 'react-native';
import VectorIcon from '../components/VectorIcon';
import { theme } from '../utils/theme';

import StudentHomeScreen from '../screens/home/student/StudentHomeScreen';
import TeacherHomeScreen from '../screens/home/teacher/TeacherHomeScreen';

const Tab = createBottomTabNavigator();

const NoRippleButton = (props: any) => {
  return <TouchableOpacity {...props} activeOpacity={1} />;
};

type TabRole = 'student' | 'teacher';

const TabNavigator = ({ route }: any) => {
  const role: TabRole = route?.params?.userRole === 'teacher' ? 'teacher' : 'student';
  const lastTabName = role === 'teacher' ? 'Attendance' : 'Fees';
  const DashboardComponent = role === 'teacher' ? TeacherHomeScreen : StudentHomeScreen;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 70,
          paddingTop: 6,
        },

        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,

        tabBarButton: props => <NoRippleButton {...props} />,

        tabBarIcon: ({ color, focused }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Subjects':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'QuickLinks':
              iconName = focused ? 'flash' : 'flash-outline';
              break;
            case 'Homework':
              iconName = focused ? 'clipboard' : 'clipboard-outline';
              break;
            case 'Fees':
              iconName = focused ? 'card' : 'card-outline';
              break;
            case 'Attendance':
              iconName = focused ? 'clipboard' : 'clipboard-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return (
            <VectorIcon
              iconSet="Ionicons"
              iconName={iconName}
              size={22}
              color={color}
            />
          );
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardComponent} />
      <Tab.Screen name="Subjects" component={StudentHomeScreen} />
      <Tab.Screen name="QuickLinks" component={StudentHomeScreen} />
      <Tab.Screen name="Homework" component={StudentHomeScreen} />
      <Tab.Screen name={lastTabName} component={StudentHomeScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
