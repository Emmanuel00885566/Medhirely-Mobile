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
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'WorkerOnboardingGuide'>;
};

const SECTIONS = [
  {
    id: '1',
    title: '1. Introduction',
    icon: 'information-circle-outline',
    content: 'Welcome to MedHirely. This guide is designed for healthcare professionals such as nurses, doctors, pharmacists, laboratory technicians, caregivers, and other licensed personnel who want flexible shift opportunities.\n\nWhat you can do on the platform:\n\n• Create a verified profile\n• Upload your certifications\n• Browse for available healthcare shifts in your area\n• Set availability to see shifts that match your schedule\n• Apply for urgent healthcare jobs\n• Track earnings and withdraw payment to bank',
  },
  {
    id: '2',
    title: '2. Creating an Account',
    icon: 'person-add-outline',
    content: 'Healthcare workers are expected to create a personal account:\n\n• Download the app or visit the website\n• Click on Register\n• Enter your Full name, Email address, Phone number, and password\n• Check your inbox for a verification email and click the verification link\n• You will receive a 6-digit code — input it to verify\n• Create a strong password (at least 8 characters, uppercase letter, number and special character)\n• Click complete registration\n\nNote: If you don\'t see the verification email, check your junk and spam folder.',
  },
  {
    id: '3',
    title: '3. Completing Profile Setup',
    icon: 'create-outline',
    content: 'A complete profile allows healthcare facilities to trust you and helps match you to shifts.\n\nRequired Information:\n\n• Full Legal Name: same as on your ID and professional credentials\n• Professional Title: your primary role (e.g. Registered Nurse)\n• Years of Experience: number of years of clinical experience\n• Healthcare Specialties: your area of focus (e.g. ICU, Pediatrics)\n• Preferred Work Location: cities or areas you are willing to work\n• Available Schedule: days and times you are free',
  },
  {
    id: '4',
    title: '4. Uploading Credentials',
    icon: 'cloud-upload-outline',
    content: 'Before you can apply for shifts, you must upload verification documents. These are reviewed within 24-72 hours.\n\nAccepted Documents:\n• Medical license and nurse certificate\n• Professional certifications\n• Government issued ID\n\nFile Requirements:\n• Accepted formats: PDF, JPEG and PNG\n• Maximum file size: 10MB\n• Documents must be legible\n\nHow to Upload:\n• Go to your profile and click on credentials\n• Select the document type\n• Choose the file from your device\n• Tap submit',
  },
  {
    id: '5',
    title: '5. Verification Status',
    icon: 'shield-checkmark-outline',
    content: 'Workers can check their verification status from the dashboard.\n\n⏳ Pending — Your document has been received and is under review. No action needed. Reviews take 1-3 business days.\n\n✅ Approved — The document has been verified and accepted. You are good to apply for shifts.\n\n❌ Rejected — The document could not be verified. Check the reason and upload a corrected document.',
  },
  {
    id: '6',
    title: '6. Setting Availability',
    icon: 'calendar-outline',
    content: 'Keep your availability up-to-date to receive relevant shift opportunities.\n\nHow to set availability:\n• Go to profile and click availability\n• Select the days of the week you are available\n• For each day, choose your preferred shift (Day, Night, Weekend)\n• Indicate if you are open for emergency shifts\n• Choose preferred work locations\n• Save the changes\n\nNote: Emergency shift means facilities can contact you outside your scheduled days. You are not obligated to accept.',
  },
  {
    id: '7',
    title: '7. Browsing Shifts',
    icon: 'search-outline',
    content: 'Verified workers can access available shifts directly from the dashboard.\n\nSearch and filter options:\n• Location: search by city\n• Date: filter by a specific day\n• Shift type: day, night or weekend\n• Specialty: show shifts for a specific field\n• Pay rate: filter by hourly rate or minimum pay\n\nEach listing shows the facility name, location, shift date and hours, required role and hourly rates.',
  },
  {
    id: '8',
    title: '8. Applying for Shifts',
    icon: 'send-outline',
    content: 'Workers can apply for available shifts directly through the platform.\n\nApplication Process:\n• Open the shift details page and review the details\n• Click Apply Now — your profile and credentials are automatically included\n• Facilities review applications based on experience, ratings and availability\n• You receive notifications when your application is viewed, accepted or rejected\n\nTo withdraw an application, go to Applications and tap Withdraw.',
  },
  {
    id: '9',
    title: '9. Completing a Shift',
    icon: 'checkmark-circle-outline',
    content: 'You\'ll receive automatic reminders:\n• 24 hours before: "You have a shift at [Facility] tomorrow"\n• 2 hours before: "Your shift starts in 2 hours"\n\nChecking in: When you arrive, check in through the app to log your start time.\n\nShift completion: Once your shift ends, go to My Shifts and tap Mark as Complete. This triggers the payment release process.\n\nNote: If you need to cancel, do so early through the app. Late cancellations and no-shows affect your profile and future applications.',
  },
  {
    id: '10',
    title: '10. Payment and Earnings',
    icon: 'cash-outline',
    content: 'The platform uses an escrow system for secure payments.\n\nHow it works:\n• When the facility confirms your shift, payment is held in escrow\n• After you mark the shift complete (and facility confirms), funds are released to your wallet\n• Payment processing takes 1-3 working days\n\nWithdrawing Earnings:\n• Go to Earnings then tap Withdraw\n• Supported methods: bank transfer\n• Bank transfers processed within 2-5 business days\n\nNote: If payment hasn\'t arrived, check that the shift is marked complete and the facility has confirmed hours.',
  },
  {
    id: '11',
    title: '11. Ratings and Reviews',
    icon: 'star-outline',
    content: 'Facilities may rate you after a completed shift. Ratings feed into your overall worker score visible to all facilities.\n\nWorkers may be rated based on:\n• Professionalism\n• Punctuality\n• Communication\n• Quality of care\n\nYou can also leave a rating for the facility. This helps other workers make informed decisions.\n\nNote: Workers with higher ratings are prioritized in facility shortlists and may qualify for premium shifts.',
  },
  {
    id: '12',
    title: '12. Common Issues',
    icon: 'help-circle-outline',
    content: 'My Documents were Rejected: Check for poor image quality, expired documents, or wrong file type. Resubmit a clear, valid document in PDF, JPEG or PNG format.\n\nI Missed a Scheduled Shift: Contact the facility directly to explain. Cancel early through the app if unsure of making it.\n\nMy Payment is Delayed: Confirm the shift is marked complete and the facility has approved your hours. If both are done and payment hasn\'t arrived after 5 business days, contact support.\n\nI Can\'t Find Shifts in my Area: Broaden your location preferences or turn on notifications for new shift alerts.',
  },
];

const WorkerOnboardingGuideScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Worker Guide</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.introBanner}>
          <Ionicons name="person-circle" size={36} color={colors.primary} />
          <Text style={styles.introTitle}>Healthcare Worker Onboarding Guide</Text>
          <Text style={styles.introSubtitle}>
            Everything you need to get started and succeed on MedHirely.
          </Text>
        </View>

        {SECTIONS.map((section) => (
          <View key={section.id} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Ionicons name={section.icon as any} size={20} color={colors.primary} />
              </View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <Text style={styles.sectionContent}>{section.content}</Text>
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
    marginTop: 10,
    marginBottom: 6,
    textAlign: 'center',
  },
  introSubtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
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
    backgroundColor: colors.primaryLight,
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
});

export default WorkerOnboardingGuideScreen;