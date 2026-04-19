import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2;

const instructors = [
  {
    id: '1',
    name: 'Ravi Sharma',
    subject: 'Physics',
    email: 'ravi.sharma@edyone.in',
    qualification: 'M.Sc Physics, B.Ed',
    phone: '+919876543210',
    gradient: ['#6366F1', '#818CF8'],
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '2',
    name: 'Priya Mehta',
    subject: 'Mathematics',
    email: 'priya.mehta@edyone.in',
    qualification: 'M.Sc Mathematics',
    phone: '+919123456789',
    gradient: ['#EC4899', '#F472B6'],
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '3',
    name: 'Anil Verma',
    subject: 'Chemistry',
    email: 'anil.verma@edyone.in',
    qualification: 'Ph.D Chemistry',
    phone: '+919988776655',
    gradient: ['#F59E0B', '#FCD34D'],
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
  },
  {
    id: '4',
    name: 'Sunita Rao',
    subject: 'Biology',
    email: 'sunita.rao@edyone.in',
    qualification: 'M.Sc Biology, B.Ed',
    phone: '+918765432109',
    gradient: ['#10B981', '#34D399'],
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    id: '5',
    name: 'Deepak Singh',
    subject: 'English',
    email: 'deepak.singh@edyone.in',
    qualification: 'M.A English, B.Ed',
    phone: '+917654321098',
    gradient: ['#3B82F6', '#60A5FA'],
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
  },
  {
    id: '6',
    name: 'Kavita Joshi',
    subject: 'History',
    email: 'kavita.joshi@edyone.in',
    qualification: 'M.A History',
    phone: '+916543210987',
    gradient: ['#8B5CF6', '#A78BFA'],
    avatar: 'https://randomuser.me/api/portraits/women/90.jpg',
  },
];

type Instructor = (typeof instructors)[0];

const InstructorCard = ({ item }: { item: Instructor }) => {
  return (
    <View style={styles.card}>
      {/* Gradient header bg */}
      <LinearGradient
        colors={item.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardHeader}
      >
        {/* Subject pill */}
        <View style={styles.subjectPill}>
          <Text style={styles.subjectText}>{item.subject}</Text>
        </View>
      </LinearGradient>

      {/* Floating avatar */}
      <View style={[styles.avatarWrapper, { borderColor: item.gradient[0] }]}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatarImg} />
        ) : (
          <LinearGradient colors={item.gradient} style={styles.avatarFallback}>
            <Text style={styles.initials}>
              {item.name
                .split(' ')
                .map(n => n[0])
                .join('')}
            </Text>
          </LinearGradient>
        )}
      </View>

      {/* Body */}
      <View style={styles.cardBody}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>

        {/* Info rows */}
        <View style={styles.infoRow}>
          <View
            style={[
              styles.iconBox,
              { backgroundColor: item.gradient[0] + '18' },
            ]}
          >
            <VectorIcon
              iconSet="Feather"
              iconName="mail"
              size={11}
              color={item.gradient[0]}
            />
          </View>
          <Text style={styles.infoText} numberOfLines={1}>
            {item.email}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <View
            style={[
              styles.iconBox,
              { backgroundColor: item.gradient[0] + '18' },
            ]}
          >
            <VectorIcon
              iconSet="Ionicons"
              iconName="school-outline"
              size={11}
              color={item.gradient[0]}
            />
          </View>
          <Text style={styles.infoText} numberOfLines={1}>
            {item.qualification}
          </Text>
        </View>

        {/* Call button */}
        <TouchableOpacity
          activeOpacity={0.85}
        //   onPress={() => Linking.openURL(`tel:${item.phone}`)}
          style={styles.callBtnWrapper}
        >
          <LinearGradient
            colors={item.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.callBtn}
          >
            <Text style={styles.callBtnText}>Chat Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const InstructorScreen = () => (
  <View style={styles.screen}>
    <Header title="Instructors" />
    <FlatList
      data={instructors}
      keyExtractor={i => i.id}
      numColumns={2}
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => <InstructorCard item={item} />}
      showsVerticalScrollIndicator={false}
    />
  </View>
);

export default InstructorScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F1F5F9' },
  list: { padding: 12, paddingBottom: 30 },
  row: { justifyContent: 'space-between', marginBottom: 0 },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 22,
    marginBottom: 16,
    overflow: 'visible',
    shadowColor: '#6366F1',
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  cardHeader: {
    height: 80,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'hidden',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 12,
  },
  subjectPill: {
    backgroundColor: 'rgba(127, 103, 103, 0.28)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  subjectText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  avatarWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginTop: -34,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  avatarImg: {
    width: 62,
    height: 62,
    borderRadius: 31,
    margin: 0,
  },
  avatarFallback: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { color: '#fff', fontSize: 20, fontWeight: '800' },
  cardBody: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 14,
    alignItems: 'center',
  },
  name: {
    fontSize: 13.5,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '100%',
    marginBottom: 5,
  },
  iconBox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    flex: 1,
  },

  callBtnWrapper: {
    width: '100%',
    marginTop: 12,
    borderRadius: 999,
    overflow: 'hidden',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 999,
  },
  callBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
