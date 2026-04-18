import React from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';

const { width } = Dimensions.get('window');

const BANNER_HEIGHT = 180;
const ACCENT = '#0EA5E9';

const STATS = [
  {
    icon: 'chalkboard-teacher',
    iconSet: 'FontAwesome5',
    label: 'Role',
    value: 'Teacher',
    color: '#0EA5E9',
  },
  {
    icon: 'calendar-check',
    iconSet: 'FontAwesome5',
    label: 'Joined',
    value: '2026-02-18',
    color: '#10B981',
  },
  {
    icon: 'id-badge',
    iconSet: 'FontAwesome5',
    label: 'Username',
    value: '002',
    color: '#8B5CF6',
  },
];

const SECTIONS = [
  {
    title: 'Personal Information',
    icon: 'person-outline',
    iconSet: 'Ionicons',
    color: '#0EA5E9',
    items: [
      {
        icon: 'user-tie',
        iconSet: 'FontAwesome5',
        color: '#0EA5E9',
        label: 'Full Name',
        value: 'Teacher',
      },
      {
        icon: 'envelope',
        iconSet: 'FontAwesome5',
        color: '#6366F1',
        label: 'Email',
        value: 'teacher@gmail.com',
      },
      {
        icon: 'phone-alt',
        iconSet: 'FontAwesome5',
        color: '#10B981',
        label: 'Mobile',
        value: '8864985914',
      },
      {
        icon: 'birthday-cake',
        iconSet: 'FontAwesome5',
        color: '#F59E0B',
        label: 'DOB',
        value: '',
      },
      {
        icon: 'graduation-cap',
        iconSet: 'FontAwesome5',
        color: '#8B5CF6',
        label: 'Qualification',
        value: 'grdh',
      },
      {
        icon: 'pray',
        iconSet: 'FontAwesome5',
        color: '#14B8A6',
        label: 'Religion',
        value: '',
      },
    ],
  },
  {
    title: 'Address',
    icon: 'location-outline',
    iconSet: 'Ionicons',
    color: '#10B981',
    items: [
      {
        icon: 'home',
        iconSet: 'FontAwesome5',
        color: '#6366F1',
        label: 'Local Address',
        value: 'kjjhjhlj',
      },
      {
        icon: 'map-marker-alt',
        iconSet: 'FontAwesome5',
        color: '#0EA5E9',
        label: 'Permanent Address',
        value: '',
      },
      {
        icon: 'city',
        iconSet: 'FontAwesome5',
        color: '#10B981',
        label: 'City',
        value: 'Barnala',
      },
      {
        icon: 'flag',
        iconSet: 'FontAwesome5',
        color: '#F59E0B',
        label: 'State',
        value: 'Madhya Pradesh',
      },
      {
        icon: 'mail-bulk',
        iconSet: 'FontAwesome5',
        color: '#EC4899',
        label: 'Pincode',
        value: '202131',
      },
    ],
  },
  {
    title: 'School Info',
    icon: 'school-outline',
    iconSet: 'Ionicons',
    color: '#8B5CF6',
    items: [
      {
        icon: 'id-badge',
        iconSet: 'FontAwesome5',
        color: '#8B5CF6',
        label: 'Username',
        value: '002',
      },
      {
        icon: 'calendar-alt',
        iconSet: 'FontAwesome5',
        color: '#0EA5E9',
        label: 'Date of Joining',
        value: '2026-02-18',
      },
    ],
  },
];

const TeacherProfileScreen = () => {
  return (
    <View style={styles.safeArea}>
      <Header title="Profile" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar overlapping banner */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarRing}>
            <View style={styles.avatarCircle}>
              <VectorIcon
                iconSet="FontAwesome5"
                iconName="chalkboard-teacher"
                size={48}
                color="#fff"
              />
            </View>
          </View>
          <Text style={styles.teacherName}>Teacher</Text>
          <View style={styles.roleBadge}>
            <VectorIcon
              iconSet="FontAwesome5"
              iconName="award"
              size={10}
              color="#0EA5E9"
            />
            <Text style={styles.roleBadgeText}>Faculty Member</Text>
          </View>
        </View>

        {/* Stat chips */}
        <View style={styles.statsRow}>
          {STATS.map((s, i) => (
            <View key={i} style={styles.statChip}>
              <View
                style={[
                  styles.statIconBox,
                  { backgroundColor: s.color + '20' },
                ]}
              >
                <VectorIcon
                  iconSet={s.iconSet as any}
                  iconName={s.icon}
                  size={16}
                  color={s.color}
                />
              </View>
              <Text style={styles.statValue} numberOfLines={1}>
                {s.value || '—'}
              </Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Sections */}
        <View style={styles.sectionsContainer}>
          {SECTIONS.map((section, si) => (
            <View key={si} style={styles.sectionBlock}>
              <View style={styles.sectionHeader}>
                <View
                  style={[
                    styles.sectionIconBox,
                    { backgroundColor: section.color + '18' },
                  ]}
                >
                  <VectorIcon
                    iconSet={section.iconSet as any}
                    iconName={section.icon}
                    size={16}
                    color={section.color}
                  />
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <View style={styles.card}>
                {section.items.map((item, ii) => (
                  <View
                    key={ii}
                    style={[
                      styles.infoRow,
                      ii < section.items.length - 1 && styles.infoRowBorder,
                    ]}
                  >
                    <View
                      style={[
                        styles.infoIconBadge,
                        { backgroundColor: item.color + '18' },
                      ]}
                    >
                      <VectorIcon
                        iconSet={item.iconSet as any}
                        iconName={item.icon}
                        size={13}
                        color={item.color}
                      />
                    </View>
                    <Text style={styles.infoLabel}>{item.label}</Text>
                    <Text style={styles.infoValue}>{item.value || '—'}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default TeacherProfileScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },

  avatarWrapper: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 8,
  },
  avatarRing: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  avatarCircle: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teacherName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0C1A2E',
    marginTop: 12,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 6,
    gap: 4,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
    marginLeft: 4,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statChip: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0C1A2E',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },

  sectionsContainer: { paddingHorizontal: 16, paddingBottom: 40 },
  sectionBlock: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  sectionIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0C1A2E' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 10,
  },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F0F9FF' },
  infoIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: { flex: 1, fontSize: 13, color: '#64748B', fontWeight: '500' },
  infoValue: {
    fontSize: 13,
    color: '#0C1A2E',
    fontWeight: '700',
    textAlign: 'right',
    maxWidth: width * 0.45,
  },
});
