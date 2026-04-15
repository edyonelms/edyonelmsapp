import React from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { theme } from '../utils/theme';
import VectorIcon from './VectorIcon';

interface TopBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBellPress?: () => void;
  onAvatarPress?: () => void;
}

const TopBar = ({
  placeholder = 'Search here...',
  value,
  onChangeText,
  onBellPress,
  onAvatarPress,
}: TopBarProps) => {
  const navigation = useNavigation<any>();

  const openDrawer = () => {
    const parent = navigation.getParent?.();
    (parent ?? navigation).dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        onPress={openDrawer}
        activeOpacity={0.7}
        style={styles.menuBtn}
      >
        <VectorIcon iconSet="Ionicons" iconName="menu" size={26} color="#111" />
      </TouchableOpacity>

      <View style={styles.search}>
        <VectorIcon
          iconSet="Ionicons"
          iconName="search-outline"
          size={18}
          color={theme.colors.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          returnKeyType="search"
        />
      </View>

      <TouchableOpacity
        onPress={onBellPress}
        activeOpacity={0.7}
        style={styles.iconBtn}
      >
        <VectorIcon
          iconSet="Ionicons"
          iconName="notifications-outline"
          size={20}
          color="#111"
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onAvatarPress}
        activeOpacity={0.7}
        style={styles.iconBtn}
      >
        <VectorIcon
          iconSet="Ionicons"
          iconName="person-circle-outline"
          size={22}
          color="#111"
        />
      </TouchableOpacity>
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  menuBtn: {
    paddingVertical: 6,
    paddingRight: 2,
  },
  search: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    height: 44,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
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
