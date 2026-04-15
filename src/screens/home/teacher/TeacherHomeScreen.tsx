import React from 'react';
import { StyleSheet, View } from 'react-native';
import TopBar from '../../../components/TopBar';
import { theme } from '../../../utils/theme';

const TeacherHomeScreen = () => {
  return (
    <View style={styles.safeArea}>
      <TopBar />
    </View>
  );
};

export default TeacherHomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

