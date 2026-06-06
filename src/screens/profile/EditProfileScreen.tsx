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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { useAuth } from '../../context/AuthContext';
import { ProfileStackParamList } from '../../navigation/ProfileStack';
import { workerService } from '../../services/workerService';


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
];

const AVAILABILITY = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const EditProfileScreen = ({ navigation }: Props) => {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('Experienced healthcare professional committed to quality patient care.');
  const [specialty, setSpecialty] = useState(user?.specialty || '');
  const [yearsOfExperience, setYearsOfExperience] = useState('5');
  const [preferredLocation, setPreferredLocation] = useState('Lagos, Nigeria');
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(['Mon', 'Wed', 'Fri']);
  const [showSpecialtyPicker, setShowSpecialtyPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleAvailability = (day: string) => {
    setSelectedAvailability((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
  if (!fullName || !specialty) {
    Alert.alert('Error', 'Please fill in all required fields');
    return;
  }
  setIsLoading(true);
  try {
    await workerService.updateProfile({
      bio,
      address: preferredLocation,
      exprienceYears: yearsOfExperience,
    });
    updateUser({ name: fullName, specialty });
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
            <Text style={styles.avatarText}>
              {fullName?.charAt(0).toUpperCase()}
            </Text>
            <TouchableOpacity style={styles.avatarEditButton}>
              <Ionicons name="camera" size={14} color={colors.white} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Personal Info */}
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={email}
              editable={false}
              placeholder="Email"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+234 000 000 0000"
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
          {/* Specialty */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Specialty</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowSpecialtyPicker(!showSpecialtyPicker)}
            >
              <Text style={[
                styles.pickerButtonText,
                !specialty && { color: colors.textMuted }
              ]}>
                {specialty || 'Select your specialty'}
              </Text>
              <Ionicons
                name={showSpecialtyPicker ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={colors.textMuted}
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
                    onPress={() => {
                      setSpecialty(item);
                      setShowSpecialtyPicker(false);
                    }}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      specialty === item && styles.pickerItemTextActive,
                    ]}>
                      {item}
                    </Text>
                    {specialty === item && (
                      <Ionicons name="checkmark" size={16} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
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

        {/* Availability */}
        <Text style={styles.sectionTitle}>Availability</Text>
        <View style={styles.formCard}>
          <Text style={styles.availabilityHint}>
            Select the days you are available to work
          </Text>
          <View style={styles.availabilityGrid}>
            {AVAILABILITY.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.availabilityChip,
                  selectedAvailability.includes(day) && styles.availabilityChipActive,
                ]}
                onPress={() => toggleAvailability(day)}
              >
                <Text style={[
                  styles.availabilityChipText,
                  selectedAvailability.includes(day) && styles.availabilityChipTextActive,
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
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
  changePhotoText: {
    fontSize: typography.sm,
    color: colors.primary,
    fontFamily: typography.medium,
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
  availabilityHint: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  availabilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  availabilityChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  availabilityChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  availabilityChipText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontFamily: typography.medium,
  },
  availabilityChipTextActive: {
    color: colors.white,
    fontFamily: typography.bold,
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
    elevation: 4,
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