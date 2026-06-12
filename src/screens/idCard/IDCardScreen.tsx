import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';

type DrawerRole = 'student' | 'teacher';

const { width } = Dimensions.get('window');
const CARD_W = Math.min(width - 44, 360);
const CARD_H = CARD_W * 1.52;

const SCHOOL = {
  name: 'EDYONE PUBLIC SCHOOL',
  tagline: 'Learn · Grow · Succeed',
  address: '42, MG Road, Aligarh, Uttar Pradesh – 202001',
  phone: '+91 98765 00000',
  email: 'info@edyoneschool.com',
  session: '2026 – 27',
};

const STUDENT_CARD = {
  name: 'Arjun Patel',
  photo: 'https://randomuser.me/api/portraits/men/11.jpg',
  idNo: 'STU-2026-0231',
  grid: [
    { label: 'Class', value: '10th — A' },
    { label: 'Roll No', value: '23' },
    { label: 'Date of Birth', value: '14 Aug 2011' },
    { label: 'Blood Group', value: 'B+' },
    { label: 'House', value: 'Sapphire' },
    { label: 'Session', value: SCHOOL.session },
  ],
  back: [
    { label: "Father's Name", value: 'Rakesh Patel' },
    { label: 'Address', value: '12, Civil Lines, Aligarh, UP' },
    { label: 'Phone', value: '+91 98765 43210' },
    { label: 'Emergency', value: '+91 91234 56789' },
    { label: 'Valid Upto', value: '31 Mar 2027' },
  ],
};

const TEACHER_CARD = {
  name: 'Ravi Sharma',
  photo: 'https://randomuser.me/api/portraits/men/32.jpg',
  idNo: 'EMP-2019-0142',
  grid: [
    { label: 'Designation', value: 'Sr. Teacher' },
    { label: 'Subject', value: 'Physics' },
    { label: 'Joining Date', value: '01 Apr 2019' },
    { label: 'Blood Group', value: 'O+' },
    { label: 'Department', value: 'Science' },
    { label: 'Session', value: SCHOOL.session },
  ],
  back: [
    { label: 'Qualification', value: 'M.Sc. Physics, B.Ed.' },
    { label: 'Address', value: '7, Ramghat Road, Aligarh, UP' },
    { label: 'Phone', value: '+91 99887 76655' },
    { label: 'Emergency', value: '+91 90909 80808' },
    { label: 'Valid Upto', value: '31 Mar 2027' },
  ],
};

// Fake barcode — fixed stripe pattern
const BARCODE = [
  2, 1, 3, 1, 2, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 2,
  3, 1, 1, 2,
];

const GRADIENT = [theme.colors.primary, '#7C3AED'];

const Watermark = () => (
  <View style={s.watermark} pointerEvents="none">
    <VectorIcon
      iconSet="Ionicons"
      iconName="school"
      size={CARD_W * 0.55}
      color={theme.colors.primary}
    />
  </View>
);

const BackInfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={s.backRow}>
    <Text style={s.backRowLabel}>{label}</Text>
    <Text style={s.backRowValue} numberOfLines={2}>
      {value}
    </Text>
  </View>
);

