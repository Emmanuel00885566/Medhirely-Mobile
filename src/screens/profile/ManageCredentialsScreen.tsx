import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView, 
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp,  } from '@react-navigation/native-stack';
import * as DocumentPicker from 'expo-document-picker';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { ProfileStackParamList } from '../../navigation/ProfileStack';
import { workerService } from '../../services/workerService';
import { useFocusEffect } from '@react-navigation/native';


type Props = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'ManageCredentials'>;
};

type Document = {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  status: 'approved' | 'pending' | 'rejected' | 'not_uploaded';
  uploadedAt: string | null;
  rejectionReason?: string;
  required: boolean;
  certKey: string;
};

const ManageCredentialsScreen = ({ navigation }: Props) => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'id',
      title: 'Government Issued ID',
      subtitle: '(e.g. National ID, Passport)',
      icon: 'card-outline',
      status: 'not_uploaded',
      uploadedAt: null,
      required: true,
      certKey: 'Government Issued ID',
    },
    {
      id: 'license',
      title: 'Professional License',
      subtitle: '(e.g. Nursing License)',
      icon: 'ribbon-outline',
      status: 'not_uploaded',
      uploadedAt: null,
      required: true,
      certKey: 'Professional License',
    },
    {
      id: 'certificate',
      title: 'Certificate',
      subtitle: '(e.g. BLS, ACLS, etc)',
      icon: 'document-text-outline',
      status: 'not_uploaded',
      uploadedAt: null,
      required: true,
      certKey: 'Certificate',
    },
    {
      id: 'proof',
      title: 'Proof of Address',
      subtitle: '(Utility Bill, Bank Statement)',
      icon: 'home-outline',
      status: 'not_uploaded',
      uploadedAt: null,
      required: true,
      certKey: 'Proof of Address',
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [pickedFile, setPickedFile] = useState<{
    uri: string;
    name: string;
    mimeType: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useFocusEffect(
  useCallback(() => {
    const loadCertifications = async () => {
      try {
        const profile = await workerService.getProfile();
        const certs = profile?.certifications || [];
        const verificationStatus = profile?.verificationStatus || 'Pending';
        const rejectionReason = profile?.rejectionReason || '';

        console.log('Certifications:', JSON.stringify(certs, null, 2));
        console.log('Verification status:', verificationStatus);

        if (certs.length > 0) {
          setDocuments((prev) =>
            prev.map((doc, index) => {
              const matchingCert = certs[index];
              if (matchingCert) {
                const status =
                  verificationStatus === 'Approved'
                    ? 'approved'
                    : verificationStatus === 'Rejected'
                    ? 'rejected'
                    : 'pending';

                return {
                  ...doc,
                  status: status as any,
                  rejectionReason:
                    verificationStatus === 'Rejected' ? rejectionReason : undefined,
                  uploadedAt: new Date(
                    parseInt(matchingCert._id.substring(0, 8), 16) * 1000
                  ).toISOString().split('T')[0],
                };
              }
              return doc;
            })
          );
        }
      } catch (error) {
        console.log('Error loading certifications:', error);
      }
    };
    loadCertifications();
  }, [])
);


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

  const handleOpenUploadModal = (doc: Document) => {
    setSelectedDoc(doc);
    setPickedFile(null);
    setModalVisible(true);
  };

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      setPickedFile({
        uri: asset.uri,
        name: asset.name,
        mimeType: asset.mimeType || 'application/pdf',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file. Please try again.');
    }
  };

  const handleSubmitDocument = async () => {
    if (!pickedFile) {
      Alert.alert('Error', 'Please select a file to upload');
      return;
    }
    
    if (!selectedDoc) return;

    setIsSubmitting(true);
    try {
      await workerService.uploadCredentials([
        {
          uri: pickedFile.uri,
          fileName: pickedFile.name,
          mimeType: pickedFile.mimeType,
        },
      ]);

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === selectedDoc.id
            ? {
                ...doc,
                status: 'pending',
                rejectionReason: undefined,
                uploadedAt: new Date().toISOString().split('T')[0],
              }
            : doc
        )
      );

      setModalVisible(false);
      Alert.alert('Submitted! ✅', 'Your document has been submitted for admin review.');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to submit document.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const approvedCount = documents.filter(
    (d) => d.status === 'approved' || d.status === 'pending'
  ).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
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
              {approvedCount} of {documents.length} documents submitted
            </Text>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${(approvedCount / documents.length) * 100}%` },
                ]}
              />
            </View>
          </View>
          <View style={styles.summaryCircle}>
            <Text style={styles.summaryCircleText}>
              {approvedCount}/{documents.length}
            </Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
          <Text style={styles.infoText}>
            Upload your documents directly from your phone. Supported formats: PDF, JPG, PNG.
          </Text>
        </View>

        {/* Documents */}
        <Text style={styles.sectionTitle}>Documents</Text>
        {documents.map((doc) => {
          const config = getStatusConfig(doc.status);
          return (
            <View key={doc.id} style={styles.documentCard}>
              <View style={styles.documentHeader}>
                <View style={[styles.documentIconContainer, { backgroundColor: config.bg }]}>
                  <Ionicons
                    name={
                      doc.status === 'approved' || doc.status === 'pending'
                        ? 'checkmark'
                        : doc.icon
                    }
                    size={22}
                    color={config.color}
                  />
                </View>
                <View style={styles.documentInfo}>
                  <View style={styles.documentTitleRow}>
                    <Text style={styles.documentTitle}>{doc.title}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                      <Text style={[styles.statusText, { color: config.color }]}>
                        {config.label}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.documentSubtitle}>{doc.subtitle}</Text>
                  {doc.uploadedAt && (
                    <Text style={styles.uploadedDate}>Submitted: {doc.uploadedAt}</Text>
                  )}
                </View>
              </View>

              {doc.status === 'rejected' && doc.rejectionReason && (
                <View style={styles.rejectionCard}>
                  <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
                  <Text style={styles.rejectionText}>{doc.rejectionReason}</Text>
                </View>
              )}

              {(doc.status === 'rejected' || doc.status === 'not_uploaded') && (
                <TouchableOpacity
                  style={[
                    styles.uploadButton,
                    doc.status === 'rejected' && styles.reuploadButton,
                  ]}
                  onPress={() => handleOpenUploadModal(doc)}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name="cloud-upload-outline"
                    size={16}
                    color={doc.status === 'rejected' ? colors.white : colors.primary}
                  />
                  <Text
                    style={[
                      styles.uploadButtonText,
                      doc.status === 'rejected' && styles.reuploadButtonText,
                    ]}
                  >
                    {doc.status === 'rejected' ? 'Re-upload Document' : 'Upload Document'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>

 {/* Upload Modal */}
<Modal
  visible={modalVisible}
  transparent
  animationType="slide"
  onRequestClose={() => setModalVisible(false)}
>
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.modalOverlay}
  >
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Upload {selectedDoc?.title}</Text>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.modalSubtitle}>{selectedDoc?.subtitle}</Text>

        {/* File Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Document File</Text>
          <TouchableOpacity style={styles.filePicker} onPress={handlePickFile}>
            <Ionicons
              name={pickedFile ? 'document' : 'cloud-upload-outline'}
              size={22}
              color={pickedFile ? colors.primary : colors.textMuted}
            />
            <Text
              style={[
                styles.filePickerText,
                pickedFile && styles.filePickerTextSelected,
              ]}
              numberOfLines={1}
            >
              {pickedFile ? pickedFile.name : 'Tap to select a file'}
            </Text>
            {pickedFile && (
              <TouchableOpacity onPress={() => setPickedFile(null)}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
          <Text style={styles.inputHint}>Supported formats: PDF, JPG, PNG</Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmitDocument}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.submitButtonText}>Submit Document</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
</Modal>
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
    paddingBottom: 50,
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
    marginRight: 16,
  },
  summaryTitle: {
    fontSize: typography.lg,
    fontFamily: typography.bold,
    color: colors.white,
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 3,
  },
  summaryCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  summaryCircleText: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.white,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: typography.md,
    fontFamily: typography.bold,
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
    alignItems: 'flex-start',
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
  documentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  documentTitle: {
    fontSize: typography.md,
    fontFamily: typography.semiBold,
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: typography.xs,
    fontFamily: typography.bold,
  },
  documentSubtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  uploadedDate: {
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
  reuploadButton: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  uploadButtonText: {
    fontSize: typography.sm,
    fontFamily: typography.bold,
    color: colors.primary,
  },
  reuploadButtonText: {
    color: colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: typography.lg,
    fontFamily: typography.bold,
    color: colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: typography.sm,
    fontFamily: typography.medium,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 52,
    fontSize: typography.md,
    color: colors.textPrimary,
  },
  filePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    paddingHorizontal: 14,
    height: 56,
  },
  filePickerText: {
    flex: 1,
    fontSize: typography.sm,
    color: colors.textMuted,
  },
  filePickerTextSelected: {
    color: colors.textPrimary,
    fontFamily: typography.medium,
  },
  inputHint: {
    fontSize: typography.xs,
    color: colors.textMuted,
    marginTop: 6,
    lineHeight: 16,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.white,
  },
  cancelButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: typography.md,
    color: colors.textSecondary,
    fontFamily: typography.medium,
  },
});

export default ManageCredentialsScreen;