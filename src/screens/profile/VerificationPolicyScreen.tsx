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
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'VerificationPolicy'>;
};

const SECTIONS = [
  {
    id: '1',
    title: 'Why Verification Matters',
    icon: 'shield-outline',
    content: 'MedHirely is a worker shift marketplace built on trust. A hospital needs to know that the nurse or doctor walking into their ward is qualified. A worker needs to be sure that the facility they are going to is a real registered organization.\n\nOur verification process helps:\n• Protect patient safety\n• Ensure only qualified healthcare professionals are matched to shifts\n• Confirm that facilities are legitimate healthcare providers\n• Maintain trust across the platform',
  },
  {
    id: '2',
    title: 'Who Needs to Verify',
    icon: 'person-outline',
    content: 'Every healthcare worker on the platform must complete verification before they can apply for a single shift. There are no exceptions.\n\nAn unverified worker can:\n• Create a profile\n• Browse available shifts\n\nBut the Apply button remains inactive until credentials have been reviewed and approved.',
  },
  {
    id: '3',
    title: 'Required Documents',
    icon: 'document-text-outline',
    content: '1. Professional Licence or Certificate\nYour primary clinical credentials (nursing registration, medical licence, pharmacy licence etc). Must be currently valid — expired documents will not be accepted.\n\n2. Relevant Certifications\nSpecialist certifications that support your stated specialties. Strengthens your profile and helps facilities trust your experience.\n\n3. Government-issued ID\nA valid national ID card, passport, or driver\'s licence. The name on the ID must match the name on your professional licence exactly.',
  },
  {
    id: '4',
    title: 'File Requirements',
    icon: 'attach-outline',
    content: 'Before uploading, ensure your documents meet these requirements:\n\n• Accepted Formats: PDF, JPG or PNG\n• Maximum File Size: 10MB per document\n• Quality: Documents must be legible — blurry, cropped or obscured submissions will be rejected\n• Validity: All documents must be currently valid. Do not submit documents close to expiry.',
  },
  {
    id: '5',
    title: 'Verification Process',
    icon: 'git-branch-outline',
    content: '1. Submission received — enters the review queue. Status changes to Pending.\n\n2. Admin review — each document is checked for genuineness, validity and match with your profile information.\n\n3. Notification sent:\n• Approved: "Your account has been verified. Start applying for shifts near you."\n• Rejected: "Some documents were rejected. Tap to re-upload and continue verification."',
  },
  {
    id: '6',
    title: 'Verification Statuses',
    icon: 'checkmark-circle-outline',
    content: '⏳ Pending\nYour documents are in the queue and under review. No action needed from you.\n\n✅ Approved\nYour credentials have been verified. Your profile is now active to apply for shifts.\n\n❌ Rejected\nYour document could not be verified. The notification will explain the specific reason.',
  },
  {
    id: '7',
    title: 'Common Reasons for Rejection',
    icon: 'alert-circle-outline',
    content: '• The document is expired or close to expiry\n• The image is too blurry or not clear\n• The wrong document was uploaded\n• The name on the document doesn\'t match your profile name\n• The document appears to have been altered\n• The file format was unsupported\n\nIf your document is rejected, read the reason carefully before resubmitting.',
  },
  {
    id: '8',
    title: 'Fraud Prevention',
    icon: 'lock-closed-outline',
    content: 'MedHirely maintains a zero-tolerance approach to fraudulent activity such as:\n• Submitting fake credentials\n• Altering official documents\n• Impersonating another individual\n\nAccounts found engaging in these activities may be suspended or permanently removed from the platform.',
  },
  {
    id: '9',
    title: 'Data Protection',
    icon: 'eye-off-outline',
    content: 'Verification documents are only accessible to authorized personnel responsible for reviewing and maintaining platform compliance.\n\nThe platform commits to:\n• Reviewing all submissions within stated timelines\n• Providing clear reasons for every rejection\n• Treating all submitted documents with confidentiality\n• Investigating concerns about fraudulent document submissions',
  },
];

const VerificationPolicyScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.introBanner}>
          <Ionicons name="shield-checkmark" size={36} color={colors.success} />
          <Text style={styles.introTitle}>Verification Policy</Text>
          <Text style={styles.introSubtitle}>
            How we ensure trust and safety across the platform for workers and facilities.
          </Text>
        </View>

        {SECTIONS.map((section) => (
          <View key={section.id} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Ionicons name={section.icon as any} size={20} color={colors.success} />
              </View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <View style={styles.noteCard}>
          <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
          <Text style={styles.noteText}>
            If you have questions about your verification status, visit the Help page in the app or contact the support team directly.
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
    backgroundColor: colors.secondaryLight,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.success,
  },
  introTitle: {
    fontSize: typography.lg,
    fontFamily: typography.bold,
    color: colors.success,
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
    backgroundColor: colors.secondaryLight,
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
    backgroundColor: colors.primaryLight,
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

export default VerificationPolicyScreen;