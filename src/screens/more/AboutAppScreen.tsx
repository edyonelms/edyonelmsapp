import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const AboutAppScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.safeArea}>
      <Header title="About App" onBackPress={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Logo Section */}
        <View style={styles.topContainer}>
          <View style={styles.logoOuterBox}>
            <View style={styles.logoInnerBox}>
              <Image source={{ uri: 'logo' }} style={styles.logoImage} />
            </View>
          </View>

          <Text style={styles.mainTitle}>About App</Text>
          <Text style={styles.subtitle}>
            Checkout the details about our application as well as{'\n'}about our
            platform.
          </Text>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
          </View>
        </View>

        {/* Company Overview */}
        <View style={styles.overviewSection}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.verticalBar} />
            <Text style={styles.sectionTitle}>Company Overview</Text>
          </View>

          <Text style={styles.overviewText}>
            EdyoneLMS is a comprehensive cloud-based Learning Management System
            (LMS) designed to simplify and digitize school operations while
            enhancing teaching and learning experiences.
          </Text>

          <Text style={styles.overviewText}>
            It serves as a unified platform for administrators, teachers,
            students, and parents, enabling seamless communication, academic
            management, and real-time insights across the entire educational
            ecosystem.
          </Text>

          <Text style={styles.overviewText}>
            EdyoneLMS is part of a broader Edyone ecosystem, which includes
            additional platforms focused on learning and student safety.
          </Text>
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.overviewSection}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.verticalBar} />
            <Text style={styles.sectionTitle}>Mission and Vision</Text>
          </View>

          <Text style={styles.overviewText}>
            Mission: {'\n'}To make quality education management accessible,
            affordable, and efficient for every school through technology-driven
            solutions.
          </Text>

          <Text style={styles.overviewText}>
            Vision: {'\n'}To become a leading digital infrastructure for schools
            across India by enabling data-driven, transparent, and scalable
            education systems.
          </Text>
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.overviewSection}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.verticalBar} />
            <Text style={styles.sectionTitle}>Our Platform</Text>
          </View>

          <Text style={styles.overviewText}>
            EdyoneLMS provides an end-to-end academic and administrative system,
            including:
          </Text>

          <Text style={styles.overviewText}>
            Attendance tracking (mobile, QR, biometric) Fee management and
            financial reporting Timetable automation. Assignments, quizzes, and
            assessments Academic performance analytics Communication tools for
            parents and teachers
          </Text>
          <Text style={styles.overviewText}>
            The platform integrates over 30+ modules to streamline school
            operations and improve efficiency.
          </Text>
        </View>
        <View style={styles.sectionDivider} />
        <View style={styles.overviewSection}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.verticalBar} />
            <Text style={styles.sectionTitle}>Founders and Leadership</Text>
          </View>

          <Text style={styles.overviewText}>
            EdyoneLMS is built and managed by a team of educators, engineers,
            and business professionals based in Aligarh, Uttar Pradesh, India.
          </Text>

          <Text style={styles.overviewText}>
            Leadership Team {'\n'}
            Annant Dagur - Founder & CEO{'\n'}
            Visionary behind EdyoneLMS{'\n'}
            Focused on making school technology accessible and scalable
          </Text>
          <Text style={styles.overviewText}>
            Shivam Gautam - CTO{'\n'}
            Leads engineering and product development{'\n'}
            Ensures platform performance, innovation, and uptime
          </Text>
          <Text style={styles.overviewText}>
            Satyam Kumar - CFO & Head of Operations{'\n'}
            Drives growth strategy and operational efficiency
          </Text>
          <Text style={styles.overviewText}>
            Rekha Devi - Managing Director{'\n'}
            Oversees partnerships and institutional operations
          </Text>
          <Text style={styles.overviewText}>
            The leadership team combines technical expertise with real
            educational insights, ensuring the platform solves practical school
            challenges.
          </Text>
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.overviewSection}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.verticalBar} />
            <Text style={styles.sectionTitle}>Company Details</Text>
          </View>

          <Text style={styles.overviewText}>
            Legal Name: Edyone Educators Private Limited {'\n'}
            Brand Name: EdyoneLMS
          </Text>

          <Text style={styles.overviewText}>
            Registered Address:{'\n'}
            House No. 02, Braj Vihar Colony,{'\n'}Jattari, Khair, Aligarh,{'\n'}
            Uttar Pradesh - 202137, India
          </Text>

          <Text style={styles.overviewText}>
            Contact Information:{'\n'}
            Email: support@edyonelms.in{'\n'}
            Phone: +91 9084748563
          </Text>
        </View>

        <View style={styles.sectionDivider} />
        <View style={styles.overviewSection}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.verticalBar} />
            <Text style={styles.sectionTitle}>Product Ecosystem</Text>
          </View>

          <Text style={styles.overviewText}>
            Edyone operates multiple integrated platforms:{'\n\n'}
            Edyone - Learning platform for academic and competitive preparation
            {'\n'}EdyoneLMS - School management and LMS system {'\n\n'}Edyone
            Safe - Parental control and digital safety solution{'\n\n'}This
            ecosystem ensures complete digital coverage of education + safety.
          </Text>
        </View>
        <View style={styles.sectionDivider} />
        <View style={styles.overviewSection}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.verticalBar} />
            <Text style={styles.sectionTitle}>Technology and Security</Text>
          </View>

          <Text style={styles.overviewText}>
            EdyoneLMS follows modern security and{'\n'}
            infrastructure practices:{'\n'}
            256-bit SSL encryption{'\n'}
            Role-based access control{'\n'}
            Secure cloud hosting{'\n'}
            Daily automated backups{'\n\n'}
            The platform is designed to comply with: Indian IT laws{'\n'}
            Digital Personal Data Protection Act, 2023 (DPDP Act){'\n'}
            Global best practices (e.g., GDPR principles)
          </Text>
        </View>
        <View style={styles.sectionDivider} />
        <View style={styles.overviewSection}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.verticalBar} />
            <Text style={styles.sectionTitle}>
              Key Features and Capabilities
            </Text>
          </View>

          <Text style={styles.overviewText}>
            Academic Management{'\n'}
            Digital classrooms and content delivery{'\n'}
            Assignment submission and grading{'\n'}
            Report card automation{'\n\n'}
            Administrative Tools{'\n'}
            Student and staff management{'\n'}
            Payroll and finance tracking{'\n'}
            Transport and library systems{'\n\n'}
            Analytics & Insights{'\n'}
            Real-time dashboards{'\n'}
            Performance tracking{'\n'}
            Attendance trends{'\n\n'}
            Communication{'\n'}
            Instant notifications (SMS/WhatsApp){'\n'}
            Parent-teacher interaction{'\n'}
            School announcements
          </Text>
        </View>
        <View style={styles.sectionDivider} />
        <View style={styles.overviewSection}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.verticalBar} />
            <Text style={styles.sectionTitle}>Users and Reach</Text>
          </View>

          <Text style={styles.overviewText}>
            EdyoneLMS is trusted by:{'\n'}
            Schools across India{'\n'}
            Thousands of students and educators{'\n'}
            Institutions seeking affordable digital{'\n'}
            transformation{'\n\n'}
            The platform supports multi-role access, ensuring every stakeholder
            gets a customized experience.
          </Text>
        </View>
        <View style={styles.sectionDivider} />

        <View style={styles.overviewSection}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.verticalBar} />
            <Text style={styles.sectionTitle}>
              Accessibility and Availability
            </Text>
          </View>

          <Text style={styles.overviewText}>
            EdyoneLMS is accessible via:{'\n'}
            Web browsers{'\n'}
            Android mobile applications{'\n'}
            Multi-device compatibility{'\n\n'}
            This ensures anytime, anywhere access to education and school data.
          </Text>
        </View>
        <View style={styles.sectionDivider} />

        <View style={styles.overviewSection}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.verticalBar} />
            <Text style={styles.sectionTitle}>Legal and Compliance</Text>
          </View>

          <Text style={styles.overviewText}>
            EdyoneLMS complies with:{'\n'}
            Digital Personal Data Protection Act, 2023{'\n'}Applicable Indian IT
            laws{'\n'}
            Data security and privacy standards{'\n\n'}
            All data is processed securely and only for legitimate educational
            purposes.
          </Text>
        </View>
        <View style={styles.sectionDivider} />

        <View style={styles.overviewSection}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.verticalBar} />
            <Text style={styles.sectionTitle}>Intellectual Property</Text>
          </View>

          <Text style={styles.overviewText}>
            All rights related to the EdyoneLMS platform, including software,
            design, branding, and content, are owned by the Company.{'\n\n'}
            Unauthorized use, copying, or distribution is strictly prohibited.
          </Text>
        </View>
        <View style={styles.sectionDivider} />

        <View style={styles.overviewSection}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.verticalBar} />
            <Text style={styles.sectionTitle}>Disclaimer </Text>
          </View>

          <Text style={styles.overviewText}>
            EdyoneLMS provides technology infrastructure for educational
            institutions.{'\n'}
            We do not guarantee academic outcomes or performance improvements.
            {'\n\n'}
            Institutions are responsible for how they use the platform.
          </Text>
        </View>
        <View style={styles.sectionDivider} />
        {/* Contact Details Card */}
        <View style={styles.card}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.verticalBar} />
            <Text style={styles.sectionTitle}>Contact Details</Text>
          </View>

          {[
            { icon: 'mail-outline', value: 'support@edyonelms.in' },
            { icon: 'call-outline', value: '8864985914' },
            {
              icon: 'location-outline',
              value:
                'House No.02, Braj Vihar colony Jattari, Khair, Aligarh, UP',
            },
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.cardItem}>
              <View style={styles.gradientIcon}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName={item.icon}
                  size={18}
                  color="#fff"
                />
              </View>

              <Text style={styles.cardText} numberOfLines={2}>
                {item.value}
              </Text>

              <VectorIcon
                iconSet="Ionicons"
                iconName="chevron-forward"
                size={18}
                color="#B0B0B0"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Core Team Empty */}
        <View style={styles.card}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.verticalBar} />
            <Text style={styles.sectionTitle}>Core Team</Text>
          </View>
          <View style={{ alignItems: 'center', marginTop: 30 }}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="people-outline"
              size={40}
              color="#C8B6FF"
            />
            <Text style={{ color: '#B0AFC6', marginTop: 10 }}>
              Team info not available.
            </Text>
          </View>
        </View>

        {/* Follow Us Card */}
        <View style={styles.card}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.verticalBar} />
            <Text style={styles.sectionTitle}>Follow Us</Text>
          </View>

          {[
            { name: 'facebook', icon: 'logo-facebook', color: '#1877F2' },
            { name: 'instagram', icon: 'logo-instagram', color: '#E1306C' },
          ].map((item, index) => (
            <View key={index} style={styles.followRow}>
              <View
                style={[styles.gradientIcon, { backgroundColor: item.color }]}
              >
                <VectorIcon
                  iconSet="Ionicons"
                  iconName={item.icon}
                  size={18}
                  color="#fff"
                />
              </View>

              <Text style={styles.cardText}>{item.name}</Text>

              <TouchableOpacity style={styles.followBtn}>
                <Text style={styles.followText}>Follow</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={{ alignItems: 'center', marginTop: 30 }}>
          <View style={styles.footerLine} />
          <Text style={styles.footer}>© 2026 · All rights reserved</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutAppScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    borderRadius: 22,
    backgroundColor: '#F5FAFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 22,
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
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    // elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },

  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  gradientIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  cardText: {
    flex: 1,
    fontSize: 14,
    color: '#1C1C1E',
  },

  followRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  followBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#6C63FF',
  },

  followText: {
    color: '#fff',
    fontWeight: '600',
  },

  footerLine: {
    width: 200,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#6C63FF',
    // marginBottom: 10,
  },
  footer: {
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 30,
  },
});
