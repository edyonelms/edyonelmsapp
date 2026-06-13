import React, { useState, useEffect, useCallback } from 'react';
import ScreenSkeleton from '../../components/Skeleton';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { getInstructors, getInstructorDetails } from '../../api/instructorApi';
import InstructorDetailModal from './InstructorDetailModal';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2;

const getGradient = (id: number) => {
  const gradients = [
    ['#6366F1', '#818CF8'],
    ['#EC4899', '#F472B6'],
    ['#F59E0B', '#FCD34D'],
    ['#10B981', '#34D399'],
    ['#3B82F6', '#60A5FA'],
    ['#8B5CF6', '#A78BFA'],
  ];
  return gradients[id % gradients.length];
};

const InstructorCard = ({ item, onPress }: { item: any; onPress: () => void }) => {
  const gradient = getGradient(item.id);
  const subjectNames = item.subjects?.map((s: any) => s.name).join(', ') || 'No subjects';

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.card}>
      {/* Gradient header bg */}
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardHeader}
      >
        {/* Subject pill */}
        <View style={styles.subjectPill}>
          <Text style={styles.subjectText} numberOfLines={1}>
            {subjectNames}
          </Text>
        </View>
      </LinearGradient>

      {/* Floating avatar */}
      <View style={[styles.avatarWrapper, { borderColor: gradient[0] }]}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatarImg} />
        ) : (
          <LinearGradient colors={gradient} style={styles.avatarFallback}>
            <Text style={styles.initials}>
              {item.name
                .split(' ')
                .map((n: string) => n[0])
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
              { backgroundColor: gradient[0] + '18' },
            ]}
          >
            <VectorIcon
              iconSet="Feather"
              iconName="mail"
              size={11}
              color={gradient[0]}
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
              { backgroundColor: gradient[0] + '18' },
            ]}
          >
            <VectorIcon
              iconSet="Ionicons"
              iconName="briefcase-outline"
              size={11}
              color={gradient[0]}
            />
          </View>
          <Text style={styles.infoText} numberOfLines={1}>
            ID: {item.employee_id}
          </Text>
        </View>

        {/* Chat button */}
        <View style={styles.callBtnWrapper}>
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.callBtn}
          >
            <Text style={styles.callBtnText}>View Profile</Text>
          </LinearGradient>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const InstructorScreen = () => {
  const [instructors, setInstructors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Fetch instructors
  const fetchInstructors = useCallback(async () => {
    console.log('[InstructorScreen] Fetching instructors...');
    setLoading(true);
    setError(null);
    
    try {
      const data = await getInstructors(20);
      console.log('[InstructorScreen] Instructors fetched:', data.length);
      setInstructors(data);
    } catch (err: any) {
      console.error('[InstructorScreen] Error:', err?.message);
      setError(err?.message || 'Failed to load instructors');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  // Handle instructor press - fetch details
  const handleInstructorPress = async (instructor: any) => {
    console.log('[InstructorScreen] Instructor pressed:', instructor.id);
    setSelectedInstructor(instructor);
    setModalVisible(true);
    setDetailLoading(true);
    
    try {
      const details = await getInstructorDetails(instructor.id);
      console.log('[InstructorScreen] Details fetched successfully');
      
      // Merge details with existing instructor data
      if (details?.data) {
        setSelectedInstructor({
          ...instructor,
          ...details.data,
        });
      }
    } catch (err: any) {
      console.error('[InstructorScreen] Error fetching details:', err?.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseModal = () => {
    console.log('[InstructorScreen] Closing modal');
    setModalVisible(false);
    setSelectedInstructor(null);
  };

  if (loading) {
    return (
      <View style={styles.screen}>
        <Header title="Instructors" />
        <View style={styles.centeredBox}>
          <ScreenSkeleton variant="list" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.screen}>
        <Header title="Instructors" />
        <View style={styles.centeredBox}>
          <VectorIcon iconSet="Ionicons" iconName="cloud-offline-outline" size={36} color={theme.colors.textMuted} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchInstructors}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Header title="Instructors" />
      <FlatList
        data={instructors}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <InstructorCard item={item} onPress={() => handleInstructorPress(item)} />
        )}
        showsVerticalScrollIndicator={false}
      />
      
      <InstructorDetailModal
        visible={modalVisible}
        instructor={selectedInstructor}
        loading={detailLoading}
        onClose={handleCloseModal}
      />
    </View>
  );
};

export default InstructorScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F1F5F9' },
  list: { padding: 12, paddingBottom: 30 },
  row: { justifyContent: 'space-between', marginBottom: 0 },
  centeredBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 4,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.white,
  },
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
    maxWidth: '100%',
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