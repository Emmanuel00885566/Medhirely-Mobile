import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
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
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  uploaded: boolean;
  required: boolean;
};

const UploadCredentialsScreen = ({ navigation }: Props) => {
  const { user, logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'id',
      title: 'Government Issued ID',
      subtitle: '(e.g. National ID, Passport)',
      icon: 'card-outline',
      uploaded: false,
      required: true,
    },
    {
      id: 'license',
      title: 'Professional License',
      subtitle: '(e.g. Nursing License)',
      icon: 'ribbon-outline',
      uploaded: false,
      required: true,
    },
    {
      id: 'certificate',
      title: 'Certificate',
      subtitle: '(e.g. BLS, ACLS, etc)',
      icon: 'document-text-outline',
      uploaded: false,
      required: true,
    },
    {
      id: 'proof',
      title: 'Proof of Address',
      subtitle: '(Utility Bill, Bank Statement)',
      icon: 'home-outline',
      uploaded: false,
      required: true,
    },
  ]);

  const handleUpload = (docId: string) => {
    Alert.alert(
      'Upload Document',
      'In the real app this will open your file picker.',
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

  const handleSubmit = async () => {
    const allUploaded = documents.every((d) => d.uploaded);
    if (!allUploaded) {
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

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Verify Your Documents</Text>
            <TouchableOpacity onPress={logout}>
              <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>
            Please upload clear images of the required documents
          </Text>

          {/* Illustration */}
          <Image
            source={require('../../assets/verify_docs.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Document List */}
        <View style={styles.documentList}>
          {documents.map((doc) => (
            <View key={doc.id} style={styles.documentItem}>
              <View style={styles.documentLeft}>
                <View style={[
                  styles.documentIconContainer,
                  { backgroundColor: doc.uploaded ? colors.secondaryLight : colors.primaryLight }
                ]}>
                  <Ionicons
                    name={doc.uploaded ? 'checkmark' : doc.icon}
                    size={22}
                    color={doc.uploaded ? colors.success : colors.primary}
                  />
                </View>
                <View style={styles.documentInfo}>
                  <Text style={styles.documentTitle}>{doc.title}</Text>
                  <Text style={styles.documentSubtitle}>{doc.subtitle}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.uploadButton,
                  doc.uploaded && styles.uploadButtonDone,
                ]}
                onPress={() => !doc.uploaded && handleUpload(doc.id)}
              >
                <Ionicons
                  name={doc.uploaded ? 'checkmark' : 'cloud-upload-outline'}
                  size={20}
                  color={doc.uploaded ? colors.success : colors.white}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Accepted Formats */}
        <View style={styles.formatsCard}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={colors.textSecondary}
          />
          <Text style={styles.formatsText}>
            Accepted formats: JPG, PNG, PDF{'\n'}Max file size: 5MB per file
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.submitButtonText}>Submit for Verification</Text>
          )}
        </TouchableOpacity>

        {/* Help Link */}
        <TouchableOpacity style={styles.helpLink}>
          <Text style={styles.helpLinkText}>Need help? View guidelines</Text>
        </TouchableOpacity>

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
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: typography.xxl,
    fontFamily: typography.bold,
    color: colors.primary,
  },
  logoutText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontFamily: typography.medium,
  },
  headerSubtitle: {
    fontSize: typography.md,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  illustration: {
    width: '100%',
    height: 160,
    alignSelf: 'center',
  },
  documentList: {
    gap: 12,
    marginBottom: 16,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  documentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  documentIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: typography.md,
    fontFamily: typography.semiBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  documentSubtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontFamily: typography.medium,
  },
  uploadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtonDone: {
    backgroundColor: colors.secondaryLight,
  },
  formatsCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  formatsText: {
    flex: 1,
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  submitButton: {
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
  submitButtonText: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.white,
    letterSpacing: 0.5,
  },
  helpLink: {
    alignItems: 'center',
  },
  helpLinkText: {
    fontSize: typography.md,
    fontFamily: typography.medium,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});

export default UploadCredentialsScreen;