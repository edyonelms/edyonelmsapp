import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Header from '../../components/Header';
import { theme } from '../../utils/theme';
import VectorIcon from '../../components/VectorIcon';
const { width } = Dimensions.get('window');

const SchoolInfoScreen = ({ navigation }: any) => {
  return (
    <View style={styles.safeArea}>
      <Header title={'School Info'} onBackPress={() => navigation.goBack()} />
      <View style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.topContainer}>
            <View style={styles.logoOuterBox}>
              <View style={styles.logoInnerBox}>
                <Image source={{ uri: 'logo' }} style={styles.logoImage} />
              </View>
            </View>
          </View>

          <View style={styles.overviewSection}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.verticalBar} />
              <Text style={styles.sectionTitle}>About School</Text>
            </View>

            <Text style={styles.overviewText}>
              isracted by the readable content of a page when looking at its
              layout. The point of using Lorem Ipsum is that it has a
              more-or-less normal distribution of letters, as opposed to using
              'Content here, content here', making it look like readable
              English. Many desktop publishing packages and web page editors now
              use Lorem Ipsum as their default model text, and a search for
              'lorem ipsum' will uncover many web sites still in their infancy.
              Various versions have evolved over the years, sometimes by
              accident, sometimes on purpose (injected humour and the like).
            </Text>
          </View>

          <View style={styles.overviewSection}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.verticalBar} />
              <Text style={styles.sectionTitle}>Our Vision</Text>
            </View>

            <Text style={styles.overviewText}>
              is a long established fact that a reader will be distracted by the
              readable content of a page when looking at its layout. The point
              of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters, as opposed to using 'Content here,
              content here', making it look like readable English. Many desktop
              publishing packages and web page editors now use Lorem Ipsum as
              their default model text, and a search for 'lorem ipsum' will
              uncover many web sites still in their infancy. Various versions
              have evolved over the years, sometimes by accident, sometimes on
              purpose (injected humour and the like).
            </Text>
          </View>

          <View style={styles.overviewSection}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.verticalBar} />
              <Text style={styles.sectionTitle}>Our Mission</Text>
            </View>

            <Text style={styles.overviewText}>
              is a long established fact that a reader will be distracted by the
              readable content of a page when looking at its layout. The point
              of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters, as opposed to using 'Content here,
              content here, making it look like readable English. Many desktop
              publishing packages and web page editors now use Lorem Ipsum as
              their default model text, and a search for 'lorem ipsum' will
              uncover many web sites still in their infancy. Various versions
              have evolved over the years, sometimes by accident, sometimes on
              purpose (injected humour and the like).
            </Text>
          </View>

          <View style={styles.overviewSection}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.verticalBar} />
              <Text style={styles.sectionTitle}>Our Values</Text>
            </View>

            <Text style={styles.overviewText}>
              is a long established fact that a reader will be distracted by the
              readable content of a page when looking at its layout. The point
              of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters, as opposed to using 'Content here,
              content here, making it look like readable English. Many desktop
              publishing packages and web page editors now use Lorem Ipsum as
              their default model text, and a search for 'lorem ipsum' will
              uncover many web sites still in their infancy. Various versions
              have evolved over the years, sometimes by accident, sometimes on
              purpose (injected humour and the like).
            </Text>
          </View>

          <View style={styles.overviewSection}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.verticalBar} />
              <Text style={styles.sectionTitle}>Our Goals</Text>
            </View>

            <Text style={styles.overviewText}>
              is a long established fact that a reader will be distracted by the
              readable content of a page when looking at its layout. The point
              of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters, as opposed to using 'Content here,
              content here, making it look like readable English. Many desktop
              publishing packages and web page editors now use Lorem Ipsum as
              their default model text, and a search for 'lorem ipsum' will
              uncover many web sites still in their infancy. Various versions
              have evolved over the years, sometimes by accident, sometimes on
              purpose (injected humour and the like).
            </Text>
          </View>
          <View style={styles.overviewSection}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.verticalBar} />
              <Text style={styles.sectionTitle}>School Website</Text>
            </View>

            <Text style={styles.overviewText}>
              is a long established fact that a reader will be distracted by the
              readable content of a page when looking at its layout. The point
              of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters, as opposed to using 'Content here,
              content here, making it look like readable English. Many desktop
              publishing packages and web page editors now use Lorem Ipsum as
              their default model text, and a search for 'lorem ipsum' will
              uncover many web sites still in their infancy. Various versions
              have evolved over the years, sometimes by accident, sometimes on
              purpose (injected humour and the like).
            </Text>
          </View>

          {/* School Management Section */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.verticalBar} />
            <View style={styles.sectionIconBox}>
              <VectorIcon
                iconSet="MaterialIcons"
                iconName="groups"
                size={18}
                color="#7C3AED"
              />
            </View>
            <Text style={styles.sectionTitle}>School Management</Text>
          </View>

          <View style={styles.managementCard}>
            <View style={styles.cardTopAccent} />
            <View style={styles.avatarRingSpacer}>
              <View style={styles.avatarCenter}>
                <VectorIcon
                  iconSet="FontAwesome5"
                  iconName="graduation-cap"
                  size={26}
                  color="#E83E8C"
                />
              </View>
            </View>
            <Text style={styles.managementName}>Amit Dagur</Text>
            <View style={styles.roleChip}>
              <Text style={styles.roleText}>Director</Text>
            </View>
          </View>

          {/* School Documents Section */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.verticalBar} />
            <View style={styles.sectionIconBox}>
              <VectorIcon
                iconSet="Feather"
                iconName="folder"
                size={16}
                color="#7C3AED"
              />
            </View>
            <Text style={styles.sectionTitle}>School Documents</Text>
          </View>

          <TouchableOpacity style={styles.listItem}>
            <View style={styles.listIconBoxDoc}>
              <VectorIcon
                iconSet="Feather"
                iconName="file-text"
                size={18}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.listTextContainer}>
              <Text style={styles.listTitle}>Document</Text>
            </View>
            <View style={styles.chevronBox}>
              <VectorIcon
                iconSet="Feather"
                iconName="chevron-right"
                size={16}
                color="#A78BFA"
              />
            </View>
          </TouchableOpacity>
          <View style={styles.listDivider} />

          <TouchableOpacity style={styles.listItem}>
            <View style={styles.listIconBoxDoc}>
              <VectorIcon
                iconSet="Feather"
                iconName="file-text"
                size={18}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.listTextContainer}>
              <Text style={styles.listTitle}>hjgj</Text>
            </View>
            <View style={styles.chevronBox}>
              <VectorIcon
                iconSet="Feather"
                iconName="chevron-right"
                size={16}
                color="#A78BFA"
              />
            </View>
          </TouchableOpacity>
          <View style={styles.listDivider} />

          <TouchableOpacity style={styles.listItem}>
            <View style={styles.listIconBoxDoc}>
              <VectorIcon
                iconSet="Feather"
                iconName="file-text"
                size={18}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.listTextContainer}>
              <Text style={styles.listTitle}>jbjbkj</Text>
            </View>
            <View style={styles.chevronBox}>
              <VectorIcon
                iconSet="Feather"
                iconName="chevron-right"
                size={16}
                color="#A78BFA"
              />
            </View>
          </TouchableOpacity>

          {/* Contact Information Section */}
          <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
            <View style={styles.verticalBar} />
            <View style={styles.sectionIconBox}>
              <VectorIcon
                iconSet="MaterialCommunityIcons"
                iconName="card-account-details-outline"
                size={16}
                color="#7C3AED"
              />
            </View>
            <Text style={styles.sectionTitle}>Contact Information</Text>
          </View>

          <TouchableOpacity style={styles.listItem}>
            <View
              style={[styles.listIconBoxDoc, { backgroundColor: '#CE7DED' }]}
            >
              <VectorIcon
                iconSet="Feather"
                iconName="phone-call"
                size={18}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.listTextContainer}>
              <Text style={styles.listSubtitleType}>PHONE</Text>
              <Text style={styles.listSubtitleValue}>9898989898</Text>
            </View>
            <View style={styles.chevronBox}>
              <VectorIcon
                iconSet="Feather"
                iconName="chevron-right"
                size={16}
                color="#A78BFA"
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.listItem}>
            <View
              style={[styles.listIconBoxDoc, { backgroundColor: '#3A7CF8' }]}
            >
              <VectorIcon
                iconSet="Feather"
                iconName="mail"
                size={18}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.listTextContainer}>
              <Text style={styles.listSubtitleType}>EMAIL</Text>
              <Text style={styles.listSubtitleValue}>sd@gmail.com</Text>
            </View>
            <View style={styles.chevronBox}>
              <VectorIcon
                iconSet="Feather"
                iconName="chevron-right"
                size={16}
                color="#A78BFA"
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.listItem}>
            <View
              style={[styles.listIconBoxDoc, { backgroundColor: '#8E54E9' }]}
            >
              <VectorIcon
                iconSet="Feather"
                iconName="map-pin"
                size={18}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.listTextContainer}>
              <Text style={styles.listSubtitleType}>ADDRESS</Text>
              <Text style={styles.listSubtitleValue}>dfhdrtjtr</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

