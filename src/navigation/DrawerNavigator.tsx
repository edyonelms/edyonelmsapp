import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import TabNavigator from './TabNavigator';
import SettingsScreen from '../screens/home/SettingsScreen';
import { theme } from '../utils/theme';
import VectorIcon from '../components/VectorIcon';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const CustomDrawer = (props: any) => {
    const { navigation, state } = props;

    const menuItems = [
      { name: 'Dashboard', label: 'Dashboard', icon: 'grid-outline' },
      { name: 'Analytics', label: 'Analytics', icon: 'bar-chart-outline' },
      {
        name: 'Announcement',
        label: 'Announcement',
        icon: 'megaphone-outline',
      },
      { name: 'Calendar', label: 'Calendar', icon: 'calendar-outline' },
      { name: 'Homework', label: 'Homework', icon: 'book-outline' },
      { name: 'Timetable', label: 'Timetable', icon: 'time-outline' },
      {
        name: 'MarkAttendance',
        label: 'Mark Attendance',
        icon: 'checkbox-outline',
      },
      { name: 'Attendance', label: 'Attendance', icon: 'clipboard-outline' },
      { name: 'Subjects', label: 'Subjects', icon: 'library-outline' },
      { name: 'Syllabus', label: 'Syllabus', icon: 'document-text-outline' },
      { name: 'Content', label: 'Content', icon: 'folder-outline' },
      { name: 'Quiz', label: 'Quiz', icon: 'help-circle-outline' },
      { name: 'Book', label: 'Book', icon: 'bookmarks-outline' },
      { name: 'IDCard', label: 'ID Card', icon: 'card-outline' },
      { name: 'Chats', label: 'Chats', icon: 'chatbubbles-outline' },
      { name: 'Exams', label: 'Exams', icon: 'create-outline' },
      {
        name: 'UploadMarks',
        label: 'Upload Marks',
        icon: 'cloud-upload-outline',
      },
      { name: 'ExamCopies', label: 'Exam Copies', icon: 'copy-outline' },
      { name: 'ContactSchool', label: 'Contact School', icon: 'call-outline' },
      { name: 'Settings', label: 'Setting', icon: 'settings-outline' },
      { name: 'More', label: 'More', icon: 'ellipsis-horizontal-outline' },
      { name: 'Logout', label: 'Logout', icon: 'log-out-outline' },
    ];

    return (
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <View style={styles.brandBadge}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="school-outline"
                size={30}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.appName}>Edyone LMS</Text>
            <Text style={styles.userName}>
              Current User
            </Text>
          </View>

          <View style={styles.menu}>
            {menuItems
              .map((item, index) => {
                const isActive = state.routeNames[state.index] === item.name;

                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate(item.name)}
                    style={[
                      styles.menuItem,
                      {
                        backgroundColor: isActive ? theme.colors.primaryLight : 'transparent',
                      },
                    ]}
                  >
                    <VectorIcon
                      iconSet="Ionicons"
                      iconName={item.icon}
                      size={20}
                      color={isActive ? theme.colors.primary : theme.colors.textPrimary}
                    />
                    <Text
                      style={[
                        styles.menuText,
                        {
                          color: isActive ? theme.colors.primary : theme.colors.textPrimary,
                          fontWeight: isActive ? '600' : '400',
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>

        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              console.log('Logout pressed');
            }}
          >
            <VectorIcon
              iconSet="Ionicons"
              iconName="log-out-outline"
              size={20}
              color={theme.colors.danger}
            />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
    );
  };

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: theme.colors.surface,
          width: '70%',
        },
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ title: 'Home' }}
      />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  brandBadge: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  appName: {
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: '700',
  },
  userName: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    marginTop: 2,
  },
  menu: {
    flex: 1,
    marginTop: theme.spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 12,
    marginBottom: 6,
    borderRadius: theme.radius.sm,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 15,
  },
  logoutContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    marginLeft: 15,
    fontSize: 14,
    color: theme.colors.danger,
    fontWeight: '600',
  },
});
