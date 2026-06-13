import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import {
  CLASSES,
  EXAM_OPTIONS,
  ExamOption,
  isComplete,
  OptionItem,
  Selection,
  SUBJECTS,
} from './uploadData';

type Step = 'exam' | 'cls' | 'subject';

const STEP_META: Record<
  Step,
  { label: string; icon: string; options: OptionItem[] }
> = {
  exam: { label: 'Exam', icon: 'documents-outline', options: EXAM_OPTIONS },
  cls: { label: 'Class', icon: 'people-outline', options: CLASSES },
  subject: { label: 'Subject', icon: 'book-outline', options: SUBJECTS },
};

const STEP_ORDER: Step[] = ['exam', 'cls', 'subject'];

interface Props {
  value: Selection;
  onChange: (next: Selection) => void;
}

// Single dropdown that walks Exam → Class → Subject one step at a time.
const SelectionWizard = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('exam');
  const [draft, setDraft] = useState<Selection>(value);

  const startFlow = () => {
    setDraft({ exam: null, cls: null, subject: null });
    setStep('exam');
    setOpen(true);
  };

  const pick = (option: OptionItem) => {
    if (step === 'exam') {
      setDraft(d => ({ ...d, exam: option as ExamOption }));
      setStep('cls');
    } else if (step === 'cls') {
      setDraft(d => ({ ...d, cls: option }));
      setStep('subject');
    } else {
      const final: Selection = { ...draft, subject: option };
      onChange(final);
      setOpen(false);
    }
  };

  const triggerLabel = isComplete(value)
    ? 'Change selection'
    : 'Select Exam → Class → Subject';

  const meta = STEP_META[step];
  const stepIndex = STEP_ORDER.indexOf(step);

  return (
    <View style={s.wrap}>
      <TouchableOpacity
        style={s.trigger}
        activeOpacity={0.85}
        onPress={() => (open ? setOpen(false) : startFlow())}
      >
        <View style={s.triggerIcon}>
          <VectorIcon
            iconSet="Ionicons"
            iconName="funnel-outline"
            size={16}
            color={theme.colors.primary}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.triggerLabel}>Selection</Text>
          <Text style={s.triggerValue} numberOfLines={1}>
            {triggerLabel}
          </Text>
        </View>
        <VectorIcon
          iconSet="Ionicons"
          iconName={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={theme.colors.textMuted}
        />
      </TouchableOpacity>

      {open && (
        <View style={s.panel}>
          {/* Breadcrumb */}
          <View style={s.crumbs}>
            {STEP_ORDER.map((st, i) => {
              const done = i < stepIndex;
              const active = st === step;
              const picked =
                st === 'exam'
                  ? draft.exam?.label
                  : st === 'cls'
                  ? draft.cls?.label
                  : draft.subject?.label;
              return (
                <React.Fragment key={st}>
                  {i > 0 && (
                    <VectorIcon
                      iconSet="Ionicons"
                      iconName="chevron-forward"
                      size={12}
                      color={theme.colors.textMuted}
                    />
                  )}
                  <View
                    style={[
                      s.crumb,
                      active && s.crumbActive,
                      done && s.crumbDone,
                    ]}
                  >
                    {done && (
                      <VectorIcon
                        iconSet="Ionicons"
                        iconName="checkmark"
                        size={11}
                        color={theme.colors.success}
                      />
                    )}
                    <Text
                      style={[
                        s.crumbText,
                        active && s.crumbTextActive,
                        done && s.crumbTextDone,
                      ]}
                      numberOfLines={1}
                    >
                      {done && picked ? picked : STEP_META[st].label}
                    </Text>
                  </View>
                </React.Fragment>
              );
            })}
          </View>

          {/* Step hint */}
          <View style={s.hintRow}>
            <VectorIcon
              iconSet="Ionicons"
              iconName={meta.icon}
              size={14}
              color={theme.colors.primary}
            />
            <Text style={s.hintText}>
              Step {stepIndex + 1} of 3 · Choose {meta.label}
            </Text>
          </View>

          {/* Options */}
          <View style={s.options}>
            {meta.options.map((o, i) => (
              <TouchableOpacity
                key={o.id}
                style={[
                  s.option,
                  i === meta.options.length - 1 && s.optionLast,
                ]}
                activeOpacity={0.7}
                onPress={() => pick(o)}
              >
                <Text style={s.optionText}>{o.label}</Text>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="chevron-forward"
                  size={16}
                  color={theme.colors.textMuted}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default SelectionWizard;

const s = StyleSheet.create({
  wrap: { zIndex: 99 },

  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    elevation: 2,
  },
  triggerIcon: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  triggerLabel: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '500' },
  triggerValue: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 1,
  },

  panel: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: 6,
    overflow: 'hidden',
    elevation: 4,
  },
  crumbs: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  crumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    maxWidth: 130,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  crumbActive: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  crumbDone: { backgroundColor: '#DCFCE7', borderColor: '#BBF7D0' },
  crumbText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    flexShrink: 1,
  },
  crumbTextActive: { color: theme.colors.primary },
  crumbTextDone: { color: theme.colors.success },

  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
  },
  hintText: { fontSize: 12, fontWeight: '600', color: theme.colors.textSecondary },

  options: { borderTopWidth: 1, borderTopColor: theme.colors.border },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  optionLast: { borderBottomWidth: 0 },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
});
