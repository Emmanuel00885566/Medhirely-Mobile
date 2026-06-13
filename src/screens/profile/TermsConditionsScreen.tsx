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
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'TermsConditions'>;
};

const SECTIONS = [
  {
    id: '1',
    title: '1. Introduction',
    content:
      'Welcome to MedHirely, a healthcare worker shift marketplace. These terms and conditions govern the use of the platform and its services.\n\nBy using the platform, you agree to comply with these terms. If you do not agree with these terms, you should not use the platform.',
  },
  {
    id: '2',
    title: '2. Eligibility',
    content:
      'To use this platform, you must:\n\n• Provide accurate and complete registration information.\n• Have the legal authority to enter into these Terms.\n• Hold valid professional credentials required for your role.',
  },
  {
    id: '3',
    title: '3. User Accounts',
    content:
      'Users will agree to:\n\n• Users are responsible for keeping their login credentials secure.\n• Users must notify the platform immediately if their account is compromised.\n• Providing false or misleading information is grounds for immediate suspension.\n• One account per user.',
  },
  {
    id: '4',
    title: '4. Verification Requirements',
    content:
      'Healthcare workers are required to submit professional licenses, certifications, and identification documents for verification.\n\nUsers must ensure that all submitted information is accurate, current and authentic.\n\nFacilities must submit valid registration and licensing documents.',
  },
  {
    id: '5',
    title: '5. Shift Posting & Application',
    content:
      'Facilities may post available shifts through the Platform.\n\nHealthcare workers may apply for shifts that match their qualifications and availability.\n\nOnce a worker accepts a shift and is selected by the facility, both parties are expected to honour their commitments.\n\nRepeated cancellations, no-shows, or failure to fulfil agreed obligations may result in account restrictions.',
  },
  {
    id: '6',
    title: '6. Payments and Platform Fees',
    content:
      'The Platform operates an escrow-based payment system.\n\nFacilities are required to fund approved shifts before work begins.\n\nUpon successful completion and confirmation of a shift:\n\n• The Platform deducts a 10% service fee from the shift payment.\n• The remaining 90% is released to the healthcare worker.',
  },
  {
    id: '7',
    title: '7. Withdrawals',
    content:
      'Workers may request withdrawals of available earnings at any time, including weekends and public holidays.\n\nProcessing times may vary depending on the selected payment provider.',
  },
  {
    id: '8',
    title: '8. Disputes and Refunds',
    content:
      'Where a dispute is raised, the Platform will temporarily withhold payment while an investigation is conducted.\n\nRefunds are not automatic. All refund requests are reviewed based on available evidence, including attendance records, communication history, and supporting documentation.\n\nThe Platform\'s decision following a dispute review shall be considered final for the purposes of the project.',
  },
  {
    id: '9',
    title: '9. Ratings and Reviews',
    content:
      'Facilities and healthcare workers may provide ratings and reviews following completed shifts.\n\nReviews must be fair, accurate, and based on genuine experiences.\n\nThe Platform reserves the right to remove reviews that are abusive, misleading, discriminatory, or otherwise inappropriate.',
  },
  {
    id: '10',
    title: '10. Prohibited Conduct',
    content:
      'Users must not:\n\n• Submit false or misleading information.\n• Upload fraudulent credentials or documents.\n• Impersonate another individual or organization.\n• Attempt to interfere with the Platform\'s operation or security.\n• Use the Platform for unlawful purposes.\n• Abuse the dispute process through false claims or fabricated evidence.\n\nViolations may result in suspension or permanent removal from the Platform.',
  },
  {
    id: '11',
    title: '11. Limitation of Liability',
    content:
      'MedHirely facilitates connections between healthcare facilities and healthcare professionals.\n\nWhile reasonable measures are taken to promote trust and safety, the Platform does not guarantee the performance, conduct, availability, or suitability of any user.\n\nUsers remain responsible for their professional decisions and interactions.',
  },
  {
    id: '12',
    title: '12. Changes to These Terms',
    content:
      'The Platform may update these Terms from time to time to reflect operational, regulatory, or service changes.\n\nWhere significant changes are made, users will be notified through appropriate communication channels.\n\nContinued use of the Platform after such updates constitutes acceptance of the revised Terms.',
  },
  {
    id: '13',
    title: '13. Contact and Support',
    content:
      'Questions regarding these Terms may be directed to the Platform\'s support team through the contact channels provided within the application.',
  },
];

const TermsConditionsScreen = ({ navigation }: Props) => {
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
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Intro Banner */}
        <View style={styles.introBanner}>
          <Ionicons name="document-text" size={32} color={colors.primary} />
          <Text style={styles.introTitle}>MedHirely Terms & Conditions</Text>
          <Text style={styles.introSubtitle}>
            Please read these terms carefully before using the platform.
          </Text>
          <Text style={styles.lastUpdated}>Last updated: June 2026</Text>
        </View>

        {/* Sections */}
        {SECTIONS.map((section) => (
          <View key={section.id} style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Ionicons name="shield-checkmark" size={20} color={colors.success} />
          <Text style={styles.footerText}>
            By using MedHirely, you confirm that you have read and agreed to these Terms & Conditions.
          </Text>
        </View>

        <View style={{ height: 120 }} />
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
    fontSize: typography.lg,
    fontFamily: typography.bold,
    color: colors.textPrimary,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  introBanner: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  introTitle: {
    fontSize: typography.lg,
    fontFamily: typography.bold,
    color: colors.primary,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  introSubtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: typography.xs,
    color: colors.textMuted,
    fontFamily: typography.medium,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.secondaryLight,
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  footerText: {
    flex: 1,
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default TermsConditionsScreen;