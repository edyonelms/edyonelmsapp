import React from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';

const { width } = Dimensions.get('window');

const BANNER_HEIGHT = 180;

const STATS = [
  {
    icon: 'school',
    iconSet: 'MaterialIcons',
    label: 'Class',
    value: 'NURSERY',
    color: '#6366F1',
  },
  {
    icon: 'id-badge',
    iconSet: 'FontAwesome5',
    label: 'Roll No',
    value: '2601065004',
    color: '#0EA5E9',
  },
  {
    icon: 'book',
    iconSet: 'FontAwesome5',
    label: 'Board',
    value: 'CBSE',
    color: '#10B981',
  },
];

const SECTIONS = [
  {
    title: 'Personal Information',
    icon: 'person',
    iconSet: 'Ionicons',
    color: '#6366F1',
    items: [
      {
        icon: 'user',
        iconSet: 'FontAwesome5',
        color: '#6366F1',
        label: 'Full Name',
        value: 'Amit Dagur',
      },
      {
        icon: 'users',
        iconSet: 'FontAwesome5',
        color: '#8B5CF6',
        label: 'Guardian Name',
        value: 'fh',
      },
      {
        icon: 'envelope',
        iconSet: 'FontAwesome5',
        color: '#0EA5E9',
        label: 'Email',
        value: 'a@gmail.com',
      },
      {
        icon: 'phone-alt',
        iconSet: 'FontAwesome5',
        color: '#10B981',
        label: 'Mobile',
        value: '2020202020',
      },
      {
        icon: 'birthday-cake',
        iconSet: 'FontAwesome5',
        color: '#F59E0B',
        label: 'DOB',
        value: '2019-02-05',
      },
      {
        icon: 'venus-mars',
        iconSet: 'FontAwesome5',
        color: '#EC4899',
        label: 'Gender',
        value: 'Male',
      },
      {
        icon: 'pray',
        iconSet: 'FontAwesome5',
        color: '#14B8A6',
        label: 'Religion',
        value: 'Hindu',
      },
    ],
  },
  {
    title: 'Address',
    icon: 'location-outline',
    iconSet: 'Ionicons',
    color: '#0EA5E9',
    items: [
      {
        icon: 'home',
        iconSet: 'FontAwesome5',
        color: '#6366F1',
        label: 'Local Address',
        value: 'grg',
      },
      {
        icon: 'map-marker-alt',
        iconSet: 'FontAwesome5',
        color: '#0EA5E9',
        label: 'Permanent Address',
        value: 'rgr',
      },
      {
        icon: 'city',
        iconSet: 'FontAwesome5',
        color: '#10B981',
        label: 'City',
        value: 'Singrauli',
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
        value: '202323',
      },
    ],
  },
  {
    title: 'School Info',
    icon: 'school-outline',
    iconSet: 'Ionicons',
    color: '#10B981',
    items: [
      {
        icon: 'id-card',
        iconSet: 'FontAwesome5',
        color: '#6366F1',
        label: 'Admission No',
        value: '2026DM0650004',
      },
      {
        icon: 'calendar-alt',
        iconSet: 'FontAwesome5',
        color: '#0EA5E9',
        label: 'Date of Admission',
        value: '2026-02-16',
      },
      {
        icon: 'fingerprint',
        iconSet: 'FontAwesome5',
        color: '#10B981',
        label: 'User ID',
        value: 'USER-23',
      },
      {
        icon: 'chalkboard',
        iconSet: 'FontAwesome5',
        color: '#F59E0B',
        label: 'Class',
        value: 'NURSERY',
      },
      {
        icon: 'layer-group',
        iconSet: 'FontAwesome5',
        color: '#EC4899',
        label: 'Section',
        value: 'SECTION A',
      },
      {
        icon: 'list-ol',
        iconSet: 'FontAwesome5',
        color: '#14B8A6',
        label: 'Roll No',
        value: '2601065004',
      },
      {
        icon: 'id-badge',
        iconSet: 'FontAwesome5',
        color: '#8B5CF6',
        label: 'Aadhar No',
        value: '202020202020',
      },
      {
        icon: 'book-open',
        iconSet: 'FontAwesome5',
        color: '#F97316',
        label: 'Board',
        value: 'CBSE',
      },
    ],
  },
];

const StudentProfileScreen = () => {
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
                iconName="user-graduate"
                size={52}
                color="#fff"
              />
            </View>
          </View>
          <Text style={styles.studentName}>Amit Dagur</Text>
          <View style={styles.roleBadge}>
            <VectorIcon
              iconSet="FontAwesome5"
              iconName="star"
              size={10}
              color="#F59E0B"
            />
            <Text style={styles.roleBadgeText}>Student · NURSERY</Text>
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
              <Text style={styles.statValue}>{s.value}</Text>
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

export default StudentProfileScreen;

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
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  avatarCircle: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E1B4B',
    marginTop: 12,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 6,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
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
    fontSize: 12,
    fontWeight: '800',
    color: '#1E1B4B',
    textAlign: 'center',
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
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1E1B4B' },

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
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
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
    color: '#1E293B',
    fontWeight: '700',
    textAlign: 'right',
    maxWidth: width * 0.45,
  },
});