export default SchoolInfoScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontSize: 24,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  topContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 30,
    backgroundColor: '#FFFFFF',
  },
  logoOuterBox: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E6DDFE',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fcfcfc',
  },
  logoInnerBox: {
    width: 120,
    height: 120,
    borderRadius: 100,
    backgroundColor: '#F5FAFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    resizeMode: 'contain',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8B8BAE',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 25,
  },
  dividerContainer: {
    width: width * 0.7,
    height: 2,
    marginBottom: 35,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#DCD4FB',
    opacity: 0.6,
  },
  overviewSection: {
    paddingHorizontal: 20,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  verticalBar: {
    width: 4,
    height: 20,
    backgroundColor: '#5B7FFF',
    borderRadius: 4,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
  },
  overviewText: {
    fontSize: 14,
    color: '#1E1E1E',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'justify',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F3E9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  managementCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingTop: 0,
    paddingBottom: 24,
    shadowColor: '#E6DDFE',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 8,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F8F9FA',
  },
  cardTopAccent: {
    width: '40%',
    height: 4,
    backgroundColor: '#7C3AED',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginBottom: 20,
    alignSelf: 'center',
  },
  avatarRingSpacer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarCenter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  managementName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 6,
  },
  roleChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#F3E8FF',
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '600',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  listIconBoxDoc: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#6B60F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  listTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  listTitle: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  listSubtitleType: {
    fontSize: 11,
    color: '#7C3AED',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  listSubtitleValue: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '400',
  },
  chevronBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 80,
    marginRight: 20,
  },
});
