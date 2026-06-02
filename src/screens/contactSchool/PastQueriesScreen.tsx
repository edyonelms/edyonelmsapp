import React, { useState, useEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import {
  getStudentContactList,
  getTeacherContactList,
} from '../../api/contactApi';
import QueryCard from './QueryCard';
import type { Query } from './queryTypes';

const PastQueriesScreen = () => {
  // ✅ ALL hooks must be at the top, in the same order every render
  const navigation = useNavigation<any>();
  
  // ── All useState together ──────────────────────────────────────────────────
  const [role, setRole] = useState<string>('student');
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate days ago from date string
  const calculateDaysAgo = (dateString: string): number => {
    const createdDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - createdDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Map API response to Query format
  const mapApiResponseToQuery = (apiItem: any): Query => {
    let status: 'Pending' | 'In Progress' | 'Resolved' = 'Pending';
    if (apiItem.admin_text && apiItem.admin_text !== null) {
      status = 'Resolved';
    } else if (apiItem.admin_reply === 1 || apiItem.admin_reply === true) {
      status = 'Resolved';
    } else if (apiItem.admin_reply === 2) {
      status = 'In Progress';
    }

    const daysAgo = calculateDaysAgo(apiItem.created_at);

    return {
      id: apiItem.id,
      subject: apiItem.topic,
      message: apiItem.student_query,
      status: status,
      created_at: apiItem.created_at,
      daysAgo: daysAgo,
      attachmentName: apiItem.image_url ? 'Image attached' : null,
      admin_reply: apiItem.admin_text,
      replied_at: apiItem.updated_at,
    };
  };

  // ── fetchQueries - defined as a regular function (not useCallback to avoid hook issues)
  const fetchQueries = async () => {
    setLoading(true);
    setError(null);
    console.log('[PastQueriesScreen] Fetching queries for role:', role);
    
    try {
      let apiResponse;
      if (role === 'teacher') {
        apiResponse = await getTeacherContactList();
      } else {
        apiResponse = await getStudentContactList();
      }

      let dataArray = [];
      if (Array.isArray(apiResponse)) {
        dataArray = apiResponse;
      } else if (apiResponse?.data && Array.isArray(apiResponse.data)) {
        dataArray = apiResponse.data;
      } else {
        dataArray = [];
      }

      console.log('[PastQueriesScreen] Data array length:', dataArray.length);

      const mappedQueries = dataArray.map(mapApiResponseToQuery);
      console.log('[PastQueriesScreen] Mapped queries count:', mappedQueries.length);
      
      setQueries(mappedQueries);
    } catch (err: any) {
      console.log('[PastQueriesScreen] Fetch error:', err?.message);
      let msg = 'Failed to load queries. Please check your internet connection.';
      if (err?.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err?.message === 'Network Error') {
        msg = 'Network Error. Please check your internet connection.';
      } else if (err?.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Load role on mount only ──
  useEffect(() => {
    const loadRole = async () => {
      try {
        const userRole = await AsyncStorage.getItem('user_role');
        console.log('[PastQueriesScreen] Role loaded:', userRole);
        if (userRole) {
          setRole(userRole);
        }
      } catch (error) {
        console.error('[PastQueriesScreen] Error loading role:', error);
      }
    };
    loadRole();
  }, []);

  // Fetch when role changes
  useEffect(() => {
    if (role) {
      fetchQueries();
    }
  }, [role]);

  // Refresh when screen comes into focus - useFocusEffect is a hook, called unconditionally
  useFocusEffect(
    useCallback(() => {
      if (role) {
        fetchQueries();
      }
    }, [role])
  );

  // Handle new query button press
  const handleNewQuery = () => {
    console.log('[PastQueriesScreen] Navigating to ContactSchool');
    navigation.navigate('NewQuery');
  };

  return (
    <View style={s.root}>
      <Header title="Past Queries" onBackPress={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* Page header row */}
        <View style={s.pageHeader}>
          <View style={s.pageHeaderLeft}>
            <View style={s.pageIconBox}>
              <VectorIcon iconSet="Ionicons" iconName="chatbubbles" size={26} color={theme.colors.primary} />
            </View>
            <View>
              <Text style={s.pageTitle}>Past Queries</Text>
              <Text style={s.pageSubtitle}>View your previous conversations</Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleNewQuery}
            style={s.newQueryBtn}
          >
            <VectorIcon iconSet="Ionicons" iconName="add" size={16} color="#fff" />
            <Text style={s.newQueryText}>New Query</Text>
          </TouchableOpacity>
        </View>

        {/* Filter chip */}
        <View style={s.filterRow}>
          <View style={s.filterChip}>
            <Text style={s.filterChipText}>All Queries</Text>
          </View>
        </View>

        {/* Body */}
        {loading ? (
          <View style={s.centeredBox}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : error ? (
          <View style={s.centeredBox}>
            <VectorIcon iconSet="Ionicons" iconName="cloud-offline-outline" size={36} color={theme.colors.textMuted} />
            <Text style={s.errorText}>{error}</Text>
            <TouchableOpacity style={s.retryBtn} onPress={fetchQueries}>
              <Text style={s.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Stats row */}
            {queries.length > 0 && (
              <View style={s.statsRow}>
                {(['Pending', 'In Progress', 'Resolved'] as const).map((status, i, arr) => {
                  const count = queries.filter(q => q.status === status).length;
                  const colors = ['#F59E0B', '#0EA5E9', '#10B981'];
                  return (
                    <React.Fragment key={status}>
                      <View style={s.statBox}>
                        <Text style={[s.statNum, { color: colors[i] }]}>{count}</Text>
                        <Text style={s.statLabel}>{status}</Text>
                      </View>
                      {i < arr.length - 1 && <View style={s.statDivider} />}
                    </React.Fragment>
                  );
                })}
              </View>
            )}

            {/* List or empty */}
            {queries.length === 0 ? (
              <View style={s.emptyBox}>
                <View style={s.emptyIconRing}>
                  <VectorIcon iconSet="Ionicons" iconName="chatbubbles-outline" size={40} color={theme.colors.primary} />
                </View>
                <Text style={s.emptyTitle}>No queries found</Text>
                <Text style={s.emptySubtitle}>Tap "New Query" to raise a concern</Text>
              </View>
            ) : (
              <View style={s.list}>
                {queries.map(item => (
                  <QueryCard key={String(item.id)} item={item} />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default PastQueriesScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: 16, paddingBottom: 40 },
  pageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  pageHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pageIconBox: {
    width: 52, height: 52, borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  pageTitle: { fontSize: 20, fontWeight: '800', color: theme.colors.textPrimary },
  pageSubtitle: { fontSize: 12, color: theme.colors.textMuted, marginTop: 2 },
  newQueryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: theme.colors.primary, borderRadius: theme.radius.full,
    paddingHorizontal: 16, paddingVertical: 10,
  },
  newQueryText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  filterRow: { marginBottom: 16 },
  filterChip: {
    alignSelf: 'flex-start', backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full, paddingHorizontal: 16, paddingVertical: 8,
  },
  filterChipText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  statsRow: {
    flexDirection: 'row', backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg, paddingVertical: 14, marginBottom: 16,
    shadowColor: theme.colors.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '500', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: theme.colors.border },
  list: { gap: 12 },
  centeredBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 12 },
  errorText: { fontSize: 14, color: theme.colors.textSecondary, textAlign: 'center' },
  retryBtn: {
    marginTop: 4, paddingHorizontal: 24, paddingVertical: 10,
    borderRadius: theme.radius.full, backgroundColor: theme.colors.primary,
  },
  retryText: { fontSize: 14, fontWeight: '700', color: theme.colors.white },
  emptyBox: { alignItems: 'center', paddingTop: 60 },
  emptyIconRing: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 6 },
  emptySubtitle: { fontSize: 13, color: theme.colors.textMuted },
});