import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { theme } from '../../utils/theme';
import VectorIcon from '../../components/VectorIcon';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const navigation = useNavigation<any>();

  const items = [
    {
      title: 'Notification',
      icon: 'notifications-outline',
      route: 'NotificationSettings',
    },
    { title: 'Biometric', icon: 'finger-print-outline', route: 'BiometricSettings' },
    {
      title: 'Change Password',
      icon: 'lock-closed-outline',
      route: 'ChangePasswordSettings',
    },
  ];

  return (
    <View style={styles.safeArea}>
      <Header title="Settings" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.subtitle}>Manage your account preferences</Text>

        <View style={styles.card}>
          {items.map(item => (
            <TouchableOpacity
              key={item.title}
              style={styles.row}
              activeOpacity={0.8}
              onPress={() => navigation.navigate(item.route)}
            >
              <View style={styles.left}>
                <View style={styles.iconBadge}>
                  <VectorIcon
                    iconSet="Ionicons"
                    iconName={item.icon}
                    size={18}
                    color={theme.colors.primary}
                  />
                </View>
                <Text style={styles.rowText}>{item.title}</Text>
              </View>
              <VectorIcon
                iconSet="Ionicons"
                iconName="chevron-forward"
                size={18}
                color={theme.colors.textMuted}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing.lg,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    fontSize: 15,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
});
