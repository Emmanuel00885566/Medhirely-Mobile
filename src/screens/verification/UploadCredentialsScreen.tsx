import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { VerificationStackParamList } from '../../navigation/VerificationStack';
import { useAuth } from '../../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<VerificationStackParamList, 'UploadCredentials'>;
};

type Document = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  uploaded: boolean;
  required: boolean;
};

const UploadCredentialsScreen = ({ navigation }: Props) => {
  const { user, logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'license',
      title: 'Professional License',
      description: 'Upload your valid nursing/medical license',
      icon: 'ribbon-outline',
      uploaded: false,
      required: true,
    },
    {
      id: 'certificate',
      title: 'Certifications',
      description: 'Upload relevant certifications (BLS, ACLS, etc.)',
      icon: 'document-text-outline',
      uploaded: false,
      required: true,
    },
    {
      id: 'id',
      title: 'Government Issued ID',
      description: 'Upload a valid national ID, passport or driver license',
      icon: 'card-outline',
      uploaded: false,
      required: true,
    },
    {
      id: 'cv',
      title: 'CV / Resume',
      description: 'Upload your most recent CV or resume',
      icon: 'briefcase-outline',
      uploaded: false,
      required: false,
    },
  ]);

  const handleUpload = (docId: string) => {
    // Simulate file upload
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
                doc.id === docId ? { ...doc, uploaded: true } : doc
              )
            );
          },
        },
      ]
    );
  };

  const handleRemove = (docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId ? { ...doc, uploaded: false } : doc
      )
    );
  };

  const handleSubmit = async () => {
    const requiredDocs = documents.filter((d) => d.required);
    const allRequiredUploaded = requiredDocs.every((d) => d.uploaded);

    if (!allRequiredUploaded) {
      Alert.alert(
        'Missing Documents',
        'Please upload all required documents before submitting.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 1500));
      navigation.replace('PendingVerification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadedCount = documents.filter((d) => d.uploaded).length;
  const requiredCount = documents.filter((d) => d.required).length;
  const requiredUploadedCount = documents.filter(
    (d) => d.required && d.uploaded
  ).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0]} 👋</Text>
          <Text style={styles.headerTitle}>Upload Credentials</Text>
          <Text style={styles.headerSubtitle}>
            Upload your documents to get verified
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={22} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Upload Progress</Text>
            <Text style={styles.progressCount}>
              {requiredUploadedCount}/{requiredCount} required
            </Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${(requiredUploadedCount / requiredCount) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressNote}>
            All required documents must be uploaded before submission
          </Text>
        </View>

        {/* Info card */}
        <View style={styles.infoCard}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.infoText}>
            Your documents are reviewed manually by our admin team within 24-48
            hours. You will be notified once verified.
          </Text>
        </View>

        {/* Document list */}
        <Text style={styles.sectionTitle}>Required Documents</Text>
        {documents
          .filter((d) => d.required)
          .map((doc) => (
            <View key={doc.id} style={styles.documentCard}>
              <View
                style={[
                  styles.documentIconContainer,
                  doc.uploaded && styles.documentIconUploaded,
                ]}
              >
                <Ionicons
                  name={doc.uploaded ? 'checkmark' : doc.icon}
                  size={24}
                  color={doc.uploaded ? colors.white : colors.primary}
                />
              </View>
              <View style={styles.documentInfo}>
                <View style={styles.documentTitleRow}>
                  <Text style={styles.documentTitle}>{doc.title}</Text>
                  <View
                    style={[
                      styles.requiredBadge,
                      doc.uploaded && styles.uploadedBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.requiredBadgeText,
                        doc.uploaded && styles.uploadedBadgeText,
                      ]}
                    >
                      {doc.uploaded ? 'Uploaded' : 'Required'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.documentDescription}>
                  {doc.description}
                </Text>
                <View style={styles.documentActions}>
                  {!doc.uploaded ? (
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={() => handleUpload(doc.id)}
                    >
                      <Ionicons
                        name="cloud-upload-outline"
                        size={16}
                        color={colors.primary}
                      />
                      <Text style={styles.uploadButtonText}>Upload</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemove(doc.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={16}
                        color={colors.error}
                      />
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))}

        <Text style={styles.sectionTitle}>Optional Documents</Text>
        {documents
          .filter((d) => !d.required)
          .map((doc) => (
            <View key={doc.id} style={styles.documentCard}>
              <View
                style={[
                  styles.documentIconContainer,
                  doc.uploaded && styles.documentIconUploaded,
                ]}
              >
                <Ionicons
                  name={doc.uploaded ? 'checkmark' : doc.icon}
                  size={24}
                  color={doc.uploaded ? colors.white : colors.primary}
                />
              </View>
              <View style={styles.documentInfo}>
                <View style={styles.documentTitleRow}>
                  <Text style={styles.documentTitle}>{doc.title}</Text>
                  <View
                    style={[
                      styles.optionalBadge,
                      doc.uploaded && styles.uploadedBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionalBadgeText,
                        doc.uploaded && styles.uploadedBadgeText,
                      ]}
                    >
                      {doc.uploaded ? 'Uploaded' : 'Optional'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.documentDescription}>
                  {doc.description}
                </Text>
                <View style={styles.documentActions}>
                  {!doc.uploaded ? (
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={() => handleUpload(doc.id)}
                    >
                      <Ionicons
                        name="cloud-upload-outline"
                        size={16}
                        color={colors.primary}
                      />
                      <Text style={styles.uploadButtonText}>Upload</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemove(doc.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={16}
                        color={colors.error}
                      />
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))}
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (isSubmitting || requiredUploadedCount < requiredCount) &&
              styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting || requiredUploadedCount < requiredCount}
          activeOpacity={0.85}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Submit for Verification</Text>
              <Ionicons name="arrow-forward" size={18} color={colors.white} />
            </>
          )}
        </TouchableOpacity>
      </View>
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
    paddingBottom: 28,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  greeting: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: typography.xxl,
    fontWeight: typography.bold,
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  progressCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: typography.md,
    fontWeight: typography.semiBold,
    color: colors.textPrimary,
  },
  progressCount: {
    fontSize: typography.sm,
    fontWeight: typography.bold,
    color: colors.primary,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressNote: {
    fontSize: typography.xs,
    color: colors.textSecondary,
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
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  documentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentIconUploaded: {
    backgroundColor: colors.success,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  documentTitle: {
    fontSize: typography.md,
    fontWeight: typography.semiBold,
    color: colors.textPrimary,
    flex: 1,
  },
  requiredBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  requiredBadgeText: {
    fontSize: typography.xs,
    color: colors.warning,
    fontWeight: typography.medium,
  },
  optionalBadge: {
    backgroundColor: colors.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  optionalBadgeText: {
    fontSize: typography.xs,
    color: colors.textMuted,
    fontWeight: typography.medium,
  },
  uploadedBadge: {
    backgroundColor: colors.secondaryLight,
  },
  uploadedBadgeText: {
    color: colors.success,
  },
  documentDescription: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: 10,
    lineHeight: 18,
  },
  documentActions: {
    flexDirection: 'row',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  uploadButtonText: {
    fontSize: typography.sm,
    color: colors.primary,
    fontWeight: typography.medium,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeButtonText: {
    fontSize: typography.sm,
    color: colors.error,
    fontWeight: typography.medium,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.white,
    letterSpacing: 0.5,
  },
});

export default UploadCredentialsScreen;