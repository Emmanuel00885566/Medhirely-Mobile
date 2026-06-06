import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { earningsService } from '../../services/earnings';
import { EarningsStackParamList } from '../../navigation/EarningsStack';

type NavigationProp = NativeStackNavigationProp<EarningsStackParamList, 'Payments'>;

const TABS = ['All', 'Pending', 'Paid', 'Failed'];

const PaymentsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState('All');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await earningsService.getTransactions(
        activeTab === 'All' ? undefined : activeTab.toLowerCase()
      );
      setTransactions(data);
    } catch (error) {
      console.log('Error loading payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      loadData();
    }, [activeTab])
  );

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'paid':
        return {
          color: colors.success,
          bg: colors.secondaryLight,
          icon: 'checkmark-circle' as const,
          label: 'Paid',
        };
      case 'pending':
        return {
          color: colors.warning,
          bg: '#FFF3E0',
          icon: 'time' as const,
          label: 'Pending',
        };
      case 'failed':
        return {
          color: colors.error,
          bg: '#FFF0F0',
          icon: 'close-circle' as const,
          label: 'Failed',
        };
      default:
        return {
          color: colors.textMuted,
          bg: colors.borderLight,
          icon: 'time' as const,
          label: status,
        };
    }
  };

  // Group transactions by status
  const pendingTransactions = transactions.filter((t) => t.status === 'pending');
  const paidTransactions = transactions.filter((t) => t.status === 'paid');

  const renderTransactionItem = (item: any) => {
    const config = getStatusConfig(item.status);
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.transactionItem}
        onPress={() => navigation.navigate('TransactionDetail', { transactionId: item.id })}
        activeOpacity={0.85}
      >
        <View style={[styles.transactionIconContainer, { backgroundColor: config.bg }]}>
          <Ionicons name={config.icon} size={22} color={config.color} />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionFacility} numberOfLines={1}>
            {item.facility}
          </Text>
          <Text style={styles.transactionRole}>{item.shiftTitle}</Text>
          <Text style={styles.transactionDate}>
            {item.date} · {item.startTime} - {item.endTime}
          </Text>
        </View>
        <View style={styles.transactionRight}>
          <Text style={styles.transactionAmount}>
            ₦{item.grossPay.toLocaleString()}
          </Text>
          <Text style={[styles.transactionStatus, { color: config.color }]}>
            {config.label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    if (activeTab === 'All') {
      return (
        <ScrollableContent>
          {pendingTransactions.length > 0 && (
            <View style={styles.groupSection}>
              <Text style={styles.groupTitle}>Pending Payments</Text>
              {pendingTransactions.map(renderTransactionItem)}
            </View>
          )}
          {paidTransactions.length > 0 && (
            <View style={styles.groupSection}>
              <Text style={styles.groupTitle}>Paid Payments</Text>
              {paidTransactions.map(renderTransactionItem)}
            </View>
          )}
          {transactions.length === 0 && renderEmpty()}
        </ScrollableContent>
      );
    }

    return (
      <ScrollableContent>
        <View style={styles.groupSection}>
          {transactions.length > 0
            ? transactions.map(renderTransactionItem)
            : renderEmpty()}
        </View>
      </ScrollableContent>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="wallet-outline" size={64} color={colors.border} />
      <Text style={styles.emptyTitle}>No {activeTab} Payments</Text>
      <Text style={styles.emptySubtitle}>
        No {activeTab.toLowerCase()} payments found
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payments</Text>
        <TouchableOpacity>
          <Ionicons name="filter-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => {
              setActiveTab(tab);
              setIsLoading(true);
            }}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.tabTextActive,
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : renderContent()}
    </View>
  );
};

// Helper component for scrollable content
const ScrollableContent = ({ children }: { children: React.ReactNode }) => {
  const { ScrollView } = require('react-native');
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {children}
    </ScrollView>
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.xl,
    fontFamily: typography.bold,
    color: colors.textPrimary,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontFamily: typography.medium,
  },
  tabTextActive: {
    color: colors.white,
    fontFamily: typography.bold,
  },
  groupSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
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
  transactionFacility: {
    fontSize: typography.md,
    fontFamily: typography.semiBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  transactionRole: {
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
    gap: 4,
  },
  transactionAmount: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.textPrimary,
  },
  transactionStatus: {
    fontSize: typography.xs,
    fontFamily: typography.bold,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: typography.lg,
    fontFamily: typography.bold,
    color: colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: typography.md,
    fontFamily: typography.medium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default PaymentsScreen;