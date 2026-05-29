import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { ProfileStackParamList } from '../../navigation/ProfileStack';

type Props = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'ManageCredentials'>;
};

type Document = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  status: 'approved' | 'pending' | 'rejected' | 'not_uploaded';
  uploadedAt: string | null;
  rejectionReason?: string;
  required: boolean;
};

const ManageCredentialsScreen = ({ navigation }: Props) => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'license',
      title: 'Professional License',
      description: 'Your valid nursing/medical license',
      icon: 'ribbon-outline',
      status: 'approved',
      uploadedAt: '2025-06-01',
      required: true,
    },
    {
      id: 'certificate',
      title: 'Certifications',
      description: 'BLS, ACLS, and other certifications',
      icon: 'document-text-outline',
      status: 'approved',
      uploadedAt: '2025-06-01',
      required: true,
    },
    {
      id: 'id',
      title: 'Government Issued ID',
      description: 'National ID, Passport or Driver License',
      icon: 'card-outline',
      status: 'rejected',
      uploadedAt: '2025-06-01',
      rejectionReason: 'Document image is blurry. Please upload a clearer photo.',
      required: true,
    },
    {
      id: 'cv',
      title: 'CV / Resume',
      description: 'Your most recent CV or resume',
      icon: 'briefcase-outline',
      status: 'not_uploaded',
      uploadedAt: null,
      required: false,
    },
  ]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          color: colors.success,
          bg: colors.secondaryLight,
          icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
          label: 'Approved',
        };
      case 'pending':
        return {
          color: colors.warning,
          bg: '#FFF3E0',
          icon: 'time' as keyof typeof Ionicons.glyphMap,
          label: 'Pending',
        };
      case 'rejected':
        return {
          color: colors.error,
          bg: '#FFF0F0',
          icon: 'close-circle' as keyof typeof Ionicons.glyphMap,
          label: 'Rejected',
        };
      default:
        return {
          color: colors.textMuted,
          bg: colors.borderLight,
          icon: 'cloud-upload-outline' as keyof typeof Ionicons.glyphMap,
          label: 'Not Uploaded',
        };
    }
  };

  const handleReupload = (docId: string) => {
    Alert.alert(
      'Re-upload Document',
      'In the real app this will open your file picker. For now we are simulating the upload.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Simulate Upload',
          onPress: () => {
            setDocuments((prev) =>
              prev.map((doc) =>
                doc.id === docId
                  ? { ...doc, status: 'pending', rejectionReason: undefined }
                  : doc
              )
            );
            Alert.alert('Uploaded!', 'Document re-uploaded successfully. Awaiting admin review.');
          },
        },
      ]
    );
  };

  const handleUpload = (docId: string) => {
    Alert.alert(
      'Upload Document',
      'In the real app this will open your file picker. For now we are simulating the upload.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Simulate Upload',
          onPress: () => {
            setDocuments((prev) =>
              prev.map((doc) =>
                doc.id === docId
                  ? {
                      ...doc,
                      status: 'pending',
                      uploadedAt: new Date().toISOString().split('T')[0],
                    }
                  : doc
              )
            );
            Alert.alert('Uploaded!', 'Document uploaded successfully. Awaiting admin review.');
          },
        },
      ]
    );
  };

  const approvedCount = documents.filter((d) => d.status === 'approved').length;
  const totalCount = documents.length;

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
        <Text style={styles.headerTitle}>My Credentials</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryTitle}>Document Status</Text>
            <Text style={styles.summarySubtitle}>
              {approvedCount} of {totalCount} documents approved
            </Text>
          </View>
          <View style={styles.summaryCircle}>
            <Text style={styles.summaryCircleText}>
              {approvedCount}/{totalCount}
            </Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={colors.primary}
          />
          <Text style={styles.infoText}>
            Keep your documents up to date to maintain your verified status and
            access to shifts.
          </Text>
        </View>

        {/* Required Documents */}
        <Text style={styles.sectionTitle}>Required Documents</Text>
        {documents
          .filter((d) => d.required)
          .map((doc) => {
            const config = getStatusConfig(doc.status);
            return (
              <View key={doc.id} style={styles.documentCard}>
                <View style={styles.documentHeader}>
                  <View style={[styles.documentIconContainer, { backgroundColor: config.bg }]}>
                    <Ionicons name={doc.icon} size={24} color={config.color} />
                  </View>
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentTitle}>{doc.title}</Text>
                    <Text style={styles.documentDescription}>
                      {doc.description}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                    <Ionicons name={config.icon} size={12} color={config.color} />
                    <Text style={[styles.statusText, { color: config.color }]}>
                      {config.label}
                    </Text>
                  </View>
                </View>

                {/* Upload date */}
                {doc.uploadedAt && (
                  <View style={styles.uploadedRow}>
                    <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
                    <Text style={styles.uploadedText}>
                      Uploaded: {doc.uploadedAt}
                    </Text>
                  </View>
                )}

                {/* Rejection reason */}
                {doc.status === 'rejected' && doc.rejectionReason && (
                  <View style={styles.rejectionCard}>
                    <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
                    <Text style={styles.rejectionText}>{doc.rejectionReason}</Text>
                  </View>
                )}

                {/* Actions */}
                {doc.status === 'rejected' && (
                  <TouchableOpacity
                    style={styles.reuploadButton}
                    onPress={() => handleReupload(doc.id)}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="cloud-upload-outline" size={16} color={colors.white} />
                    <Text style={styles.reuploadButtonText}>Re-upload Document</Text>
                  </TouchableOpacity>
                )}

                {doc.status === 'not_uploaded' && (
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={() => handleUpload(doc.id)}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="cloud-upload-outline" size={16} color={colors.primary} />
                    <Text style={styles.uploadButtonText}>Upload Document</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

        {/* Optional Documents */}
        <Text style={styles.sectionTitle}>Optional Documents</Text>
        {documents
          .filter((d) => !d.required)
          .map((doc) => {
            const config = getStatusConfig(doc.status);
            return (
              <View key={doc.id} style={styles.documentCard}>
                <View style={styles.documentHeader}>
                  <View style={[styles.documentIconContainer, { backgroundColor: config.bg }]}>
                    <Ionicons name={doc.icon} size={24} color={config.color} />
                  </View>
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentTitle}>{doc.title}</Text>
                    <Text style={styles.documentDescription}>
                      {doc.description}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                    <Ionicons name={config.icon} size={12} color={config.color} />
                    <Text style={[styles.statusText, { color: config.color }]}>
                      {config.label}
                    </Text>
                  </View>
                </View>

                {doc.status === 'not_uploaded' && (
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={() => handleUpload(doc.id)}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="cloud-upload-outline" size={16} color={colors.primary} />
                    <Text style={styles.uploadButtonText}>Upload Document</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

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
  summaryCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLeft: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.white,
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  summaryCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  summaryCircleText: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.white,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    gap: 10,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  documentCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  documentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: typography.md,
    fontWeight: typography.semiBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  documentDescription: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: typography.xs,
    fontWeight: typography.bold,
  },
  uploadedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  uploadedText: {
    fontSize: typography.xs,
    color: colors.textMuted,
  },
  rejectionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFF0F0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  rejectionText: {
    flex: 1,
    fontSize: typography.sm,
    color: colors.error,
    lineHeight: 18,
  },
  reuploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.error,
    borderRadius: 10,
    height: 44,
  },
  reuploadButtonText: {
    fontSize: typography.sm,
    fontWeight: typography.bold,
    color: colors.white,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
    height: 44,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  uploadButtonText: {
    fontSize: typography.sm,
    fontWeight: typography.bold,
    color: colors.primary,
  },
});

export default ManageCredentialsScreen;