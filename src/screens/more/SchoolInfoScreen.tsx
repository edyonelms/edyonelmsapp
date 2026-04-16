import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Header from '../../components/Header';
import { theme } from '../../utils/theme';

const SchoolInfoScreen = ({ navigation }: any) => {
  return (
    <View style={styles.safeArea}>
      <Header title={'School Info'} onBackPress={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text style={styles.title}>{'School Info'}</Text>
        <Text style={styles.subtitle}>
          Manage your {'School Info'.toLowerCase()} preferences here.
        </Text>
      </View>
    </View>
  );
};

export default SchoolInfoScreen;

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
