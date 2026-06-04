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

const COUNTRIES = ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Other'];

const SignupScreen = ({ navigation }: Props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [country, setCountry] = useState('Nigeria');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    if (!agreedToTerms) {
      Alert.alert(
        'Error',
        'Please agree to the Terms of Service and Privacy Policy'
      );
      return;
    }

    setIsLoading(true);

    try {
      await authService.signup(
        `${firstName} ${lastName}`,
        email,
        password
      );

      navigation.navigate('OTPVerification', { email });
    } catch (error) {
      Alert.alert(
        'Signup Failed',
        'Something went wrong. Please try again.'
      );
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
          <Ionicons
            name="arrow-back"
            size={22}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.headerSection}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Google Button */}
        <TouchableOpacity
          style={styles.googleButton}
          activeOpacity={0.85}
          onPress={() =>
            Alert.alert(
              'Coming Soon',
              'Google sign in coming soon!'
            )
          }
        >
          <Image
            source={require('../../assets/google-logo.png')}
            style={styles.socialIcon}
            resizeMode="contain"
          />

          <Text style={styles.googleButtonText}>
            Continue with Google
          </Text>
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
              placeholder="First Name"
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
              placeholder="Last Name"
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

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>

          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password (8 or more characters)"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={{
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
              }}
            >
              <Ionicons
                name={
                  showPassword
                    ? 'eye-off-outline'
                    : 'eye-outline'
                }
                size={18}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Country */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Country</Text>

          <TouchableOpacity
            style={styles.countryWrapper}
            onPress={() =>
              setShowCountryPicker(!showCountryPicker)
            }
          >
            <Text style={styles.countryText}>{country}</Text>

            <Ionicons
              name={
                showCountryPicker
                  ? 'chevron-up'
                  : 'chevron-down'
              }
              size={18}
              color={colors.textMuted}
            />
          </TouchableOpacity>

          {showCountryPicker && (
            <View style={styles.pickerDropdown}>
              {COUNTRIES.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.pickerItem,
                    country === item &&
                      styles.pickerItemActive,
                  ]}
                  onPress={() => {
                    setCountry(item);
                    setShowCountryPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      country === item &&
                        styles.pickerItemTextActive,
                    ]}
                  >
                    {item}
                  </Text>

                  {country === item && (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Terms */}
        <TouchableOpacity
          style={styles.termsRow}
          onPress={() =>
            setAgreedToTerms(!agreedToTerms)
          }
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              agreedToTerms &&
                styles.checkboxActive,
            ]}
          >
            {agreedToTerms && (
              <Ionicons
                name="checkmark"
                size={12}
                color={colors.white}
              />
            )}
          </View>

          <Text style={styles.termsText}>
            Yes, I understand and agree to the{' '}
            <Text style={styles.termsLink}>
              Terms of Service
            </Text>
            , including the{' '}
            <Text style={styles.termsLink}>
              User Agreement
            </Text>{' '}
            and{' '}
            <Text style={styles.termsLink}>
              Privacy Policy
            </Text>
            .
          </Text>
        </TouchableOpacity>

        {/* Create Account */}
        <TouchableOpacity
          style={[
            styles.createButton,
            isLoading &&
              styles.buttonDisabled,
          ]}
          onPress={handleSignup}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator
              color={colors.white}
            />
          ) : (
            <Text style={styles.createButtonText}>
              Create my Account
            </Text>
          )}
        </TouchableOpacity>

        {/* Login */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>
            Already have an account?
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Login')
            }
          >
            <Text style={styles.loginLink}>
              Login
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 60,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  headerSection: {
    alignItems: 'center',
    marginBottom: 0,
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },

  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 52,
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
    fontWeight: typography.medium,
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
    marginBottom: 0,
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
    color: colors.textPrimary,
    marginBottom: 8,
  },

  nameInput: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 52,
  },

  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 52,
  },

  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 52,
  },

  passwordInput: {
    flex: 1,
  },

  countryWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 52,
  },

  countryText: {
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  pickerItemActive: {
    backgroundColor: colors.primaryLight,
  },

  pickerItemText: {
    color: colors.textPrimary,
  },

  pickerItemTextActive: {
    color: colors.primary,
  },

  termsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  termsText: {
    flex: 1,
    color: colors.textSecondary,
  },

  termsLink: {
    color: colors.primary,
  },

  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  createButtonText: {
    color: colors.white,
    fontWeight: typography.bold,
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  loginText: {
    color: colors.textSecondary,
  },

  loginLink: {
    color: colors.primary,
    fontWeight: typography.bold,
  },
});

export default SignupScreen;