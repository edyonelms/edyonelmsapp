import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import { theme } from '../../utils/theme';
import { useNavigation } from '@react-navigation/native';
import VectorIcon from '../../components/VectorIcon';

const LoginTeacherScreen = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
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
        <Text style={{ color: theme.colors.primary, fontSize: 16 }}>Back</Text>
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconBadge}>
          <Image source={{ uri: 'logo' }} style={styles.logo} />
        </View>

        <Text style={styles.title}>Teacher Login</Text>
        <Text style={styles.subtitle}>
          Sign in to manage classes and students
        </Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            placeholder="teacher@school.com"
            placeholderTextColor={theme.colors.textMuted}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
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
              navigation.navigate('DrawerRoot', { userRole: 'teacher' })
            }
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginTeacherScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    justifyContent: 'center',
  },
  iconBadge: {
    width: 76,
    height: 76,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing.lg,
  },
  logo: {
    width: 100,
    height: 100,
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
