import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
} from 'react-native';
import {
  DrawerActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../utils/theme';
import VectorIcon from './VectorIcon';
import AccountSwitcherSheet from './AccountSwitcherSheet';
import { getActiveAccount, upsertAccount } from '../utils/accountStore';
import { fetchCurrentSnapshot } from '../api/switchAccountApi';

interface TopBarProps {
  userName?: string;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onBellPress?: () => void;
  onAvatarPress?: () => void;
}

const TopBar = ({
  userName,
  searchValue,
  onSearchChange,
  onBellPress,
  onAvatarPress,
}: TopBarProps) => {
  const navigation = useNavigation<any>();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [displayName, setDisplayName]   = useState<string>(userName ?? '');
  const [avatarUri, setAvatarUri]       = useState<string | null>(null);
  const [avatarBroken, setAvatarBroken] = useState(false);

  const refreshAccount = useCallback(async () => {
    // Paint instantly from local data: the switcher's active account, or the
    // login session blob when the switcher was never used.
    const acct = await getActiveAccount();
    let name = acct?.name ?? '';
    let image = acct?.image ?? null;
    if (!name) {
      try {
        const raw = await AsyncStorage.getItem('user_data');
        const u = raw ? JSON.parse(raw) : null;
        name = u?.name ?? '';
        image = image ?? u?.image ?? null;
      } catch {}
    }
    setDisplayName(name || userName || '');
    setAvatarUri(image);
    setAvatarBroken(false);

    // Then refresh from the server so profile edits show up immediately.
    try {
      const snap = await fetchCurrentSnapshot();
      if (!snap?.name) return;
      setDisplayName(snap.name);
      setAvatarUri(snap.image ?? null);
      const raw = await AsyncStorage.getItem('user_data');
      if (raw) {
        const u = JSON.parse(raw);
        await AsyncStorage.setItem(
          'user_data',
          JSON.stringify({ ...u, name: snap.name, image: snap.image ?? null }),
        );
      }
      if (acct && acct.user_id === snap.user_id) {
        await upsertAccount({
          ...acct,
          name: snap.name,
          image: snap.image ?? null,
        });
      }
    } catch {}
  }, [userName]);

  // Re-fetch every time the screen regains focus (profile edit, account
  // switch, tab change) so the name is never stale.
  useFocusEffect(
    useCallback(() => {
      refreshAccount();
    }, [refreshAccount]),
  );

  // After the switcher closes the active account might have changed.
  const onSwitcherClose = () => {
    setSwitcherOpen(false);
    refreshAccount();
  };

  const openDrawer = () => {
    const parent = navigation.getParent?.();
    (parent ?? navigation).dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrap}>
        <TouchableOpacity
          onPress={openDrawer}
          activeOpacity={0.7}
          style={styles.menuBtn}
        >
          <VectorIcon
            iconSet="Feather"
            iconName="menu"
            size={20}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.userInfo}
          activeOpacity={0.7}
          onPress={() => setSwitcherOpen(true)}
        >
          <Text style={styles.greeting}>Welcome back</Text>
          <View style={styles.nameRow}>
            <Text style={styles.userName} numberOfLines={1}>
              {displayName || 'Account'}
            </Text>
            <VectorIcon
              iconSet="Feather"
              iconName="chevron-down"
              size={16}
              color={theme.colors.textSecondary}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={onBellPress} style={styles.iconBtn}>
          <VectorIcon
            iconSet="Ionicons"
            iconName="notifications-outline"
            size={19}
            color={theme.colors.textPrimary}
          />
          <View style={styles.bellDot} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onAvatarPress} style={[styles.iconBtn, styles.avatarBtn]}>
          {avatarUri && !avatarBroken ? (
            <Image
              source={{ uri: avatarUri }}
              onError={() => setAvatarBroken(true)}
              style={styles.avatarImg}
            />
          ) : (
            <VectorIcon
              iconSet="Ionicons"
              iconName="person-circle-outline"
              size={22}
              color={theme.colors.primary}
            />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <VectorIcon
          iconSet="Feather"
          iconName="search"
          size={17}
          color={theme.colors.textMuted}
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder="Search here..."
          placeholderTextColor={theme.colors.textMuted}
          value={searchValue}
          onChangeText={onSearchChange}
          style={styles.input}
        />
      </View>

      <AccountSwitcherSheet visible={switcherOpen} onClose={onSwitcherClose} />
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAF9F6',
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#EEECE6',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    flexShrink: 1,
  },
  searchWrap: {
    marginTop: 12,
    marginHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: theme.radius.full,
    paddingHorizontal: 16,
    height: 42,
  },
  input: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 14,
    paddingVertical: 0,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 9,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.colors.danger,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  avatarBtn: {
    backgroundColor: theme.colors.primaryLight,
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.full,
    resizeMode: 'cover',
  },
});
