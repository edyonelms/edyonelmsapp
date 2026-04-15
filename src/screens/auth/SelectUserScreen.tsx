import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import React from 'react';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { useNavigation } from '@react-navigation/native';

const SelectUserScreen = () => {
  const navigation = useNavigation<any>();

  const handleUserSelect = (type: string) => {
    if (type === 'Teacher') {
      navigation.navigate('TeacherLogin');
    } else {
      navigation.navigate('StudentLogin');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoBadge}>
          <VectorIcon
            iconSet="Ionicons"
            iconName="school-outline"
            size={32}
            color={theme.colors.primary}
          />
        </View>

        <Text style={styles.title}>Welcome to Edyone LMS</Text>
        <Text style={styles.subtitle}>
          Choose how you want to continue into your account
        </Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleUserSelect('Student')}
            activeOpacity={0.85}
          >
            <View style={styles.iconWrapper}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="school-outline"
                size={22}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardText}>Student</Text>
              <Text style={styles.cardSubText}>Access timetable and homework</Text>
            </View>
            <VectorIcon
              iconSet="Ionicons"
              iconName="chevron-forward"
              size={20}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => handleUserSelect('Teacher')}
            activeOpacity={0.85}
          >
            <View style={[styles.iconWrapper, styles.successBg]}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="person-outline"
                size={22}
                color={theme.colors.success}
              />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardText}>Teacher</Text>
              <Text style={styles.cardSubText}>Manage classes and attendance</Text>
            </View>
            <VectorIcon
              iconSet="Ionicons"
              iconName="chevron-forward"
              size={20}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => handleUserSelect('Parent')}
            activeOpacity={0.85}
          >
            <View style={[styles.iconWrapper, styles.secondaryBg]}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="people-outline"
                size={22}
                color={theme.colors.secondary}
              />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardText}>Parent</Text>
              <Text style={styles.cardSubText}>Track progress and announcements</Text>
            </View>
            <VectorIcon
              iconSet="Ionicons"
              iconName="chevron-forward"
              size={20}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SelectUserScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  optionsContainer: {
    width: '100%',
    gap: theme.spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successBg: {
    backgroundColor: '#DCFCE7',
  },
  secondaryBg: {
    backgroundColor: '#E0F2FE',
  },
  cardBody: {
    flex: 1,
    marginHorizontal: theme.spacing.md,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  cardSubText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
});
