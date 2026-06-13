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
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'HelpSupport'>;
};

const HELP_ITEMS = [
  {
    id: 'onboarding',
    title: 'Healthcare Worker Guide',
    subtitle: 'Learn how to set up your profile, upload credentials and apply for shifts',
    icon: 'person-circle-outline' as const,
    screen: 'WorkerOnboardingGuide',
    color: colors.primary,
    bg: colors.primaryLight,
  },
  {
    id: 'verification',
    title: 'Verification Policy',
    subtitle: 'Understand what documents are needed and how verification works',
    icon: 'shield-checkmark-outline' as const,
    screen: 'VerificationPolicy',
    color: colors.success,
    bg: colors.secondaryLight,
  },
  {
    id: 'payment',
    title: 'Payment & Dispute Guide',
    subtitle: 'How payments work, withdrawals, escrow and raising disputes',
    icon: 'cash-outline' as const,
    screen: 'PaymentDisputeGuide',
    color: colors.warning,
    bg: '#FFF3E0',
  },
];

const CONTACT_ITEMS = [
  {
    id: 'email',
    title: 'Email Support',
    subtitle: 'support@medhirely.com',
    icon: 'mail-outline' as const,
  },
  {
    id: 'chat',
    title: 'Live Chat',
    subtitle: 'Available Monday - Friday, 9am - 6pm',
    icon: 'chatbubble-outline' as const,
  },
];

const HelpSupportScreen = ({ navigation }: Props) => {
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
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Banner */}
        <View style={styles.banner}>
          <Ionicons name="help-circle" size={36} color={colors.primary} />
          <Text style={styles.bannerTitle}>How can we help you?</Text>
          <Text style={styles.bannerSubtitle}>
            Browse our guides below or contact our support team directly.
          </Text>
        </View>

        {/* Guides */}
        <Text style={styles.sectionTitle}>Guides & Policies</Text>
        {HELP_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.helpCard}
            onPress={() => navigation.navigate(item.screen as any)}
            activeOpacity={0.85}
          >
            <View style={[styles.helpIconContainer, { backgroundColor: item.bg }]}>
              <Ionicons name={item.icon} size={24} color={item.color} />
            </View>
            <View style={styles.helpCardText}>
              <Text style={styles.helpCardTitle}>{item.title}</Text>
              <Text style={styles.helpCardSubtitle}>{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ))}

        {/* Contact */}
        <Text style={styles.sectionTitle}>Contact Us</Text>
        {CONTACT_ITEMS.map((item) => (
          <View key={item.id} style={styles.contactCard}>
            <View style={styles.contactIconContainer}>
              <Ionicons name={item.icon} size={22} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.contactTitle}>{item.title}</Text>
              <Text style={styles.contactSubtitle}>{item.subtitle}</Text>
            </View>
          </View>
        ))}

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
  banner: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  bannerTitle: {
    fontSize: typography.xl,
    fontFamily: typography.bold,
    color: colors.primary,
    marginTop: 10,
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  helpIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpCardText: { flex: 1 },
  helpCardTitle: {
    fontSize: typography.md,
    fontFamily: typography.semiBold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  helpCardSubtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: typography.md,
    fontFamily: typography.semiBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  contactSubtitle: { fontSize: typography.sm, color: colors.textSecondary },
});

export default HelpSupportScreen;