const IDCardScreen = ({ navigation, route }: any) => {
  const role: DrawerRole =
    route?.params?.userRole === 'teacher' ? 'teacher' : 'student';
  const card = role === 'teacher' ? TEACHER_CARD : STUDENT_CARD;

  const [flipped, setFlipped] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const flipTo = (toBack: boolean) => {
    if (toBack === flipped) return;
    setFlipped(toBack);
    Animated.spring(anim, {
      toValue: toBack ? 180 : 0,
      friction: 8,
      tension: 14,
      useNativeDriver: true,
    }).start();
  };

  const frontRotate = anim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backRotate = anim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });
  // Slight shrink mid-flip for a 3D depth feel
  const scale = anim.interpolate({
    inputRange: [0, 90, 180],
    outputRange: [1, 0.93, 1],
  });

  return (
    <View style={s.root}>
      <Header title="ID Card" onBackPress={() => navigation.goBack()} />

      <View style={s.content}>
        {/* ── Front / Back toggle ── */}
        <View style={s.toggleRow}>
          {(['Front', 'Back'] as const).map(side => {
            const active = side === 'Back' ? flipped : !flipped;
            return (
              <TouchableOpacity
                key={side}
                style={[s.toggleBtn, active && s.toggleBtnActive]}
                onPress={() => flipTo(side === 'Back')}
                activeOpacity={0.85}
              >
                <Text style={[s.toggleText, active && s.toggleTextActive]}>
                  {side}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Flippable card ── */}
        <TouchableWithoutFeedback onPress={() => flipTo(!flipped)}>
          <Animated.View style={[s.cardStage, { transform: [{ scale }] }]}>
            {/* ───────── Front face ───────── */}
            <Animated.View
              style={[
                s.cardFace,
                { transform: [{ perspective: 1200 }, { rotateY: frontRotate }] },
              ]}
            >
              <Watermark />

              {/* School band */}
              <LinearGradient
                colors={GRADIENT}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.band}
              >
                <View style={s.bandDecoLg} />
                <View style={s.bandDecoSm} />
                <View style={s.bandRow}>
                  <View style={s.schoolLogo}>
                    <VectorIcon
                      iconSet="Ionicons"
                      iconName="school"
                      size={22}
                      color={theme.colors.primary}
                    />
                  </View>
                  <View style={s.bandTextWrap}>
                    <Text style={s.schoolName} numberOfLines={2}>
                      {SCHOOL.name}
                    </Text>
                    <Text style={s.schoolTagline}>{SCHOOL.tagline}</Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Photo overlapping the band */}
              <View style={s.photoRing}>
                <Image source={{ uri: card.photo }} style={s.photo} />
              </View>

              <Text style={s.personName}>{card.name}</Text>
              <View style={s.roleBadge}>
                <View style={s.roleDot} />
                <Text style={s.roleBadgeText}>
                  {role === 'teacher' ? 'TEACHER' : 'STUDENT'}
                </Text>
              </View>

              {/* Details grid */}
              <View style={s.grid}>
                {card.grid.map(item => (
                  <View key={item.label} style={s.gridItem}>
                    <Text style={s.gridLabel}>{item.label.toUpperCase()}</Text>
                    <Text style={s.gridValue} numberOfLines={1}>
                      {item.value}
                    </Text>
                  </View>
                ))}
              </View>

              {/* ID footer */}
              <LinearGradient
                colors={GRADIENT}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={s.idStrip}
              >
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="card-outline"
                  size={14}
                  color="#fff"
                />
                <Text style={s.idStripText}>{card.idNo}</Text>
              </LinearGradient>
            </Animated.View>

            {/* ───────── Back face ───────── */}
            <Animated.View
              style={[
                s.cardFace,
                { transform: [{ perspective: 1200 }, { rotateY: backRotate }] },
              ]}
            >
              <Watermark />

              <LinearGradient
                colors={GRADIENT}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.backBand}
              >
                <Text style={s.backBandTitle}>IDENTITY CARD</Text>
                <View style={s.sessionChip}>
                  <Text style={s.sessionChipText}>Session {SCHOOL.session}</Text>
                </View>
              </LinearGradient>

              <View style={s.backInfoCard}>
                {card.back.map((r, i) => (
                  <View key={r.label}>
                    {i > 0 && <View style={s.backDivider} />}
                    <BackInfoRow label={r.label} value={r.value} />
                  </View>
                ))}
              </View>

              {/* Barcode */}
              <View style={s.barcodeBox}>
                <View style={s.barcode}>
                  {BARCODE.map((w, i) => (
                    <View key={i} style={[s.bar, { width: w * 1.5 }]} />
                  ))}
                </View>
                <Text style={s.barcodeText}>{card.idNo}</Text>
              </View>

              {/* Signature */}
              <View style={s.signRow}>
                <View style={s.signBox}>
                  <View style={s.signLine} />
                  <Text style={s.signLabel}>Holder's Sign</Text>
                </View>
                <View style={s.signBox}>
                  <View style={s.signLine} />
                  <Text style={s.signLabel}>Principal</Text>
                </View>
              </View>

              {/* Found note */}
              <View style={s.foundStrip}>
                <Text style={s.foundNote} numberOfLines={3}>
                  If found, please return to {SCHOOL.name}, {SCHOOL.address} ·{' '}
                  {SCHOOL.phone}
                </Text>
              </View>
            </Animated.View>
          </Animated.View>
        </TouchableWithoutFeedback>

        <View style={s.hintRow}>
          <VectorIcon
            iconSet="Ionicons"
            iconName="sync-outline"
            size={13}
            color={theme.colors.textMuted}
          />
          <Text style={s.hintText}>Tap the card to flip</Text>
        </View>
      </View>
    </View>
  );
};

