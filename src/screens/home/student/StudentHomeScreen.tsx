import React from 'react';
import { StyleSheet, View } from 'react-native';
import TopBar from '../../../components/TopBar';
import { theme } from '../../../utils/theme';
import { useNavigation } from '@react-navigation/native';

const StudentHomeScreen = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.safeArea}>
      <TopBar
        onAvatarPress={() => navigation.navigate('StudentProfile')}
        onBellPress={() =>
          navigation.navigate('Notifications', { role: 'student' })
        }
      />
    </View>
  );
};

export default StudentHomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
