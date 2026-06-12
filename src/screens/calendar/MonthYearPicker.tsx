import React, { useState, useRef, useEffect } from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment';
import { theme } from '../../utils/theme';
import { MONTHS, YEAR_RANGE } from './calendarTypes';

const { width } = Dimensions.get('window');

interface Props {
  visible: boolean;
  current: moment.Moment;
  onClose: () => void;
  onSelect: (m: moment.Moment) => void;
}

const MonthYearPicker = ({ visible, current, onClose, onSelect }: Props) => {
  const [pickerYear, setPickerYear] = useState(current.year());
  const [pickerMonth, setPickerMonth] = useState(current.month());
  const yearRef = useRef<FlatList>(null);
  const initialIndex = Math.max(0, YEAR_RANGE.indexOf(current.year()) - 2);

  // Re-sync the selection with the calendar every time the sheet opens, and
  // bring the active year back into view.
  useEffect(() => {
    if (!visible) return;
    setPickerYear(current.year());
    setPickerMonth(current.month());
    const idx = Math.max(0, YEAR_RANGE.indexOf(current.year()) - 2);
    setTimeout(() => {
      yearRef.current?.scrollToIndex({ index: idx, animated: false });
    }, 50);
  }, [visible, current]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={s.sheet}>
          <View style={s.handle} />
          <Text style={s.title}>Select Month & Year</Text>

          {/* Year strip */}
          <View style={s.yearSection}>
            <FlatList
              ref={yearRef}
              data={YEAR_RANGE}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={y => String(y)}
              initialScrollIndex={initialIndex}
              getItemLayout={(_, i) => ({
                length: 72,
                offset: 72 * i,
                index: i,
              })}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              renderItem={({ item: y }) => {
                const active = y === pickerYear;
                return (
                  <TouchableOpacity
                    onPress={() => setPickerYear(y)}
                    style={[s.yearChip, active && s.yearChipActive]}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.yearText, active && s.yearTextActive]}>
                      {y}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          {/* Month grid 4×3 */}
          <View style={s.monthGrid}>
            {MONTHS.map((m, i) => {
              const active = i === pickerMonth;
              const isCurrent =
                i === current.month() && pickerYear === current.year();
              return (
                <TouchableOpacity
                  key={m}
                  onPress={() => setPickerMonth(i)}
                  activeOpacity={0.8}
                  style={[
                    s.monthCell,
                    active && s.monthCellActive,
                    isCurrent && !active && s.monthCellCurrent,
                  ]}
                >
                  <Text style={[s.monthText, active && s.monthTextActive]}>
                    {m}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Actions */}
          <View style={s.actions}>
            <TouchableOpacity onPress={onClose} style={s.cancelBtn}>
              <Text style={s.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onSelect(moment().year(pickerYear).month(pickerMonth).date(1));
                onClose();
              }}
              style={s.confirmBtn}
            >
              <Text style={s.confirmText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default MonthYearPicker;

const CELL_W = (width - 32 - 30) / 4;

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000070',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: 36,
    overflow: 'hidden',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 99,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },

  // Year
  yearSection: { marginBottom: 24 },
  yearChip: {
    width: 64,
    height: 40,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    backgroundColor: '#F1F5F9',
  },
  yearChipActive: { backgroundColor: theme.colors.primary },
  yearText: { fontSize: 14, fontWeight: '600', color: theme.colors.textSecondary },
  yearTextActive: { color: theme.colors.white, fontWeight: '800' },

  // Month grid
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 28,
  },
  monthCell: {
    width: CELL_W ,
    paddingVertical: 14,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  monthCellActive: { backgroundColor: theme.colors.primary },
  monthCellCurrent: {
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  monthText: { fontSize: 14, fontWeight: '700', color: theme.colors.textSecondary },
  monthTextActive: { color: theme.colors.white },
  monthDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
    marginTop: 4,
  },

  // Actions
  actions: { flexDirection: 'row', gap: 12, paddingHorizontal: 20 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.radius.lg,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  cancelText: { fontSize: 15, fontWeight: '700', color: theme.colors.textSecondary },
  confirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
  },
  confirmText: { fontSize: 15, fontWeight: '700', color: theme.colors.white },
});
