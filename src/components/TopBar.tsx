import React, { useCallback, useState } from 'react';
import {
  StatusBar,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../utils/theme';
import VectorIcon from './VectorIcon';
import AccountSwitcherSheet from './AccountSwitcherSheet';
import { getActiveAccount, upsertAccount } from '../utils/accountStore';
import { fetchCurrentSnapshot } from '../api/switchAccountApi';

interface TopBarProps {
  userName?: string;
  subtitle?: string;
  subtitleIcon?: string;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onBellPress?: () => void;
  onAvatarPress?: () => void;
}

// White header + status-bar area with dark content.
const HEADER_BG = '#FFFFFF';
const HEADER_TOP = '#FFFFFF';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const TopBar = ({
  userName,
  subtitle,
  subtitleIcon = 'sparkles',
  searchValue,
  onSearchChange,
  onBellPress,
  onAvatarPress,
}: TopBarProps) => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
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
      {/* White status-bar tint with dark icons. */}
      <StatusBar
        translucent={false}
        backgroundColor={HEADER_TOP}
        barStyle="dark-content"
      />
      {/* Paint the safe-area inset (notch / status-bar strip) white. */}
      <View
        style={[styles.statusBackdrop, { top: -insets.top, height: insets.top }]}
      />

      {/* Row 1: menu · greeting+name · bell · avatar */}
      <View style={styles.wrap}>
        <TouchableOpacity
          onPress={openDrawer}
          activeOpacity={0.7}
          style={styles.menuBtn}
        >
          <VectorIcon iconSet="Feather" iconName="menu" size={20} color={theme.colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.userInfo}
          activeOpacity={0.7}
          onPress={() => setSwitcherOpen(true)}
        >
          <Text style={styles.greeting}>{getGreeting()} 👋</Text>
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
            color={theme.colors.primary}
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
              iconName="person-circle"
              size={26}
              color={theme.colors.primary}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Subtitle pill (class / role) */}
      {!!subtitle && (
        <View style={styles.subtitlePill}>
          <VectorIcon iconSet="Ionicons" iconName={subtitleIcon} size={12} color={theme.colors.primary} />
          <Text style={styles.subtitleText} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      )}

      {/* Search */}
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
  statusBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: HEADER_TOP,
  },
  container: {
    backgroundColor: HEADER_BG,
    paddingTop: theme.spacing.md,
    paddingBottom: 18,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: theme.spacing.lg,
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 0.3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    flexShrink: 1,
  },
  subtitlePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    marginTop: 10,
    marginLeft: theme.spacing.lg,
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
  },
  subtitleText: { fontSize: 12, fontWeight: '700', color: theme.colors.primary },
  searchWrap: {
    marginTop: 12,
    marginHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.full,
    paddingHorizontal: 16,
    height: 44,
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
    backgroundColor: theme.colors.primaryLight,
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
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: HEADER_BG,
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
