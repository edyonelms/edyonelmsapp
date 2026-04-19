import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { MOCK_QUERIES } from './queryTypes';
import QueryCard from './QueryCard';
import { useNavigation } from '@react-navigation/native';

const PastQueriesScreen = () => {
  const navigation = useNavigation<any>();
  const [queries] = useState(MOCK_QUERIES);

  return (
    <View style={s.root}>
      <Header title="Past Queries" onBackPress={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── Page header row ── */}
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
            onPress={() => navigation.navigate('NewQuery')}
            style={s.newQueryBtn}
          >
            <VectorIcon iconSet="Ionicons" iconName="add" size={16} color="#fff" />
            <Text style={s.newQueryText}>New Query</Text>
          </TouchableOpacity>
        </View>

        {/* ── Filter chip ── */}
        <View style={s.filterRow}>
          <View style={s.filterChip}>
            <Text style={s.filterChipText}>Last 30 days</Text>
          </View>
        </View>

        {/* ── Stats row (only when queries exist) ── */}
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

        {/* ── List or empty ── */}
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
            {queries.map(item => <QueryCard key={item.id} item={item} />)}
          </View>
        )}

      </ScrollView>
    </View>
  );
};

export default PastQueriesScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: 16, paddingBottom: 40 },

  // Page header
  pageHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 16,
  },
  pageHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pageIconBox: {
    width: 52, height: 52, borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  pageTitle: { fontSize: 20, fontWeight: '800', color: theme.colors.textPrimary },
  pageSubtitle: { fontSize: 12, color: theme.colors.textMuted, marginTop: 2 },
  newQueryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    paddingHorizontal: 16, paddingVertical: 10,
  },
  newQueryText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  // Filter
  filterRow: { marginBottom: 16 },
  filterChip: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    paddingHorizontal: 16, paddingVertical: 8,
  },
  filterChipText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  // Stats
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

  // List
  list: { gap: 12 },

  // Empty
  emptyBox: { alignItems: 'center', paddingTop: 60 },
  emptyIconRing: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 6 },
  emptySubtitle: { fontSize: 13, color: theme.colors.textMuted },
});
