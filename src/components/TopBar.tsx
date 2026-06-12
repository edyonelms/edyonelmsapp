import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
} from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { theme } from '../utils/theme';
import VectorIcon from './VectorIcon';
import AccountSwitcherSheet from './AccountSwitcherSheet';
import { getActiveAccount } from '../utils/accountStore';

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
    const a = await getActiveAccount();
    setDisplayName(userName || a?.name || '');
    setAvatarUri(a?.image ?? null);
    setAvatarBroken(false);
  }, [userName]);

  useEffect(() => { refreshAccount(); }, [refreshAccount]);

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
            size={26}
            color="#111"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.userInfo}
          activeOpacity={0.7}
          onPress={() => setSwitcherOpen(true)}
        >
          <Text style={styles.userName} numberOfLines={1}>
            {displayName || 'Account'}
          </Text>
          <VectorIcon
            iconSet="Ionicons"
            iconName="caret-down"
            size={20}
            color="#111"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={onBellPress} style={styles.iconBtn}>
          <VectorIcon
            iconSet="Ionicons"
            iconName="notifications-outline"
            size={20}
            color="#111"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={onAvatarPress} style={styles.iconBtn}>
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
              color="#111"
            />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <VectorIcon
          iconSet="Feather"
          iconName="search"
          size={18}
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
    backgroundColor: '#fff',
    paddingBottom: theme.spacing.sm,
    borderBottomRightRadius: theme.radius.lg,
    borderBottomLeftRadius: theme.radius.lg,
  },
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  menuBtn: {
    paddingVertical: 6,
    paddingRight: 10,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  searchWrap: {
    marginTop: 10,
    marginHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    height: 44,
  },
  input: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 14,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.full,
    resizeMode: 'cover',
  },
});
