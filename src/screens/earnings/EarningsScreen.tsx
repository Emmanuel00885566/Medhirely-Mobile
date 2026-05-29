import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { earningsService } from '../../services/earnings';
import { EarningsStackParamList } from '../../navigation/EarningsStack';

type NavigationProp = NativeStackNavigationProp<EarningsStackParamList, 'EarningsDashboard'>;

const FILTERS = ['All', 'Paid', 'Pending'];

const EarningsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [summary, setSummary] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const loadData = async () => {
    try {
      const [summaryData, transactionsData] = await Promise.all([
        earningsService.getSummary(),
        earningsService.getTransactions(activeFilter.toLowerCase()),
      ]);
      setSummary(summaryData);
      setTransactions(transactionsData);
    } catch (error) {
      console.log('Error loading earnings:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      loadData();
    }, [activeFilter])
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  const renderTransaction = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.transactionCard}
      onPress={() => navigation.navigate('TransactionDetail', { transactionId: item.id })}
      activeOpacity={0.85}
    >
      <View style={styles.transactionLeft}>
        <View style={[
          styles.transactionIconContainer,
          { backgroundColor: item.status === 'paid' ? colors.secondaryLight : '#FFF3E0' }
        ]}>
          <Ionicons
            name={item.status === 'paid' ? 'checkmark-circle' : 'time'}
            size={22}
            color={item.status === 'paid' ? colors.success : colors.warning}
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle} numberOfLines={1}>
            {item.shiftTitle}
          </Text>
          <Text style={styles.transactionFacility} numberOfLines={1}>
            {item.facility}
          </Text>
          <Text style={styles.transactionDate}>{item.date}</Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text style={styles.transactionAmount}>
          ₦{item.grossPay.toLocaleString()}
        </Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'paid' ? colors.secondaryLight : '#FFF3E0' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: item.status === 'paid' ? colors.success : colors.warning }
          ]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="wallet-outline" size={64} color={colors.border} />
      <Text style={styles.emptyTitle}>No Transactions</Text>
      <Text style={styles.emptySubtitle}>
        {activeFilter === 'All'
          ? 'You have no transactions yet'
          : `No ${activeFilter.toLowerCase()} transactions`}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Earnings</Text>
        <Text style={styles.headerSubtitle}>Track your income and payments</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading earnings...</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListHeaderComponent={
            <View>
              {/* Summary Cards */}
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Total Earnings</Text>
                <Text style={styles.summaryTotal}>
                  ₦{summary?.totalEarnings?.toLocaleString()}
                </Text>
                <Text style={styles.summaryShifts}>
                  {summary?.totalShiftsCompleted} shifts completed
                </Text>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryRow}>
                  <View style={styles.summaryItem}>
                    <View style={styles.summaryItemDot}>
                      <View style={[styles.dot, { backgroundColor: colors.success }]} />
                      <Text style={styles.summaryItemLabel}>Paid</Text>
                    </View>
                    <Text style={styles.summaryItemValue}>
                      ₦{summary?.paidEarnings?.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.summaryItemDivider} />
                  <View style={styles.summaryItem}>
                    <View style={styles.summaryItemDot}>
                      <View style={[styles.dot, { backgroundColor: colors.warning }]} />
                      <Text style={styles.summaryItemLabel}>Pending</Text>
                    </View>
                    <Text style={styles.summaryItemValue}>
                      ₦{summary?.pendingEarnings?.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Stats Row */}
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Ionicons name="briefcase-outline" size={20} color={colors.primary} />
                  <Text style={styles.statValue}>
                    {summary?.totalShiftsCompleted}
                  </Text>
                  <Text style={styles.statLabel}>Total Shifts</Text>
                </View>
                <View style={styles.statCard}>
                  <Ionicons name="checkmark-circle-outline" size={20} color={colors.success} />
                  <Text style={styles.statValue}>
                    {transactions.filter((t) => t.status === 'paid').length}
                  </Text>
                  <Text style={styles.statLabel}>Paid</Text>
                </View>
                <View style={styles.statCard}>
                  <Ionicons name="time-outline" size={20} color={colors.warning} />
                  <Text style={styles.statValue}>
                    {transactions.filter((t) => t.status === 'pending').length}
                  </Text>
                  <Text style={styles.statLabel}>Pending</Text>
                </View>
              </View>

              {/* Filter Tabs */}
              <View style={styles.filterContainer}>
                {FILTERS.map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.filterChip,
                      activeFilter === filter && styles.filterChipActive,
                    ]}
                    onPress={() => setActiveFilter(filter)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      activeFilter === filter && styles.filterChipTextActive,
                    ]}>
                      {filter}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.transactionsTitle}>Transaction History</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    fontSize: typography.xxl,
    fontWeight: typography.bold,
    color: colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: typography.md,
    color: colors.textSecondary,
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100,
  },
  summaryCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  summaryTotal: {
    fontSize: 36,
    fontWeight: typography.bold,
    color: colors.white,
    marginBottom: 4,
  },
  summaryShifts: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 20,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
  },
  summaryItemDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  summaryItemLabel: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.7)',
  },
  summaryItemValue: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.white,
  },
  summaryItemDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
  filterChipTextActive: {
    color: colors.white,
    fontWeight: typography.bold,
  },
  transactionsTitle: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  transactionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: typography.md,
    fontWeight: typography.semiBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  transactionFacility: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: typography.xs,
    color: colors.textMuted,
  },
  transactionRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  transactionAmount: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: typography.xs,
    fontWeight: typography.bold,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default EarningsScreen;