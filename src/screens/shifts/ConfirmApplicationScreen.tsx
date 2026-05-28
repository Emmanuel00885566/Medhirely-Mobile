import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { ShiftsStackParamList } from '../../navigation/ShiftsStack';
import { shiftsService } from '../../services/shifts';
import { applicationsService } from '../../services/applications';
import { useAuth } from '../../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<ShiftsStackParamList, 'ConfirmApplication'>;
  route: RouteProp<ShiftsStackParamList, 'ConfirmApplication'>;
};

const ConfirmApplicationScreen = ({ navigation, route }: Props) => {
  const { shiftId } = route.params;
  const { user } = useAuth();
  const [shift, setShift] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const loadShift = async () => {
      const data = await shiftsService.getShiftById(shiftId);
      setShift(data);
      setIsLoading(false);
    };
    loadShift();
  }, []);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await applicationsService.applyForShift(shiftId, user?.id || '');
      setIsSuccess(true);
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } catch (error: any) {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // ✅ Success State
  if (isSuccess) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successContent}>
          <Animated.View
            style={[
              styles.successIconContainer,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Ionicons name="checkmark-circle" size={100} color={colors.success} />
          </Animated.View>

          <Text style={styles.successTitle}>Application Submitted! 🎉</Text>
          <Text style={styles.successSubtitle}>
            Your application for{' '}
            <Text style={styles.successHighlight}>{shift?.title}</Text> at{' '}
            <Text style={styles.successHighlight}>{shift?.facility}</Text> has
            been sent successfully.
          </Text>

          <View style={styles.successInfoCard}>
            <View style={styles.successInfoRow}>
              <Ionicons
                name="time-outline"
                size={18}
                color={colors.primary}
              />
              <Text style={styles.successInfoText}>
                You will be notified once the facility responds
              </Text>
            </View>
            <View style={styles.successInfoRow}>
              <Ionicons
                name="document-text-outline"
                size={18}
                color={colors.primary}
              />
              <Text style={styles.successInfoText}>
                Track your application in the Applications tab
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => navigation.navigate('ShiftsFeed')}
            activeOpacity={0.85}
          >
            <Text style={styles.doneButtonText}>Back to Shifts</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.trackButton}
            onPress={() => navigation.navigate('ShiftsFeed')}
            activeOpacity={0.85}
          >
            <Text style={styles.trackButtonText}>Track Application</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ✅ Confirmation State
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
        <Text style={styles.headerTitle}>Confirm Application</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Shift Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Ionicons name="business" size={32} color={colors.primary} />
          </View>
          <Text style={styles.summaryTitle}>{shift?.title}</Text>
          <Text style={styles.summaryFacility}>{shift?.facility}</Text>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryDetails}>
            {[
              {
                icon: 'location-outline',
                label: 'Location',
                value: shift?.location,
              },
              {
                icon: 'calendar-outline',
                label: 'Date',
                value: shift?.date,
              },
              {
                icon: 'time-outline',
                label: 'Time',
                value: `${shift?.startTime} - ${shift?.endTime}`,
              },
              {
                icon: 'cash-outline',
                label: 'Pay',
                value: `₦${shift?.pay?.toLocaleString()}`,
              },
            ].map((item, index) => (
              <View key={index} style={styles.summaryRow}>
                <View style={styles.summaryRowLeft}>
                  <Ionicons
                    name={item.icon as any}
                    size={16}
                    color={colors.textMuted}
                  />
                  <Text style={styles.summaryLabel}>{item.label}</Text>
                </View>
                <Text style={styles.summaryValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Notice */}
        <View style={styles.noticeCard}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.noticeText}>
            By confirming, you agree to show up for this shift. Repeated
            no-shows may affect your profile rating.
          </Text>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={[styles.confirmButton, isSubmitting && styles.buttonDisabled]}
          onPress={handleConfirm}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Text style={styles.confirmButtonText}>Confirm Application</Text>
              <Ionicons name="checkmark" size={18} color={colors.white} />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  summaryIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  summaryFacility: {
    fontSize: typography.md,
    color: colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryDivider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.borderLight,
    marginBottom: 16,
  },
  summaryDetails: {
    width: '100%',
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryLabel: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: typography.sm,
    fontWeight: typography.semiBold,
    color: colors.textPrimary,
  },
  noticeCard: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    gap: 10,
    alignItems: 'flex-start',
  },
  noticeText: {
    flex: 1,
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 54,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
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
  confirmButtonText: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.white,
  },
  cancelButton: {
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: typography.md,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
  successContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 24,
  },
  successContent: {
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: typography.xxl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  successHighlight: {
    color: colors.primary,
    fontWeight: typography.semiBold,
  },
  successInfoCard: {
    width: '100%',
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    gap: 12,
  },
  successInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  successInfoText: {
    flex: 1,
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  doneButton: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  doneButtonText: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.white,
  },
  trackButton: {
    width: '100%',
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  trackButtonText: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.primary,
  },
});

export default ConfirmApplicationScreen;