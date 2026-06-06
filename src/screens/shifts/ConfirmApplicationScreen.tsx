import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  ScrollView,
  Alert,
  Image,
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
  const { shiftId, shiftData } = route.params;
  const { user } = useAuth();
  const parsedShift = shiftData ? JSON.parse(shiftData) : null;

  console.log('=== ConfirmApplication MOUNTED ===');
  console.log('shiftData received:', shiftData);
  console.log('parsedShift:', parsedShift);
  console.log('isLoading will be:', !parsedShift);

  const [shift, setShift] = useState<any>(parsedShift || null);
  const [isLoading, setIsLoading] = useState(!parsedShift);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (parsedShift) return;
    const loadShift = async () => {
      try {
        const data = await shiftsService.getShiftById(shiftId);
        setShift(data);
      } catch (error) {
        console.log('Error loading shift:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadShift();
  }, []);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await applicationsService.applyForShift(
        shiftId,
        user?.id || '',
        shift?.facilityId || '',
        'I am interested in this shift and available to deliver.'
      );
      setIsSuccess(true);
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } catch (error: any) {
      console.log('Application error:', error?.response?.data);
      Alert.alert(
        'Application Failed',
        error?.response?.data?.message || 'Something went wrong. Please try again.'
      );
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('ShiftsFeed')}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.successContent}>
          <Animated.View style={[
            styles.successIconContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}>
            <View style={styles.successIconBg}>
              <Ionicons name="checkmark-circle" size={80} color={colors.success} />
            </View>
          </Animated.View>

          <Text style={styles.successTitle}>Application Submitted!</Text>
          <Text style={styles.successSubtitle}>
            Your application for{' '}
            <Text style={styles.successHighlight}>{shift?.title}</Text> at{' '}
            <Text style={styles.successHighlight}>{shift?.facility}</Text> has
            been sent successfully.
          </Text>

          <View style={styles.successDetailsCard}>
            <View style={styles.successDetailRow}>
              <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
              <Text style={styles.successDetailText}>{shift?.date}</Text>
            </View>
            <View style={styles.successDetailRow}>
              <Ionicons name="time-outline" size={16} color={colors.textMuted} />
              <Text style={styles.successDetailText}>
                {shift?.startTime} - {shift?.endTime}
              </Text>
            </View>
            <View style={styles.successDetailRow}>
              <Ionicons name="cash-outline" size={16} color={colors.textMuted} />
              <Text style={styles.successDetailText}>
                ₦{shift?.hourlyRate?.toLocaleString()} / hr
              </Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="time-outline" size={16} color={colors.primary} />
            <Text style={styles.infoText}>
              The facility usually responds within{' '}
              <Text style={styles.infoHighlight}>{shift?.responseTime}</Text>
            </Text>
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

  // Payment breakdown
  const basePay = shift?.payPerShift || 0;
  const platformFee = 500;
  const tax = Math.round(basePay * 0.05);
  const youEarned = basePay - platformFee - tax;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.facilityCard}>
          <View style={styles.facilityIconContainer}>
            <Ionicons name="add" size={28} color={colors.white} />
          </View>
          <View style={styles.facilityInfo}>
            <View style={styles.facilityNameRow}>
              <Text style={styles.facilityName}>{shift?.facility}</Text>
              {shift?.facilityVerified && (
                <Image
                  source={require('../../assets/verified.png')}
                  style={styles.verifiedIcon}
                />
              )}
            </View>
            <Text style={styles.specialtyText}>{shift?.title}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>
                {shift?.facilityRating} ({shift?.facilityReviews} reviews)
              </Text>
            </View>
          </View>
          <View style={styles.payContainer}>
            <Text style={styles.payAmount}>
              ₦{shift?.hourlyRate?.toLocaleString()}
            </Text>
            <Text style={styles.payLabel}>[Hourly]</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shift Detail</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.detailText}>{shift?.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.detailText}>
                {shift?.startTime} - {shift?.endTime} ({shift?.duration})
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.detailText}>{shift?.address}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.detailText}>
                ₦{shift?.payPerShift?.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.badgesRow}>
          <View style={styles.expBadge}>
            <Text style={styles.expBadgeText}>{shift?.requirements?.[0]}</Text>
          </View>
          <View style={[
            styles.shiftTypeBadge,
            { backgroundColor: shift?.shiftType === 'Night Shift' ? colors.black : '#FFF9E6' }
          ]}>
            <Text style={styles.shiftTypeIcon}>
              {shift?.shiftType === 'Night Shift' ? '🌙' : '☀️'}
            </Text>
            <Text style={[
              styles.shiftTypeBadgeText,
              { color: shift?.shiftType === 'Night Shift' ? colors.white : '#B07D00' }
            ]}>
              {shift?.shiftType}
            </Text>
          </View>
          <View style={styles.distanceBadge}>
            <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
            <Text style={styles.distanceBadgeText}>{shift?.distance}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Breakdown</Text>
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Base Pay ({shift?.duration})</Text>
              <Text style={styles.breakdownValue}>{basePay.toLocaleString()}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Hourly Rate</Text>
              <Text style={styles.breakdownValue}>
                ₦{shift?.hourlyRate?.toLocaleString()} / hr
              </Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Platform Fee</Text>
              <Text style={[styles.breakdownValue, { color: colors.error }]}>
                - ₦{platformFee.toLocaleString()}
              </Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Tax (5%)</Text>
              <Text style={[styles.breakdownValue, { color: colors.error }]}>
                - ₦{tax.toLocaleString()}
              </Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownRow}>
              <Text style={styles.youEarnedLabel}>You Earned</Text>
              <Text style={styles.youEarnedValue}>₦{youEarned.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.responseCard}>
          <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.responseText}>
            The facility usually responds within {shift?.responseTime}
          </Text>
        </View>

        <View style={styles.noticeCard}>
          <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
          <Text style={styles.noticeText}>
            By confirming, you agree to show up for this shift. Repeated
            no-shows may affect your profile rating.
          </Text>
        </View>

        <View style={{ height: 220 }} />
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.applyButton, isSubmitting && styles.buttonDisabled]}
          onPress={handleConfirm}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.applyButtonText}>Confirm Application</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 8 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  content: { paddingHorizontal: 16, paddingTop: 8 },
  facilityCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: colors.border },
  facilityIconContainer: { width: 48, height: 48, borderRadius: 12, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  facilityInfo: { flex: 1 },
  facilityNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  facilityName: { fontSize: typography.md, fontFamily: typography.bold, color: colors.textPrimary, flex: 1 },
  verifiedIcon: { width: 18, height: 18 },
  specialtyText: { fontSize: typography.sm, color: colors.textSecondary, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: typography.sm, color: colors.textSecondary },
  payContainer: { alignItems: 'flex-end' },
  payAmount: { fontSize: typography.lg, fontFamily: typography.bold, color: colors.primary },
  payLabel: { fontSize: typography.xs, color: colors.textSecondary },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: typography.md, fontFamily: typography.bold, color: colors.textPrimary, marginBottom: 10 },
  detailCard: { backgroundColor: colors.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, gap: 14 },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  detailText: { fontSize: typography.md, color: colors.textPrimary, flex: 1, lineHeight: 22 },
  badgesRow: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  expBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  expBadgeText: { fontSize: typography.xs, color: colors.textPrimary, fontFamily: typography.medium },
  shiftTypeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  shiftTypeIcon: { fontSize: 12 },
  shiftTypeBadgeText: { fontSize: typography.xs, fontFamily: typography.medium },
  distanceBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  distanceBadgeText: { fontSize: typography.xs, color: colors.textSecondary, fontFamily: typography.medium },
  breakdownCard: { backgroundColor: colors.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  breakdownLabel: { fontSize: typography.md, color: colors.textSecondary },
  breakdownValue: { fontSize: typography.md, color: colors.textPrimary, fontFamily: typography.medium },
  breakdownDivider: { height: 1, backgroundColor: colors.border, marginVertical: 4 },
  youEarnedLabel: { fontSize: typography.md, fontFamily: typography.bold, color: colors.textPrimary },
  youEarnedValue: { fontSize: typography.md, fontFamily: typography.bold, color: colors.primary },
  responseCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.white, borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  responseText: { fontSize: typography.sm, color: colors.textSecondary, flex: 1 },
  noticeCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: colors.primaryLight, borderRadius: 12, padding: 14 },
  noticeText: { flex: 1, fontSize: typography.sm, color: colors.textSecondary, lineHeight: 20 },
  bottomContainer: { position: 'absolute', bottom: 100, left: 0, right: 0, padding: 24, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border },
  applyButton: { backgroundColor: colors.primary, borderRadius: 12, height: 54, justifyContent: 'center', alignItems: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  buttonDisabled: { opacity: 0.7 },
  applyButtonText: { fontSize: typography.md, fontFamily: typography.bold, color: colors.white, letterSpacing: 0.5 },
  successContainer: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 24, paddingTop: 60 },
  successContent: { flex: 1, alignItems: 'center', paddingTop: 20 },
  successIconContainer: { marginBottom: 24 },
  successIconBg: { width: 120, height: 120, borderRadius: 60, backgroundColor: colors.secondaryLight, justifyContent: 'center', alignItems: 'center' },
  successTitle: { fontSize: typography.xxl, fontFamily: typography.bold, color: colors.textPrimary, marginBottom: 12, textAlign: 'center' },
  successSubtitle: { fontSize: typography.md, color: colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  successHighlight: { color: colors.primary, fontFamily: typography.semiBold },
  successDetailsCard: { width: '100%', backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.border, gap: 12 },
  successDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  successDetailText: { fontSize: typography.sm, color: colors.textSecondary },
  infoBox: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.primaryLight, borderRadius: 12, padding: 14, marginBottom: 32 },
  infoText: { flex: 1, fontSize: typography.sm, color: colors.textSecondary },
  infoHighlight: { color: colors.primary, fontFamily: typography.semiBold },
  doneButton: { width: '100%', backgroundColor: colors.primary, borderRadius: 12, height: 54, justifyContent: 'center', alignItems: 'center', marginBottom: 12, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  doneButtonText: { fontSize: typography.md, fontFamily: typography.bold, color: colors.white },
  trackButton: { width: '100%', height: 54, justifyContent: 'center', alignItems: 'center', borderRadius: 12, borderWidth: 1.5, borderColor: colors.primary },
  trackButtonText: { fontSize: typography.md, fontFamily: typography.bold, color: colors.primary },
});

export default ConfirmApplicationScreen;