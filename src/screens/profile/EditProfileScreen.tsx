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
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { useAuth } from '../../context/AuthContext';
import { ProfileStackParamList } from '../../navigation/ProfileStack';
import { workerService } from '../../services/workerService';
import * as ImagePicker from 'expo-image-picker';

type Props = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'EditProfile'>;
};

const SPECIALTIES = [
  'Registered Nurse',
  'Emergency Medicine',
  'Pharmacy',
  'Critical Care',
  'Pediatrics',
  'Surgery',
  'Radiology',
  'Anesthesiology',
  'Other',
];

const EditProfileScreen = ({ navigation }: Props) => {
  const { user, updateUser } = useAuth();
  const [firstName] = useState(user?.firstName || '');
  const [lastName] = useState(user?.lastName || '');
  const [email] = useState(user?.email || '');
  const [phone] = useState(user?.phoneNumber || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [specialty, setSpecialty] = useState(user?.specialty || '');
  const [customSpecialty, setCustomSpecialty] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState(
    user?.experienceYears?.toString() || ''
  );
  const [preferredLocation, setPreferredLocation] = useState(user?.address || '');
  const [showSpecialtyPicker, setShowSpecialtyPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const isOtherSpecialty = specialty === 'Other';

  const handleSelectSpecialty = (item: string) => {
    setSpecialty(item);
    if (item !== 'Other') setCustomSpecialty('');
    setShowSpecialtyPicker(false);
  };

  const handleSave = async () => {
    if (!firstName || !lastName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const finalSpecialty = isOtherSpecialty ? customSpecialty.trim() : specialty;
    if (!finalSpecialty) {
      Alert.alert('Error', 'Please enter your specialty');
      return;
    }

    setIsLoading(true);
    try {
      await workerService.updateProfile({
        bio,
        address: preferredLocation,
        experienceYears: yearsOfExperience,
      });

      const updatedProfile = await workerService.getProfile();
      updateUser(updatedProfile);

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to update profile. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (result.canceled) return;

      setUploadingAvatar(true);
      const image = result.assets[0];

      await workerService.uploadAvatar({
        uri: image.uri,
        fileName: 'profile.jpg',
        mimeType: image.mimeType || 'image/jpeg',
      });

      const updatedProfile = await workerService.getProfile();
console.log('Profile after upload:', JSON.stringify(updatedProfile, null, 2));
updateUser(updatedProfile);

      Alert.alert('Success', 'Profile photo updated successfully');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to upload photo'
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {user?.profilePicture ? (
              <Image source={{ uri: user.profilePicture }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>
                {firstName?.charAt(0).toUpperCase()}
              </Text>
            )}
            <TouchableOpacity
              style={styles.avatarEditButton}
              onPress={handleAvatarUpload}
              disabled={uploadingAvatar}
            >
              {uploadingAvatar ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Ionicons name="camera" size={14} color={colors.white} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Personal Info */}
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={firstName}
              editable={false}
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={lastName}
              editable={false}
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={email}
              editable={false}
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={phone}
              editable={false}
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell facilities about yourself..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Professional Info */}
        <Text style={styles.sectionTitle}>Professional Information</Text>
        <View style={styles.formCard}>

          {/* Specialty Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Specialty</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowSpecialtyPicker((prev) => !prev)}
            >
              <Text style={styles.pickerButtonText}>
                {isOtherSpecialty ? 'Other' : specialty || 'Select specialty'}
              </Text>
              <Ionicons
                name={showSpecialtyPicker ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            {showSpecialtyPicker && (
              <View style={styles.pickerDropdown}>
                {SPECIALTIES.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.pickerItem,
                      specialty === item && styles.pickerItemActive,
                    ]}
                    onPress={() => handleSelectSpecialty(item)}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        specialty === item && styles.pickerItemTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                    {specialty === item && (
                      <Ionicons name="checkmark" size={16} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Custom specialty input when Other is selected */}
            {isOtherSpecialty && (
              <TextInput
                style={[styles.input, { marginTop: 10 }]}
                value={customSpecialty}
                onChangeText={setCustomSpecialty}
                placeholder="Type your specialty..."
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Years of Experience</Text>
            <TextInput
              style={styles.input}
              value={yearsOfExperience}
              onChangeText={setYearsOfExperience}
              placeholder="e.g. 5"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Preferred Location</Text>
            <TextInput
              style={styles.input}
              value={preferredLocation}
              onChangeText={setPreferredLocation}
              placeholder="e.g. Lagos, Nigeria"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 80 }} />
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
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
  },
  avatarText: {
    fontSize: 36,
    fontFamily: typography.bold,
    color: colors.white,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  sectionTitle: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
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
  disabledInput: {
    opacity: 0.6,
  },
  textArea: {
    height: 100,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 52,
  },
  pickerButtonText: {
    fontSize: typography.md,
    color: colors.textPrimary,
  },
  pickerDropdown: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 4,
    overflow: 'hidden',
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  pickerItemActive: {
    backgroundColor: colors.primaryLight,
  },
  pickerItemText: {
    fontSize: typography.md,
    color: colors.textPrimary,
  },
  pickerItemTextActive: {
    color: colors.primary,
    fontFamily: typography.semiBold,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 9,
    bottom: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.white,
    letterSpacing: 0.5,
  },
});

export default EditProfileScreen;