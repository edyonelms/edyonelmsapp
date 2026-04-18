import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
const TeacherProfileScreen = () => {
  return (
    <View style={styles.safeArea}>
      <Header title="Profile" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarGradient}>
            <View style={styles.avatarCircle}>
              <VectorIcon
                iconSet="FontAwesome5"
                iconName="user"
                size={60}
                color="#FFFFFF"
              />
            </View>
          </View>
          <Text style={styles.roleTitle}>Teacher</Text>
        </View>

        {/* Sections */}
        <View style={styles.detailsContainer}>
          {/* Personal Information */}
          <View style={styles.sectionHeader}>
            <View style={styles.verticalBar} />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>
          <View style={styles.card}>
            <InfoItem label="Full Name" value="Teacher" />
            <InfoItem label="Email" value="teacher@gmail.com" />
            <InfoItem label="Mobile" value="8864985914" />
            <InfoItem label="DOB" value="" />
            <InfoItem label="Qualification" value="grdh" />
            <InfoItem label="Religion" value="" isLast />
          </View>

          {/* Address */}
          <View style={[styles.sectionHeader, { marginTop: 24 }]}>
            <View style={styles.verticalBar} />
            <Text style={styles.sectionTitle}>Address</Text>
          </View>
          <View style={styles.card}>
            <InfoItem label="Local Address" value="kjjhjhlj" />
            <InfoItem label="Permanent Address" value="" />
            <InfoItem label="City" value="Barnala" />
            <InfoItem label="State" value="Madhya Pradesh" />
            <InfoItem label="Pincode" value="202131" isLast />
          </View>

          {/* School Info */}
          <View style={[styles.sectionHeader, { marginTop: 24 }]}>
            <View style={styles.verticalBar} />
            <Text style={styles.sectionTitle}>School Info</Text>
          </View>
          <View style={styles.card}>
            <InfoItem label="Username" value="002" />
            <InfoItem
              label="Date of Joining"
              value="2026-02-18T18:30:00.000000Z"
              isLast
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

interface InfoItemProps {
  label: string;
  value: string;
  isLast?: boolean;
}

const InfoItem = ({ label, value, isLast }: InfoItemProps) => (
  <View style={[styles.infoItem, !isLast && styles.infoItemBorder]}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

export default TeacherProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 30,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 20,
  },
  avatarGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#D1CAFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#F3F0FF',
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#A78BFA',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E1B4B',
  },
  detailsContainer: {
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  verticalBar: {
    width: 4,
    height: 18,
    backgroundColor: '#4F46E5',
    borderRadius: 2,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E1B4B',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  infoItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 20,
  },
});
