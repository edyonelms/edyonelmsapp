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
import LinearGradient from 'react-native-linear-gradient';
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

// Attractive indigo→violet gradient for the header + status-bar area.
const HEADER_GRADIENT = ['#4F46E5', '#6D5DF2', '#7C3AED'];
const HEADER_TOP = '#4F46E5';

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
    <LinearGradient
      colors={HEADER_GRADIENT}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: insets.top + 10 }]}
    >
      {/* Solid status-bar tint that matches the gradient's top colour. */}
      <StatusBar
        translucent={false}
        backgroundColor={HEADER_TOP}
        barStyle="light-content"
      />

      {/* Row 1: menu · greeting+name · bell · avatar */}
      <View style={styles.wrap}>
        <TouchableOpacity
          onPress={openDrawer}
          activeOpacity={0.7}
          style={styles.menuBtn}
        >
          <VectorIcon iconSet="Feather" iconName="menu" size={20} color="#fff" />
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
              color="rgba(255,255,255,0.9)"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={onBellPress} style={styles.iconBtn}>
          <VectorIcon
            iconSet="Ionicons"
            iconName="notifications-outline"
            size={19}
            color="#fff"
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
              color="#fff"
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Subtitle pill (class / role) */}
      {!!subtitle && (
        <View style={styles.subtitlePill}>
          <VectorIcon iconSet="Ionicons" iconName={subtitleIcon} size={12} color="#fff" />
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
    </LinearGradient>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 18,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
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
    backgroundColor: 'rgba(255,255,255,0.18)',
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
    color: 'rgba(255,255,255,0.8)',
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
    color: '#fff',
    flexShrink: 1,
  },
  subtitlePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    marginTop: 10,
    marginLeft: theme.spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
  },
  subtitleText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  searchWrap: {
    marginTop: 12,
    marginHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    backgroundColor: 'rgba(255,255,255,0.18)',
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
    backgroundColor: '#FACC15',
    borderWidth: 1.5,
    borderColor: HEADER_TOP,
  },
  avatarBtn: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.full,
    resizeMode: 'cover',
  },
});
