import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { ProfileStackParamList } from '../../navigation/ProfileStack';

type Props = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'PaymentDisputeGuide'>;
};

const SECTIONS = [
  {
    id: '1',
    title: 'Service Fee',
    icon: 'receipt-outline',
    color: colors.warning,
    bg: '#FFF3E0',
    content: 'MedHirely charges a 10% service fee on all shift payments. The fee is deducted from the amount paid to the healthcare worker.\n\nExample:\n• Facility pays: ₦50,000\n• Platform fee (10%): ₦5,000\n• Amount received by worker: ₦45,000\n\nThis fee covers credential verification, escrow payment processing, platform maintenance, customer support, and dispute resolution.',
  },
  {
    id: '2',
    title: 'How Payments Work',
    icon: 'cash-outline',
    color: colors.primary,
    bg: colors.primaryLight,
    content: 'The platform uses an escrow system to handle all payments securely.\n\nPayment Journey:\n1. Shift Posted — facility posts a shift with the amount\n2. Worker Assigned — facility selects a worker\n3. Escrow Funded — facility pays into the escrow account\n4. Shift Completed — worker marks shift as complete\n5. Facility Confirms — facility confirms completion\n6. Fee Deducted — 10% service fee is deducted\n7. Payment Released — remaining 90% goes to worker\'s wallet\n8. Worker Withdraws — worker initiates withdrawal to bank',
  },
  {
    id: '3',
    title: 'Understanding Escrow',
    icon: 'lock-closed-outline',
    color: colors.primary,
    bg: colors.primaryLight,
    content: 'Escrow is a locked account that holds payment until agreed conditions are met. Neither party can access the funds until:\n• The shift is complete\n• The facility confirms completion\n• No active disputes exist\n\nEscrow Statuses:\n⚪ Unfunded — facility hasn\'t funded yet\n🟢 Funded — money is held securely\n🔴 On Hold — dispute raised, funds frozen\n✅ Released — payment sent to worker wallet\n↩️ Refunded — shift cancelled, funds returned to facility',
  },
  {
    id: '4',
    title: 'Your Earnings Wallet',
    icon: 'wallet-outline',
    color: colors.success,
    bg: colors.secondaryLight,
    content: 'Every worker has a wallet where earnings are sent after payment is released.\n\nTo check your wallet:\n• Go to Earnings and select Wallet\n• View current balance, recent payments and withdrawal option\n\nWithdrawing Earnings:\n1. Go to Earnings → tap Withdraw\n2. Enter the amount (full or partial)\n3. Select your withdrawal method\n4. Confirm — funds arrive in 2-5 business days\n\nEarnings History shows every payment with shift date, facility name, platform fee deducted and amount received.',
  },
  {
    id: '5',
    title: 'Raising a Dispute',
    icon: 'alert-circle-outline',
    color: colors.error,
    bg: '#FFF0F0',
    content: 'A dispute is a formal disagreement between a worker and facility about a completed shift.\n\nValid reasons to raise a dispute:\n• Facility confirmed fewer hours than actually worked\n• Payment not released after shift\n• Shift conditions were different from what was posted\n\nHow to raise a dispute:\n1. Go to Shifts on your dashboard\n2. Tap Report Issue\n3. Select dispute type\n4. Write a clear description with dates, times and amounts\n5. Attach supporting evidence\n6. Tap Submit\n\nNote: Disputes must be raised within 48 hours of shift completion.',
  },
  {
    id: '6',
    title: 'What Happens During a Dispute',
    icon: 'time-outline',
    color: colors.warning,
    bg: '#FFF3E0',
    content: 'When a dispute is raised, the escrow is immediately frozen:\n• The worker cannot access the payment\n• The facility cannot reclaim the funds\n• Nothing moves until the dispute is resolved\n\nDispute Statuses:\n📨 Submitted — case opened, awaiting acknowledgement\n🔍 Under Review — disputes team is reviewing both sides\n✅ Resolved — decision reached, funds moved accordingly\n⚖️ Appealed — one party contested the resolution\n\nMost disputes are resolved within 3-5 business days.',
  },
  {
    id: '7',
    title: 'Appealing a Decision',
    icon: 'git-pull-request-outline',
    color: colors.primary,
    bg: colors.primaryLight,
    content: 'If you believe a dispute was resolved unfairly, you can file a formal appeal within 7 days of the resolution notice.\n\nImportant:\n• Each dispute can only be appealed once\n• Appeals based on disagreement without new information are unlikely to change the outcome\n• If the appeal decision is also not in your favour, that is the final outcome\n• Make sure your appeal includes all relevant information before submitting',
  },
  {
    id: '8',
    title: 'Common Payment Issues',
    icon: 'help-circle-outline',
    color: colors.primary,
    bg: colors.primaryLight,
    content: 'My payment hasn\'t arrived after marking shift complete:\nConfirm the facility has also confirmed completion. Check the payment status — if it shows Released, it may still be processing. If pending after 48 hours of facility confirmation, contact support.\n\nFacility hasn\'t confirmed my completed shift:\nGive the facility up to 48 hours. Send a reminder via in-app messaging. If no response after 72 hours, raise a dispute.\n\nMy withdrawal hasn\'t reached my bank:\nWithdrawals process within 48-72 hours. Check with your bank first, then contact platform support.\n\nI was charged a different fee than 10%:\nThis should not happen. Take a screenshot and contact support immediately.',
  },
];

const PaymentDisputeGuideScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment & Disputes</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.introBanner}>
          <Ionicons name="cash" size={36} color={colors.warning} />
          <Text style={styles.introTitle}>Payment & Dispute Guide</Text>
          <Text style={styles.introSubtitle}>
            How payments work, when they move and what to do when something goes wrong.
          </Text>
          <View style={styles.feeTag}>
            <Text style={styles.feeTagText}>Platform Fee: 10% per completed shift</Text>
          </View>
        </View>

        {SECTIONS.map((section) => (
          <View key={section.id} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconContainer, { backgroundColor: section.bg }]}>
                <Ionicons name={section.icon as any} size={20} color={section.color} />
              </View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <View style={styles.noteCard}>
          <Ionicons name="shield-checkmark" size={18} color={colors.success} />
          <Text style={styles.noteText}>
            For any payment issues not resolved here, contact our support team through the Help section in the app.
          </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: typography.lg, fontFamily: typography.bold, color: colors.textPrimary },
  content: { paddingHorizontal: 16, paddingTop: 8 },
  introBanner: {
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  introTitle: {
    fontSize: typography.lg,
    fontFamily: typography.bold,
    color: colors.warning,
    marginTop: 10,
    marginBottom: 6,
    textAlign: 'center',
  },
  introSubtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  feeTag: {
    backgroundColor: colors.warning,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  feeTagText: {
    fontSize: typography.sm,
    fontFamily: typography.bold,
    color: colors.white,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.textPrimary,
    flex: 1,
  },
  sectionContent: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.secondaryLight,
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
  },
  noteText: {
    flex: 1,
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default PaymentDisputeGuideScreen;