import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { EarningsStackParamList } from '../../navigation/EarningsStack';

type Props = {
  navigation: NativeStackNavigationProp<EarningsStackParamList, 'WithdrawEarnings'>;
};

const QUICK_AMOUNTS = ['₦1,000', '₦2,000', '₦5,000', 'All'];

const WithdrawEarningsScreen = ({ navigation }: Props) => {
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('48000');
  const [isLoading, setIsLoading] = useState(false);
  const availableBalance = 48000;

  const handleQuickAmount = (amount: string) => {
    setSelectedAmount(amount);
    if (amount === 'All') {
      setCustomAmount(availableBalance.toString());
    } else {
      setCustomAmount(amount.replace('₦', '').replace(',', ''));
    }
  };

  const handleWithdraw = async () => {
    if (!customAmount || parseInt(customAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    if (parseInt(customAmount) > availableBalance) {
      Alert.alert('Error', 'Amount exceeds available balance');
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1500));
      Alert.alert(
        'Withdrawal Initiated! 💰',
        `₦${parseInt(customAmount).toLocaleString()} will be transferred to your Opay account within 24 hours.`,
        [{ text: 'Done', onPress: () => navigation.goBack() }]
      );
    } finally {
      setIsLoading(false);
    }
  };

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
        <Text style={styles.headerTitle}>Withdraw Earnings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Available Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available to Withdraw</Text>
          <Text style={styles.balanceAmount}>
            ₦{availableBalance.toLocaleString()}
          </Text>
          <Text style={styles.balanceNote}>
            Pending payments will be added once they are released.
          </Text>
        </View>

        {/* Withdraw To */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Withdraw to</Text>
          <TouchableOpacity style={styles.accountCard}>
            <View style={styles.accountLeft}>
              <View style={styles.opayIconContainer}>
                <Ionicons name="phone-portrait-outline" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.accountNumber}>805*****76</Text>
                <Text style={styles.accountName}>Name@Opay</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Withdraw Amount */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Withdraw Amount</Text>

          {/* Quick Amount Buttons */}
          <View style={styles.quickAmountsRow}>
            {QUICK_AMOUNTS.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.quickAmountButton,
                  selectedAmount === amount && styles.quickAmountButtonActive,
                ]}
                onPress={() => handleQuickAmount(amount)}
              >
                <Text style={[
                  styles.quickAmountText,
                  selectedAmount === amount && styles.quickAmountTextActive,
                ]}>
                  {amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Amount Input */}
          <View style={styles.amountInputContainer}>
            <TextInput
              style={styles.amountInput}
              value={`₦${parseInt(customAmount || '0').toLocaleString()}`}
              onChangeText={(text) => {
                const num = text.replace(/[^0-9]/g, '');
                setCustomAmount(num);
                setSelectedAmount('');
              }}
              keyboardType="numeric"
              placeholder="Enter amount"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>

        {/* Withdraw Button */}
        <TouchableOpacity
          style={[styles.withdrawButton, isLoading && styles.buttonDisabled]}
          onPress={handleWithdraw}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.withdrawButtonText}>Withdraw Now</Text>
          )}
        </TouchableOpacity>

        {/* Security Notice */}
        <View style={styles.securityCard}>
          <Ionicons name="shield-checkmark" size={20} color={colors.success} />
          <Text style={styles.securityText}>
            Secure withdrawals. Amount will be transferred to your account within 24 hours.
          </Text>
        </View>

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
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  balanceCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: typography.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  balanceNote: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  opayIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountNumber: {
    fontSize: typography.md,
    fontFamily: typography.semiBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  accountName: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  quickAmountsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  quickAmountButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  quickAmountButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  quickAmountText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontFamily: typography.medium,
  },
  quickAmountTextActive: {
    color: colors.white,
    fontFamily: typography.bold,
  },
  amountInputContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    height: 56,
    justifyContent: 'center',
  },
  amountInput: {
    fontSize: typography.xl,
    fontFamily: typography.bold,
    color: colors.textPrimary,
  },
  withdrawButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  withdrawButtonText: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.white,
    letterSpacing: 0.5,
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.secondaryLight,
    borderRadius: 12,
    padding: 14,
  },
  securityText: {
    flex: 1,
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default WithdrawEarningsScreen;