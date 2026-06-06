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

  const handleCopy = (text: string, label: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied!', `${label} copied to clipboard`);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const isPaid = transaction?.status === 'paid';
  const platformFee = 500;
  const tax = Math.round(transaction?.grossPay * 0.05);
  const youEarned = transaction?.grossPay - platformFee - tax;

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
        <Text style={styles.headerTitle}>Payments Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Status + Facility */}
        <View style={styles.facilityCard}>
          <View style={styles.facilityTop}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: isPaid ? colors.secondaryLight : '#FFF3E0' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: isPaid ? colors.success : colors.warning }
              ]}>
                {isPaid ? 'Paid' : 'Pending'}
              </Text>
            </View>
          </View>
          <View style={styles.facilityInfo}>
            <View style={styles.facilityIconContainer}>
              <Ionicons name="add" size={24} color={colors.white} />
            </View>
            <View>
              <Text style={styles.facilityName}>{transaction?.facility}</Text>
              <Text style={styles.roleText}>{transaction?.shiftTitle}</Text>
              <Text style={styles.dateText}>
                {transaction?.date} · {transaction?.startTime} - {transaction?.endTime}
              </Text>
            </View>
          </View>

          {/* Amount */}
          <View style={styles.amountRow}>
            <Text style={styles.amount}>
              ₦{transaction?.grossPay?.toLocaleString()}
            </Text>
            <View style={styles.paidConfirm}>
              {isPaid && (
                <Ionicons name="checkmark-circle" size={24} color={colors.success} />
              )}
            </View>
          </View>

          {isPaid && (
            <Text style={styles.paidDate}>
              Paid on {new Date(transaction?.paidAt).toLocaleDateString('en-NG', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}, {new Date(transaction?.paidAt).toLocaleTimeString('en-NG', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          )}
        </View>

        {/* Payment Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Breakdown</Text>
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>
                Base Pay ({transaction?.scheduledHours} hrs)
              </Text>
              <Text style={styles.breakdownValue}>
                {transaction?.grossPay?.toLocaleString()}
              </Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Hourly Rate</Text>
              <Text style={styles.breakdownValue}>
                ₦{transaction?.hourlyRate?.toLocaleString()} / hr
              </Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Platform Fee</Text>
              <Text style={[styles.breakdownValue, { color: colors.error }]}>
                - ₦{platformFee.toLocaleString()}
              </Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Tax (5%)</Text>
              <Text style={[styles.breakdownValue, { color: colors.error }]}>
                - ₦{tax.toLocaleString()}
              </Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownRow}>
              <Text style={styles.youEarnedLabel}>You Earned</Text>
              <Text style={styles.youEarnedValue}>
                ₦{youEarned?.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.methodCard}>
            <View style={styles.methodLeft}>
              <View style={styles.methodIconContainer}>
                <Ionicons name="phone-portrait-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.methodText}>805*****76</Text>
            </View>

            <View style={styles.methodDetails}>
              <View style={styles.methodRow}>
                <Text style={styles.methodLabel}>Transaction ID</Text>
                <View style={styles.methodValueRow}>
                  <Text style={styles.methodValue}>
                    {transaction?.transactionId}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleCopy(transaction?.transactionId, 'Transaction ID')}
                  >
                    <Ionicons name="copy-outline" size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.methodDivider} />
              <View style={styles.methodRow}>
                <Text style={styles.methodLabel}>Payment Reference</Text>
                <View style={styles.methodValueRow}>
                  <Text style={styles.methodValue}>PAY_20260520</Text>
                  <TouchableOpacity
                    onPress={() => handleCopy('PAY_20260520', 'Payment Reference')}
                  >
                    <Ionicons name="copy-outline" size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Help */}
        <TouchableOpacity style={styles.helpCard}>
          <Text style={styles.helpText}>Need help with this payment?</Text>
          <View style={styles.helpRight}>
            <Text style={styles.helpLink}>Contact Support</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Pending Notice */}
        {!isPaid && (
          <View style={styles.noticeCard}>
            <Ionicons name="information-circle-outline" size={18} color={colors.warning} />
            <Text style={styles.noticeText}>
              Payment is being processed. You will be notified once released.
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
    fontSize: typography.lg,
    fontFamily: typography.bold,
    color: colors.textPrimary,
  },
  content: {
    paddingHorizontal: 16,
  },
  facilityCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  facilityTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: typography.sm,
    fontFamily: typography.bold,
  },
  facilityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  facilityIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  facilityName: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  roleText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  dateText: {
    fontSize: typography.xs,
    color: colors.textMuted,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  amount: {
    fontSize: 32,
    fontFamily: typography.bold,
    color: colors.textPrimary,
  },
  paidConfirm: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paidDate: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.textPrimary,
    marginBottom: 10,
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
    paddingVertical: 8,
  },
  breakdownLabel: {
    fontSize: typography.md,
    color: colors.textSecondary,
  },
  breakdownValue: {
    fontSize: typography.md,
    color: colors.textPrimary,
    fontFamily: typography.medium,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  youEarnedLabel: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.textPrimary,
  },
  youEarnedValue: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.primary,
  },
  methodCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  methodIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodText: {
    fontSize: typography.md,
    fontFamily: typography.semiBold,
    color: colors.textPrimary,
  },
  methodDetails: {
    gap: 4,
  },
  methodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  methodLabel: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  methodValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  methodValue: {
    fontSize: typography.sm,
    fontFamily: typography.medium,
    color: colors.textPrimary,
  },
  methodDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  helpCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  helpText: {
    fontSize: typography.md,
    color: colors.textPrimary,
  },
  helpRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  helpLink: {
    fontSize: typography.sm,
    color: colors.primary,
    fontFamily: typography.medium,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 14,
  },
  noticeText: {
    flex: 1,
    fontSize: typography.sm,
    color: colors.warning,
    lineHeight: 20,
  },
});

export default TransactionDetailScreen;