import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Clipboard,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { earningsService } from '../../services/earnings';
import { EarningsStackParamList } from '../../navigation/EarningsStack';

type Props = {
  navigation: NativeStackNavigationProp<EarningsStackParamList, 'TransactionDetail'>;
  route: RouteProp<EarningsStackParamList, 'TransactionDetail'>;
};

const TransactionDetailScreen = ({ navigation, route }: Props) => {
  const { transactionId } = route.params;
  const [transaction, setTransaction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await earningsService.getTransactionById(transactionId);
      setTransaction(data);
      setIsLoading(false);
    };
    load();
  }, []);

  const handleCopyId = () => {
    Clipboard.setString(transaction?.transactionId || '');
    Alert.alert('Copied!', 'Transaction ID copied to clipboard');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const isPaid = transaction?.status === 'paid';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Detail</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Amount Card */}
        <View style={styles.amountCard}>
          <View style={[
            styles.amountIconContainer,
            { backgroundColor: isPaid ? colors.secondaryLight : '#FFF3E0' }
          ]}>
            <Ionicons
              name={isPaid ? 'checkmark-circle' : 'time'}
              size={40}
              color={isPaid ? colors.success : colors.warning}
            />
          </View>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amountValue}>
            ₦{transaction?.grossPay?.toLocaleString()}
          </Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: isPaid ? colors.secondaryLight : '#FFF3E0' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: isPaid ? colors.success : colors.warning }
            ]}>
              {isPaid ? 'Payment Confirmed' : 'Payment Pending'}
            </Text>
          </View>
        </View>

        {/* Transaction ID */}
        <View style={styles.transactionIdCard}>
          <View style={styles.transactionIdLeft}>
            <Text style={styles.transactionIdLabel}>Transaction ID</Text>
            <Text style={styles.transactionIdValue}>
              {transaction?.transactionId}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={handleCopyId}
          >
            <Ionicons name="copy-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Shift Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shift Details</Text>
          <View style={styles.infoCard}>
            {[
              {
                icon: 'briefcase-outline',
                label: 'Shift Title',
                value: transaction?.shiftTitle,
              },
              {
                icon: 'business-outline',
                label: 'Facility',
                value: transaction?.facility,
              },
              {
                icon: 'calendar-outline',
                label: 'Date',
                value: transaction?.date,
              },
              {
                icon: 'time-outline',
                label: 'Time',
                value: `${transaction?.startTime} - ${transaction?.endTime}`,
              },
            ].map((item, index) => (
              <View key={index}>
                <View style={styles.infoRow}>
                  <View style={styles.infoIconContainer}>
                    <Ionicons
                      name={item.icon as any}
                      size={18}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>{item.label}</Text>
                    <Text style={styles.infoValue}>{item.value}</Text>
                  </View>
                </View>
                {index < 3 && <View style={styles.infoDivider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Payment Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Breakdown</Text>
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Scheduled Hours</Text>
              <Text style={styles.breakdownValue}>
                {transaction?.scheduledHours} hrs
              </Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Hours Worked</Text>
              <Text style={styles.breakdownValue}>
                {transaction?.hoursWorked} hrs
              </Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Hourly Rate</Text>
              <Text style={styles.breakdownValue}>
                ₦{transaction?.hourlyRate?.toLocaleString()}/hr
              </Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Payment Status</Text>
              <Text style={[
                styles.breakdownValue,
                { color: isPaid ? colors.success : colors.warning }
              ]}>
                {isPaid ? 'Paid' : 'Pending'}
              </Text>
            </View>
            {isPaid && (
              <>
                <View style={styles.breakdownDivider} />
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Paid On</Text>
                  <Text style={styles.breakdownValue}>
                    {new Date(transaction?.paidAt).toLocaleDateString('en-NG', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              </>
            )}

            {/* Total */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Pay</Text>
              <Text style={styles.totalValue}>
                ₦{transaction?.grossPay?.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Note for pending */}
        {!isPaid && (
          <View style={styles.noticeCard}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={colors.warning}
            />
            <Text style={styles.noticeText}>
              Payment is currently being processed. You will receive a
              notification once it has been released to your account.
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
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
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.white,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  amountCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  amountIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: typography.sm,
    fontWeight: typography.bold,
  },
  transactionIdCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  transactionIdLeft: {
    flex: 1,
  },
  transactionIdLabel: {
    fontSize: typography.xs,
    color: colors.textMuted,
    marginBottom: 4,
  },
  transactionIdValue: {
    fontSize: typography.md,
    fontWeight: typography.semiBold,
    color: colors.textPrimary,
  },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 8,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.xs,
    color: colors.textMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: typography.md,
    fontWeight: typography.medium,
    color: colors.textPrimary,
  },
  infoDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  breakdownCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  breakdownLabel: {
    fontSize: typography.md,
    color: colors.textSecondary,
  },
  breakdownValue: {
    fontSize: typography.md,
    fontWeight: typography.semiBold,
    color: colors.textPrimary,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 4,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  totalLabel: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.primary,
  },
  noticeCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    alignItems: 'flex-start',
  },
  noticeText: {
    flex: 1,
    fontSize: typography.sm,
    color: colors.warning,
    lineHeight: 20,
  },
});

export default TransactionDetailScreen;