import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { theme } from '../../utils/theme';
import VectorIcon from '../../components/VectorIcon';
import Header from '../../components/Header';
import AppRefreshControl from '../../components/AppRefreshControl';
import { useRefresh } from '../../hooks/useRefresh';
import { useNavigation } from '@react-navigation/native';
import { Biometrics } from '../../utils/biometrics';

const SettingsScreen = () => {
  const navigation = useNavigation<any>();

  const [bioEnabled, setBioEnabled] = useState(false);
  const [bioAvailable, setBioAvailable] = useState(true);
  const [bioBusy, setBioBusy] = useState(false);

  // TODO: wire to an API loader if this screen gains server data.
  const { refreshing, onRefresh } = useRefresh(() => {});

  useEffect(() => {
    Promise.all([Biometrics.isEnabled(), Biometrics.check()]).then(
      ([on, sensor]) => {
        setBioEnabled(on);
        setBioAvailable(sensor.available);
      },
    );
  }, []);

  const onBioToggle = async (next: boolean) => {
    if (bioBusy) return;
    setBioBusy(true);
    try {
      if (next) {
        const { available } = await Biometrics.check();
        if (!available) {
          setBioAvailable(false);
          Alert.alert(
            'Biometric unavailable',
            'No fingerprint, face or screen lock is set up on this device. Add one in your phone settings first.',
          );
          return;
        }
        // Confirm with the sensor before turning it on, like WhatsApp
        const success = await Biometrics.authenticate(
          'Confirm to enable biometric unlock',
        );
        if (success) {
          await Biometrics.setEnabled(true);
          setBioEnabled(true);
        }
      } else {
        const success = await Biometrics.authenticate(
          'Confirm to disable biometric unlock',
        );
        if (success) {
          await Biometrics.setEnabled(false);
          setBioEnabled(false);
        }
      }
    } finally {
      setBioBusy(false);
    }
  };

  const items = [
    {
      title: 'Notification',
      icon: 'notifications-outline',
      route: 'NotificationSettings',
    },
    {
      title: 'Change Password',
      icon: 'lock-closed-outline',
      route: 'ChangePassword',
    },
  ];

  return (
    <View style={styles.safeArea}>
      <Header title="Settings" onBackPress={() => navigation.goBack()} />
      <ScrollView
        refreshControl={
          <AppRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.card}>
          {/* Biometric unlock — inline toggle */}
          <View style={styles.row}>
            <View style={styles.left}>
              <View style={styles.iconBadge}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="finger-print-outline"
                  size={18}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.textWrap}>
                <Text style={styles.rowText}>Biometric Unlock</Text>
                <Text style={styles.rowSub}>
                  {bioAvailable
                    ? 'Unlock the app with fingerprint, face or PIN'
                    : 'No fingerprint, face or screen lock set up'}
                </Text>
              </View>
            </View>
            <Switch
              value={bioEnabled}
              onValueChange={onBioToggle}
              disabled={bioBusy || (!bioAvailable && !bioEnabled)}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primaryLight,
              }}
              thumbColor={bioEnabled ? theme.colors.primary : '#f4f3f4'}
            />
          </View>

          {items.map(item => (
            <TouchableOpacity
              key={item.title}
              style={styles.row}
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

export default SettingsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
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
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
  textWrap: { flex: 1, paddingRight: 8 },
  rowText: {
    fontSize: 15,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  rowSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
});
