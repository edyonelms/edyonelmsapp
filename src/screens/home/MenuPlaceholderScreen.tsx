import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Header from '../../components/Header';
import { theme } from '../../utils/theme';

const MenuPlaceholderScreen = ({ route, navigation }: any) => {
  const title = route?.params?.title || 'Screen';

  return (
    <View style={styles.safeArea}>
      <Header title={title} onBackPress={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>This screen is ready. Add UI/content here.</Text>
      </View>
    </View>
  );
};

export default MenuPlaceholderScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontSize: 24,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: theme.spacing.sm,
    color: theme.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});
