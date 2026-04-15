import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { theme } from '../../utils/theme';
import VectorIcon from '../../components/VectorIcon';

const SettingsScreen = () => {
  const items = [
    { title: 'Profile', icon: 'person-outline' },
    { title: 'Notifications', icon: 'notifications-outline' },
    { title: 'Language', icon: 'language-outline' },
    { title: 'Privacy Policy', icon: 'shield-checkmark-outline' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your account preferences</Text>

        <View style={styles.card}>
          {items.map(item => (
            <TouchableOpacity
              key={item.title}
              style={styles.row}
              activeOpacity={0.8}
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
    </SafeAreaView>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
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
