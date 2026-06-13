import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { OptionItem } from './uploadData';

interface Props {
  icon: string;
  label: string;
  options: OptionItem[];
  selected: OptionItem;
  onSelect: (option: OptionItem) => void;
}

// Compact full-width labeled selector with an inline dropdown.
const SelectDropdown = ({ icon, label, options, selected, onSelect }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={s.wrap}>
      <TouchableOpacity
        style={s.btn}
        activeOpacity={0.8}
        onPress={() => setOpen(o => !o)}
      >
        <View style={s.iconWrap}>
          <VectorIcon
            iconSet="Ionicons"
            iconName={icon}
            size={16}
            color={theme.colors.primary}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.label}>{label}</Text>
          <Text style={s.value} numberOfLines={1}>
            {selected.label}
          </Text>
        </View>
        <VectorIcon
          iconSet="Ionicons"
          iconName={open ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={theme.colors.textMuted}
        />
      </TouchableOpacity>

      {open && (
        <View style={s.list}>
          {options.map((o, i) => {
            const active = o.id === selected.id;
            return (
              <TouchableOpacity
                key={o.id}
                style={[
                  s.item,
                  i === options.length - 1 && s.itemLast,
                  active && s.itemActive,
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  onSelect(o);
                  setOpen(false);
                }}
              >
                <Text style={[s.itemText, active && s.itemTextActive]}>
                  {o.label}
                </Text>
                {active && (
                  <VectorIcon
                    iconSet="Ionicons"
                    iconName="checkmark"
                    size={15}
                    color={theme.colors.primary}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default SelectDropdown;

const s = StyleSheet.create({
  wrap: { flex: 1 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 10, color: theme.colors.textMuted, fontWeight: '500' },
  value: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 1,
  },
  list: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: 4,
    overflow: 'hidden',
    elevation: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  itemLast: { borderBottomWidth: 0 },
  itemActive: { backgroundColor: theme.colors.primaryLight },
  itemText: { fontSize: 13, color: theme.colors.textSecondary },
  itemTextActive: { color: theme.colors.primary, fontWeight: '700' },
});
