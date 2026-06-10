import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { authService } from '../../services/auth';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Signup'>;
};

const SPECIALTIES = [
  { label: 'Nurse', value: 'nurse' },
  { label: 'Doctor', value: 'doctor' },
  { label: 'Therapist', value: 'therapist' },
  { label: 'Technician', value: 'technician' },
  { label: 'Other', value: 'other' },
];

const SignupScreen = ({ navigation }: Props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [showSpecialtyPicker, setShowSpecialtyPicker] = useState(false);
  const [customSpecialty, setCustomSpecialty] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

 const handleSignup = async () => {
  const finalSpecialty = specialty === 'other' ? customSpecialty.trim() : specialty;

  if (!firstName || !lastName || !email || !phoneNumber || !specialty || !password) {
    Alert.alert('Error', 'Please fill in all fields');
    return;
  }

  if (specialty === 'other' && !customSpecialty.trim()) {
    Alert.alert('Error', 'Please enter your specialty');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Alert.alert('Error', 'Please enter a valid email address');
    return;
  }

  if (password.length < 8) {
    Alert.alert('Error', 'Password must be at least 8 characters');
    return;
  }

  if (!agreedToTerms) {
    Alert.alert('Error', 'Please agree to the Terms of Service and Privacy Policy');
    return;
  }

  setIsLoading(true);
  try {
    const response = await authService.signup({
      firstName,
      lastName,
      email,
      phoneNumber,
      specialty: finalSpecialty,
      password,
    });
    console.log('Signup success:', response);
    navigation.navigate('OTPVerification', { email, type: 'signup' });
  } catch (error: any) {
    console.log('Signup error:', error?.response?.data);
    console.log('Signup error status:', error?.response?.status);
    Alert.alert('Signup Failed', error?.response?.data?.message || 'Something went wrong. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.brandName}>MedHirely</Text>
          <Text style={styles.welcomeText}>Create your account 👋</Text>
          <Text style={styles.subtitleText}>Join thousands of healthcare professionals</Text>
        </View>

        {/* Google Button */}
        <TouchableOpacity
          style={styles.googleButton}
          activeOpacity={0.85}
          onPress={() => Alert.alert('Coming Soon', 'Google sign in coming soon!')}
        >
          <Image
            source={require('../../assets/google-logo.png')}
            style={styles.socialIcon}
            resizeMode="contain"
          />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* First Name + Last Name */}
        <View style={styles.nameRow}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.nameInput}
              placeholder="First name"
              placeholderTextColor={colors.textMuted}
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.nameInput}
              placeholder="Last name"
              placeholderTextColor={colors.textMuted}
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="mail-outline"
              size={18}
              color={colors.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Phone Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="call-outline"
              size={18}
              color={colors.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.textMuted}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Specialty */}
<View style={styles.inputGroup}>
  <Text style={styles.label}>Specialty</Text>
  <TouchableOpacity
    style={styles.inputWrapper}
    onPress={() => setShowSpecialtyPicker(!showSpecialtyPicker)}
  >
    <Ionicons
      name="medkit-outline"
      size={18}
      color={colors.textMuted}
      style={styles.inputIcon}
    />
    <Text
      style={[
        styles.input,
        {
          paddingVertical: 0,
          color: specialty ? colors.textPrimary : colors.textMuted,
        },
      ]}
    >
      {specialty === 'other'
        ? customSpecialty || 'Type your specialty...'
        : SPECIALTIES.find((s) => s.value === specialty)?.label || 'Select your specialty'}
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
          key={item.value}
          style={[
            styles.pickerItem,
            specialty === item.value && styles.pickerItemActive,
          ]}
          onPress={() => {
            setSpecialty(item.value);
            setShowSpecialtyPicker(false);
          }}
        >
          <Text
            style={[
              styles.pickerItemText,
              specialty === item.value && styles.pickerItemTextActive,
            ]}
          >
            {item.label}
          </Text>
          {specialty === item.value && (
            <Ionicons name="checkmark" size={16} color={colors.primary} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  )}

  {/* Custom specialty input when Other is selected */}
  {specialty === 'other' && (
    <TextInput
      style={[styles.nameInput, { marginTop: 8 }]}
      placeholder="Type your specialty..."
      placeholderTextColor={colors.textMuted}
      value={customSpecialty}
      onChangeText={setCustomSpecialty}
      autoCapitalize="words"
    />
  )}
</View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={colors.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.passwordInput}
              placeholder="8 or more characters"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Terms */}
        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => setAgreedToTerms(!agreedToTerms)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, agreedToTerms && styles.checkboxActive]}>
            {agreedToTerms && (
              <Ionicons name="checkmark" size={12} color={colors.white} />
            )}
          </View>
          <Text style={styles.termsText}>
            I understand and agree to the{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>,{' '}
            <Text style={styles.termsLink}>User Agreement</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>
        </TouchableOpacity>

        {/* Create Account Button */}
        <TouchableOpacity
          style={[styles.createButton, isLoading && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.createButtonText}>Create my Account</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 55,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },

  brandName: {
    fontSize: typography.xxxl,
    fontFamily: typography.bold,
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: 6,
  },

  welcomeText: {
    fontSize: typography.xl,
    fontFamily: typography.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },

  subtitleText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },

  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginBottom: 16,
  },

  socialIcon: {
    width: 20,
    height: 20,
  },

  googleButtonText: {
    fontSize: typography.md,
    color: colors.textPrimary,
    fontFamily: typography.medium,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  dividerText: {
    fontSize: typography.sm,
    color: colors.textMuted,
  },

  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },

  inputGroup: {
    marginBottom: 14,
  },

  label: {
    fontSize: typography.sm,
    fontFamily: typography.medium,
    color: colors.textPrimary,
    marginBottom: 8,
  },

  nameInput: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 50,
    fontSize: typography.md,
    color: colors.textPrimary,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 50,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: typography.md,
    color: colors.textPrimary,
  },

  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 50,
  },

  passwordInput: {
    flex: 1,
    fontSize: typography.md,
    color: colors.textPrimary,
  },

  pickerDropdown: {
    marginTop: 4,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },

  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
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
    fontFamily: typography.medium,
  },

  termsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    alignItems: 'flex-start',
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
    flexShrink: 0,
  },

  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  termsText: {
    flex: 1,
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  termsLink: {
    color: colors.primary,
    fontFamily: typography.medium,
  },

  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 50,
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

  createButtonText: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.white,
    letterSpacing: 0.5,
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },

  loginLink: {
    fontSize: typography.sm,
    color: colors.primary,
    fontFamily: typography.bold,
  },
});