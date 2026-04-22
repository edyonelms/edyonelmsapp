import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';

const ExamMainScreen = () => {
  const navigation = useNavigation<any>();

  const items = [
    {
      title: 'About App',
      icon: 'information-circle-outline',
      route: 'AboutAppMore',
    },
    {
      title: 'School Info',
      icon: 'school-outline',
      route: 'SchoolInfoMore',
    },
    {
      title: 'Rules & Regulations',
      icon: 'document-text-outline',
      route: 'RulesRegulationsMore',
    },
    {
      title: 'Terms & Conditions',
      icon: 'reader-outline',
      route: 'TermsConditionsMore',
    },
    {
      title: 'Privacy Policy',
      icon: 'shield-checkmark-outline',
      route: 'PrivacyPolicyMore',
    },
    {
      title: 'Terms of Use',
      icon: 'clipboard-outline',
      route: 'TermsOfUseMore',
    },
  ];

  return (
    <View style={styles.safeArea}>
      <Header title="More" onBackPress={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.card}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              style={[styles.row, index === items.length - 1 && styles.lastRow]}
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

export default ExamMainScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
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
    flexShrink: 1,
  },
});
