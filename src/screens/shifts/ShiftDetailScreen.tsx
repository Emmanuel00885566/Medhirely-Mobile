import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { shiftsService } from '../../services/shifts';
import { ShiftsStackParamList } from '../../navigation/ShiftsStack';

type Props = {
  navigation: NativeStackNavigationProp<ShiftsStackParamList, 'ShiftDetail'>;
  route: RouteProp<ShiftsStackParamList, 'ShiftDetail'>;
};

const ShiftDetailScreen = ({ navigation, route }: Props) => {
  const { shiftId, shiftData } = route.params;
  const parsedShift = shiftData ? JSON.parse(shiftData) : null;
  const [shift, setShift] = useState<any>(parsedShift || null);
  const [isLoading, setIsLoading] = useState(!parsedShift);

  useEffect(() => {
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
  }, [shiftId]);

  const handleApply = () => {
    console.log('Apply button pressed!');
    navigation.navigate('ConfirmApplication', {
      shiftId: shift.id,
      shiftData: JSON.stringify(shift),
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!shift) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Shift not found</Text>
      </View>
    );
  }

  const basePay = shift.payPerShift;
  const hourlyRate = shift.hourlyRate;
  const platformFee = 500;
  const tax = Math.round(basePay * 0.05);
  const youEarned = basePay - platformFee - tax;

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
        <Text style={styles.headerTitle}>Shift Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Facility Info */}
        <View style={styles.facilityCard}>
          <View style={styles.facilityIconContainer}>
            <Ionicons name="medical" size={28} color={colors.white} />
          </View>
          <View style={styles.facilityInfo}>
            <View style={styles.facilityNameRow}>
              <Text style={styles.facilityName}>{shift.facility}</Text>
              {shift.facilityVerified && (
                <Image
                  source={require('../../assets/verified.png')}
                  style={styles.verifiedIcon}
                />
              )}
            </View>
            <Text style={styles.specialtyText}>{shift.title}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>
                {shift.facilityRating} ({shift.facilityReviews} reviews)
              </Text>
            </View>
          </View>
          <View style={styles.payPerShiftContainer}>
            <Text style={styles.payPerShiftAmount}>
              ₦{shift.payPerShift.toLocaleString()}
            </Text>
            <Text style={styles.payPerShiftLabel}>Per Shift</Text>
          </View>
        </View>

        {/* Urgent Badge */}
        {shift.urgent && (
          <View style={styles.urgentBadge}>
            <Ionicons name="flash" size={14} color={colors.error} />
            <Text style={styles.urgentText}>Urgent — Fast response needed</Text>
          </View>
        )}

        {/* Shift Detail Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shift Detail</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.detailText}>{shift.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.detailText}>
                {shift.startTime} - {shift.endTime} ({shift.duration})
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.detailText}>{shift.address}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.detailText}>
                ₦{shift.payPerShift.toLocaleString()} per shift
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="medkit-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.detailText}>{shift.specialty}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {shift.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{shift.notes}</Text>
            </View>
          </View>
        )}

        {/* Response Time */}
        <View style={styles.responseCard}>
          <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.responseText}>
            The facility usually responds within {shift.responseTime}
          </Text>
        </View>

        {/* Payment Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Breakdown</Text>
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>
                Base Pay ({shift.duration})
              </Text>
              <Text style={styles.breakdownValue}>
                ₦{basePay.toLocaleString()}
              </Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Hourly Rate</Text>
              <Text style={styles.breakdownValue}>
                ₦{hourlyRate.toLocaleString()} / hr
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
              <Text style={styles.youEarnedLabel}>You Earn</Text>
              <Text style={styles.youEarnedValue}>
                ₦{youEarned.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 190 }} />
      </ScrollView>

      {/* Bottom Apply Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApply}
          activeOpacity={0.85}
        >
          <Text style={styles.applyButtonText}>Apply for this Shift</Text>
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
  errorText: {
    fontSize: typography.md,
    color: colors.textSecondary,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: typography.lg,
    fontFamily: typography.bold,
    color: colors.textPrimary,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  facilityCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  facilityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  facilityInfo: {
    flex: 1,
  },
  facilityNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  facilityName: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.textPrimary,
    flex: 1,
  },
  verifiedIcon: {
    width: 18,
    height: 18,
  },
  specialtyText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  payPerShiftContainer: {
    alignItems: 'flex-end',
  },
  payPerShiftAmount: {
    fontSize: typography.lg,
    fontFamily: typography.bold,
    color: colors.primary,
  },
  payPerShiftLabel: {
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF0F0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.error,
  },
  urgentText: {
    fontSize: typography.sm,
    color: colors.error,
    fontFamily: typography.medium,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  detailCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailText: {
    fontSize: typography.md,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 22,
  },
  notesCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notesText: {
    fontSize: typography.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  responseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  responseText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  breakdownCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  breakdownLabel: {
    fontSize: typography.md,
    color: colors.textSecondary,
    fontFamily: typography.medium, 
  },
  breakdownValue: {
    fontSize: typography.md,
    color: colors.textPrimary,
    fontFamily: typography.medium,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  youEarnedLabel: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.textPrimary,
  },
  youEarnedValue: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.primary,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  applyButton: {
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
  applyButtonText: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.white,
    letterSpacing: 0.5,
  },
});

export default ShiftDetailScreen;