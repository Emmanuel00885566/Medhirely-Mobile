import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { earningsService } from '../../services/earnings';
import { EarningsStackParamList } from '../../navigation/EarningsStack';

type NavigationProp = NativeStackNavigationProp<EarningsStackParamList, 'EarningsDashboard'>;

const { width } = Dimensions.get('window');

const EarningsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [summary, setSummary] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);

  const loadData = async () => {
    try {
      const [summaryData, transactionsData] = await Promise.all([
        earningsService.getSummary(),
        earningsService.getTransactions(),
      ]);
      setSummary(summaryData);
      setTransactions(transactionsData.slice(0, 3));
    } catch (error) {
      console.log('Error loading earnings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      loadData();
    }, [])
  );

  const chartData = {
    labels: ['1 May', '8 May', '15 May', '22 May', '28 May'],
    datasets: [
      {
        data: [10000, 18000, 25000, 32000, 48000],
        color: () => colors.primary,
        strokeWidth: 2,
      },
    ],
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Earnings</Text>
        <TouchableOpacity style={styles.bellButton}>
          <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Total Earnings Card */}
        <View style={styles.totalCard}>
          <View style={styles.totalCardLeft}>
            <View style={styles.totalEarningsRow}>
              <Text style={styles.totalLabel}>Total Earnings</Text>
              <TouchableOpacity
                onPress={() => setBalanceVisible(!balanceVisible)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={balanceVisible ? 'eye-outline' : 'eye-off-outline'}
                  size={18}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.totalAmount}>
              {balanceVisible
                ? `₦${summary?.totalEarnings?.toLocaleString()}`
                : '₦ ••••••'}
            </Text>
            <TouchableOpacity style={styles.thisMonthButton}>
              <Text style={styles.thisMonthText}>This Month</Text>
              <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.withdrawButton}
              onPress={() => navigation.navigate('WithdrawEarnings')}
            >
              <Text style={styles.withdrawButtonText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require('../../assets/wallet.png')}
            style={styles.walletImage}
            resizeMode="contain"
          />
        </View>

        {/* Paid + Pending Cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.paidCard]}>
            <Text style={styles.statCardLabel}>Paid Earnings</Text>
            <Text style={styles.statCardAmount}>
              ₦{summary?.paidEarnings?.toLocaleString()}
            </Text>
            <Text style={styles.statCardSub}>
              {transactions.filter((t) => t.status === 'paid').length} Payments
            </Text>
          </View>
          <View style={[styles.statCard, styles.pendingCard]}>
            <Text style={styles.statCardLabel}>Pending Payments</Text>
            <Text style={[styles.statCardAmount, { color: colors.warning }]}>
              ₦{summary?.pendingEarnings?.toLocaleString()}
            </Text>
            <Text style={styles.statCardSub}>
              {transactions.filter((t) => t.status === 'pending').length} Payments
            </Text>
          </View>
        </View>

        {/* This Week + Total Shifts */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.weekCard]}>
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            <Text style={styles.weekLabel}>This Week</Text>
            <Text style={styles.weekAmount}>₦12,300</Text>
            <Text style={styles.weekSub}>3 Shifts</Text>
          </View>
          <View style={[styles.statCard, styles.shiftsCard]}>
            <Ionicons name="briefcase-outline" size={20} color={colors.primary} />
            <Text style={styles.weekLabel}>Total Shifts</Text>
            <Text style={styles.weekAmount}>
              {summary?.totalShiftsCompleted}
            </Text>
            <Text style={styles.weekSub}>This Month</Text>
          </View>
        </View>

        {/* Earnings Overview Chart */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>Earnings Overview</Text>
            <TouchableOpacity style={styles.thisMonthButton}>
              <Text style={styles.thisMonthText}>This Month</Text>
              <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <LineChart
            data={chartData}
            width={width - 64}
            height={160}
            chartConfig={{
              backgroundColor: colors.white,
              backgroundGradientFrom: colors.white,
              backgroundGradientTo: colors.white,
              decimalPlaces: 0,
              color: () => colors.primary,
              labelColor: () => colors.textMuted,
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: colors.primary,
              },
              propsForBackgroundLines: {
                strokeDasharray: '',
                stroke: colors.borderLight,
              },
            }}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLines={false}
            formatYLabel={(value) => `${parseInt(value) / 1000}k`}
          />
        </View>

        {/* Recent Transactions */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Payments')}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {transactions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.transactionItem}
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
                    size={20}
                    color={item.status === 'paid' ? colors.success : colors.warning}
                  />
                </View>
                <View>
                  <Text style={styles.transactionFacility}>
                    {item.facility}
                  </Text>
                  <Text style={styles.transactionRole}>{item.shiftTitle}</Text>
                  <Text style={styles.transactionDate}>{item.date}</Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text style={styles.transactionAmount}>
                  ₦{item.grossPay.toLocaleString()}
                </Text>
                <View style={[
                  styles.transactionBadge,
                  { backgroundColor: item.status === 'paid' ? colors.secondaryLight : '#FFF3E0' }
                ]}>
                  <Text style={[
                    styles.transactionBadgeText,
                    { color: item.status === 'paid' ? colors.success : colors.warning }
                  ]}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: typography.xxl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  bellButton: {
    position: 'relative',
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  content: {
    paddingHorizontal: 16,
  },
  totalCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  totalCardLeft: {
    flex: 1,
  },
  totalEarningsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  thisMonthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  thisMonthText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  withdrawButton: {
    marginTop: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  withdrawButtonText: {
    fontSize: typography.sm,
    fontWeight: typography.bold,
    color: colors.white,
  },
  walletImage: {
    width: 80,
    height: 80,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  paidCard: {
    backgroundColor: colors.secondaryLight,
    borderColor: colors.success,
  },
  pendingCard: {
    backgroundColor: '#FFF3E0',
    borderColor: colors.warning,
  },
  weekCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    gap: 4,
  },
  shiftsCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    gap: 4,
  },
  statCardLabel: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statCardAmount: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.success,
    marginBottom: 2,
  },
  statCardSub: {
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
  weekLabel: {
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
  weekAmount: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  weekSub: {
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
  chartSection: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  chart: {
    borderRadius: 12,
    marginLeft: -16,
  },
  recentSection: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: typography.sm,
    color: colors.primary,
    fontWeight: typography.medium,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionFacility: {
    fontSize: typography.sm,
    fontWeight: typography.semiBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  transactionRole: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: typography.xs,
    color: colors.textMuted,
  },
  transactionRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  transactionAmount: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  transactionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  transactionBadgeText: {
    fontSize: typography.xs,
    fontWeight: typography.bold,
  },
});

export default EarningsScreen;