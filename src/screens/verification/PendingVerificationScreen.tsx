import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { useAuth } from '../../context/AuthContext';

const PendingVerificationScreen = () => {
  const { logout, setUserVerified } = useAuth();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Pulse animation on the icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Background decoration */}
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      {/* Content */}
      <View style={styles.content}>
        {/* Animated Icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <Ionicons name="time-outline" size={64} color={colors.white} />
        </Animated.View>

        <Text style={styles.title}>Verification Pending</Text>
        <Text style={styles.subtitle}>
          Your documents have been submitted successfully!
        </Text>

        {/* Status card */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusIconDone}>
              <Ionicons name="checkmark" size={16} color={colors.white} />
            </View>
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusLabel}>Documents Submitted</Text>
              <Text style={styles.statusValue}>All required documents uploaded</Text>
            </View>
          </View>

          <View style={styles.statusDivider} />

          <View style={styles.statusRow}>
            <View style={styles.statusIconPending}>
              <Ionicons name="time-outline" size={16} color={colors.warning} />
            </View>
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusLabel}>Admin Review</Text>
              <Text style={styles.statusValue}>Your documents are being reviewed</Text>
            </View>
          </View>

          <View style={styles.statusDivider} />

          <View style={styles.statusRow}>
            <View style={styles.statusIconLocked}>
              <Ionicons name="lock-closed-outline" size={16} color={colors.textMuted} />
            </View>
            <View style={styles.statusTextContainer}>
              <Text style={[styles.statusLabel, { color: colors.textMuted }]}>
                Account Activated
              </Text>
              <Text style={styles.statusValue}>
                Waiting for admin approval
              </Text>
            </View>
          </View>
        </View>

        {/* Info box */}
        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={colors.primary}
          />
          <Text style={styles.infoText}>
            Our team typically reviews documents within{' '}
            <Text style={styles.infoHighlight}>24 - 48 hours</Text>. You will
            receive a notification once your account is approved.
          </Text>
        </View>

        {/* What to expect */}
        <View style={styles.expectCard}>
          <Text style={styles.expectTitle}>What happens next?</Text>
          {[
            'Admin reviews your uploaded documents',
            'You receive an email/notification',
            'Your account is activated',
            'Start browsing and applying for shifts!',
          ].map((step, index) => (
            <View key={index} style={styles.expectRow}>
              <View style={styles.expectNumber}>
                <Text style={styles.expectNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.expectText}>{step}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom buttons */}
      <View style={styles.bottomContainer}>
        {/* 
          DEV ONLY BUTTON — remove before final demo
          This simulates admin approving the account
        */}
        <TouchableOpacity
          style={styles.devButton}
          onPress={setUserVerified}
        >
          <Ionicons name="bug-outline" size={16} color={colors.primary} />
          <Text style={styles.devButtonText}>
            [DEV] Simulate Admin Approval
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.logoutText}>Sign Out</Text>
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
  circleTop: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.primaryLight,
    top: -100,
    right: -80,
  },
  circleBottom: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: colors.primaryLight,
    bottom: -80,
    left: -60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: typography.xxl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  statusCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDivider: {
    height: 20,
    width: 2,
    backgroundColor: colors.border,
    marginLeft: 15,
    marginVertical: 4,
  },
  statusIconDone: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIconPending: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIconLocked: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusTextContainer: {
    flex: 1,
  },
  statusLabel: {
    fontSize: typography.sm,
    fontWeight: typography.semiBold,
    color: colors.textPrimary,
  },
  statusValue: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  infoBox: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    gap: 10,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  infoHighlight: {
    color: colors.primary,
    fontWeight: typography.semiBold,
  },
  expectCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  expectTitle: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: 14,
  },
  expectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  expectNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expectNumberText: {
    fontSize: typography.sm,
    fontWeight: typography.bold,
    color: colors.white,
  },
  expectText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  bottomContainer: {
    padding: 24,
    gap: 12,
  },
  devButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    height: 48,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  devButtonText: {
    fontSize: typography.sm,
    color: colors.primary,
    fontWeight: typography.medium,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
  },
  logoutText: {
    fontSize: typography.md,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
});

export default PendingVerificationScreen;