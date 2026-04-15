import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity } from 'react-native';
import VectorIcon from '../components/VectorIcon';
import { theme } from '../utils/theme';

import HomeScreen from '../screens/home/HomeScreen';

const Tab = createBottomTabNavigator();

const NoRippleButton = (props: any) => {
  return <TouchableOpacity {...props} activeOpacity={1} />;
};

const TabNavigator = () => {
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
      <Tab.Screen name="Dashboard" component={HomeScreen} />
      <Tab.Screen name="Subjects" component={HomeScreen} />
      <Tab.Screen name="QuickLinks" component={HomeScreen} />
      <Tab.Screen name="Homework" component={HomeScreen} />
      <Tab.Screen name="Fees" component={HomeScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
