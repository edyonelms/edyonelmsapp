import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import { theme } from '../../utils/theme';
import { useNavigation } from '@react-navigation/native';

const SelectUserScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedUser === 'Teacher') {
      navigation.navigate('TeacherLogin');
    } else if (selectedUser === 'Student') {
      navigation.navigate('StudentLogin');
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoBadge}>
          <Image
            source={{ uri: 'logo' }}
            style={{ height: 130, aspectRatio: 1, resizeMode: 'contain' }}
          />
        </View>

        <Text style={styles.title}>Welcome to Edyone LMS</Text>
        <Text style={styles.subtitle}>
          Choose how you want to continue into your account
        </Text>

        <View style={styles.gridContainer}>
          {/* Student */}
          <TouchableOpacity
            style={[
              styles.gridCard,
              selectedUser === 'Student' && styles.selectedCard,
            ]}
            onPress={() => setSelectedUser('Student')}
            activeOpacity={0.9}
          >
            <Image source={{ uri: 'student' }} style={styles.cardImage} />
            <Text style={styles.gridTitle}>Student</Text>
          </TouchableOpacity>

          {/* Teacher */}
          <TouchableOpacity
            style={[
              styles.gridCard,
              selectedUser === 'Teacher' && styles.selectedCard,
            ]}
            onPress={() => setSelectedUser('Teacher')}
            activeOpacity={0.9}
          >
            <Image source={{ uri: 'teacher' }} style={styles.cardImage} />
            <Text style={styles.gridTitle}>Teacher</Text>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueBtn, !selectedUser && styles.disabledBtn]}
          onPress={handleContinue}
          disabled={!selectedUser}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default SelectUserScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  logoBadge: {
    alignItems: 'center',
    justifyContent: 'center',
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
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 30,
  },
  gridCard: {
    width: '40%',
    height: 150,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  selectedCard: {
    borderColor: '#5B7FFF',
  },
  cardImage: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5B7FFF',
  },
  continueBtn: {
    marginTop: 40,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    marginHorizontal: 34,
    borderRadius: 99,
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#B0B0B0',
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
