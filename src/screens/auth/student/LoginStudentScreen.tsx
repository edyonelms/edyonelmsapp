import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useState } from 'react';
import { theme } from '../../../utils/theme';
import { useNavigation } from '@react-navigation/native';
import VectorIcon from '../../../components/VectorIcon';

const LoginStudentScreen = () => {
  const navigation = useNavigation<any>();
  const [admissionNo, setAdmissionNo] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.safeArea}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={theme.colors.background}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          style={{
            padding: theme.spacing.lg,
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.xs,
          }}
        >
          <VectorIcon
            iconName="arrow-left"
            iconSet="FontAwesome6"
            size={20}
            color={theme.colors.primary}
          />
          <Text style={{ color: theme.colors.primary, fontSize: 16 }}>
            Back
          </Text>
        </TouchableOpacity>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.iconBadge}>
            <Image source={{ uri: 'logo' }} style={styles.logo} />
          </View>

          <Text style={styles.title}>Student Login</Text>
          <Text style={styles.subtitle}>
            Please enter your admission number and password to continue to your
            dashboard
          </Text>

          <View style={styles.formCard}>
            <Text style={styles.label}>Admission Number</Text>
            <TextInput
              placeholder="Enter admission number"
              placeholderTextColor={theme.colors.textMuted}
              style={styles.input}
              value={admissionNo}
              onChangeText={setAdmissionNo}
              autoCapitalize="characters"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Enter password"
              placeholderTextColor={theme.colors.textMuted}
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              activeOpacity={0.8}
            >
              <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate('DrawerRoot', { userRole: 'student' })
              }
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginStudentScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    // justifyContent: 'center',
  },
  iconBadge: {
    width: 76,
    height: 76,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 50,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    paddingHorizontal:20,
    marginBottom: theme.spacing.lg,
  },
  formCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
  },
  label: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    color: theme.colors.textPrimary,
  },
  forgot: {
    color: theme.colors.primary,
    textAlign: 'right',
    marginBottom: theme.spacing.lg,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
});
