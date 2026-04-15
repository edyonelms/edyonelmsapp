import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { theme } from '../utils/theme';
import VectorIcon from './VectorIcon';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  showBack?: boolean;
}

const Header = ({ title, onBackPress, showBack = true }: HeaderProps) => {
  const navigation = useNavigation<any>();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <View style={styles.side}>
          {showBack ? (
            <TouchableOpacity
              onPress={onBackPress ? onBackPress : handleBackPress}
              activeOpacity={0.7}
              style={styles.backButton}
            >
              <VectorIcon
                iconSet="Ionicons"
                iconName="chevron-back"
                size={22}
                color={theme.colors.textPrimary}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.side} />
      </View>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    backgroundColor: '#fff',
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  side: {
    width: 36,
    alignItems: 'flex-start',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginHorizontal: theme.spacing.sm,
  },
});
