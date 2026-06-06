import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { useAuth } from '../../context/AuthContext';

const PendingVerificationScreen = () => {
  const { logout, setUserVerified } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.content}>
        {/* Illustration */}
        <Image
          source={require('../../assets/verification_pending.png')}
          style={styles.illustration}
          resizeMode="contain"
        />

        {/* Text */}
        <Text style={styles.title}>Verification Pending</Text>
        <Text style={styles.subtitle}>
          Your documents have been submitted successfully.
        </Text>
        <Text style={styles.description}>
          Our team will review and get back to you within{' '}
          <Text style={styles.highlight}>24-48 hours.</Text>
        </Text>

        {/* Go to Profile Button */}
        <TouchableOpacity
          style={styles.profileButton}
          onPress={setUserVerified}
          activeOpacity={0.85}
        >
          <Text style={styles.profileButtonText}>Go to Profile</Text>
        </TouchableOpacity>

        {/* DEV Button */}
        <TouchableOpacity
          style={styles.devButton}
          onPress={setUserVerified}
        >
          <Ionicons name="bug-outline" size={14} color={colors.primary} />
          <Text style={styles.devButtonText}>[DEV] Simulate Approval</Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    alignItems: 'center',
  },
  illustration: {
    width: 200,
    height: 200,
    marginBottom: 32,
  },
  title: {
    fontSize: typography.xxl,
    fontFamily: typography.bold,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  description: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  highlight: {
    color: colors.primary,
    fontFamily: typography.semiBold,
  },
  profileButton: {
    width: '100%',
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
  profileButtonText: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.white,
    letterSpacing: 0.5,
  },
  devButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  devButtonText: {
    fontSize: typography.sm,
    color: colors.primary,
    fontFamily: typography.medium,
  },
  logoutButton: {
    paddingVertical: 8,
  },
  logoutText: {
    fontSize: typography.md,
    color: colors.textSecondary,
  },
});

export default PendingVerificationScreen;