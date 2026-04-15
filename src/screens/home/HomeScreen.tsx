import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';
import { theme } from '../../utils/theme';
import VectorIcon from '../../components/VectorIcon';

const HomeScreen = () => {
  const quickStats = [
    { label: 'Attendance', value: '94%', icon: 'calendar-clear-outline' },
    { label: 'Homework', value: '06', icon: 'book-outline' },
    { label: 'Fees Due', value: '$120', icon: 'card-outline' },
  ];

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.welcomeCard}>
          <Text style={styles.heading}>Good Morning</Text>
          <Text style={styles.subHeading}>Welcome back to Edyone LMS</Text>
        </View>

        <View style={styles.statsRow}>
          {quickStats.map(item => (
            <View key={item.label} style={styles.statCard}>
              <View style={styles.iconWrap}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName={item.icon}
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>Latest Announcement</Text>
          <Text style={styles.noticeText}>
            Parent-teacher meeting is scheduled for Friday at 10:00 AM.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing.lg,
  },
  welcomeCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  heading: {
    color: theme.colors.white,
    fontSize: 24,
    fontWeight: '700',
  },
  subHeading: {
    color: '#E0E7FF',
    marginTop: theme.spacing.xs,
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  noticeCard: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  noticeText: {
    color: theme.colors.textSecondary,
    lineHeight: 21,
  },
});