export default IDCardScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  content: { flex: 1, alignItems: 'center', paddingTop: 14 },

  // Toggle
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 4,
    marginBottom: 18,
  },
  toggleBtn: {
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
  },
  toggleBtnActive: { backgroundColor: theme.colors.primary },
  toggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  toggleTextActive: { color: '#fff' },

  // Card stage
  cardStage: { width: CARD_W, height: CARD_H },
  cardFace: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: CARD_W,
    height: CARD_H,
    backfaceVisibility: 'hidden',
    backgroundColor: theme.colors.card,
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    alignItems: 'center',
  },

  // Watermark
  watermark: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.05,
  },

  // Front — gradient band
  band: {
    width: '100%',
    paddingTop: 16,
    paddingBottom: 50,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    overflow: 'hidden',
  },
  bandDecoLg: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.10)',
    top: -55,
    right: -35,
  },
  bandDecoSm: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -18,
    left: -20,
  },
  bandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  schoolLogo: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bandTextWrap: { flex: 1 },
  schoolName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.4,
  },
  schoolTagline: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
    marginTop: 2,
  },

  // Front — photo & name
  photoRing: {
    marginTop: -44,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  photo: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  personName: {
    fontSize: 19,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginTop: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.full,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginTop: 5,
  },
  roleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: 1.2,
  },

  // Front — details grid
  grid: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 18,
    paddingTop: 12,
    alignContent: 'center',
  },
  gridItem: {
    width: '50%',
    paddingVertical: 7,
    paddingRight: 8,
  },
  gridLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  gridValue: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },

  // Front — id strip
  idStrip: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  idStripText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1.5,
  },

  // Back — band
  backBand: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  backBandTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 3,
  },
  sessionChip: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: theme.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginTop: 6,
  },
  sessionChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },

  // Back — info card
  backInfoCard: {
    width: CARD_W - 36,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginTop: 16,
  },
  backRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 8,
  },
  backRowLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  backRowValue: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'right',
  },
  backDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },

  // Back — barcode
  barcodeBox: { alignItems: 'center', marginTop: 14 },
  barcode: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 36,
  },
  bar: { height: '100%', backgroundColor: theme.colors.textPrimary },
  barcodeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    letterSpacing: 3,
    marginTop: 4,
  },

  // Back — signatures
  signRow: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 22,
    justifyContent: 'space-between',
    marginTop: 'auto',
    marginBottom: 12,
  },
  signBox: { alignItems: 'center', width: 110 },
  signLine: {
    width: '100%',
    height: 1,
    backgroundColor: theme.colors.textSecondary,
    marginBottom: 4,
  },
  signLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },

  // Back — found note
  foundStrip: {
    width: '100%',
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  foundNote: {
    fontSize: 9,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 13,
  },

  // Hint
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 16,
  },
  hintText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
});
