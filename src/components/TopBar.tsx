import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { theme } from '../utils/theme';
import VectorIcon from './VectorIcon';

interface TopBarProps {
  userName?: string;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onBellPress?: () => void;
  onAvatarPress?: () => void;
}

const TopBar = ({
  userName = 'Rahul Sharma',
  searchValue,
  onSearchChange,
  onBellPress,
  onAvatarPress,
}: TopBarProps) => {
  const navigation = useNavigation<any>();

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
            iconSet="Ionicons"
            iconName="menu"
            size={26}
            color="#111"
          />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            {userName}👋
          </Text>
        </View>

        <TouchableOpacity onPress={onBellPress} style={styles.iconBtn}>
          <VectorIcon
            iconSet="Ionicons"
            iconName="swap-horizontal-outline"
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
          <VectorIcon
            iconSet="Ionicons"
            iconName="person-circle-outline"
            size={22}
            color="#111"
          />
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
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    paddingBottom: theme.spacing.sm,
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
    paddingRight: 2,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
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
  },
});
