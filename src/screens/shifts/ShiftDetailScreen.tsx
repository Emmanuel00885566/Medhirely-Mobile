import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
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
  const { shiftId } = route.params;
  const [shift, setShift] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
        <Text style={styles.headerTitle}>Shift Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Facility Card */}
        <View style={styles.facilityCard}>
          <View style={styles.facilityIconContainer}>
            <Ionicons name="business" size={32} color={colors.primary} />
          </View>
          <View style={styles.facilityInfo}>
            <Text style={styles.shiftTitle}>{shift.title}</Text>
            <Text style={styles.facilityName}>{shift.facility}</Text>
            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={14}
                color={colors.textMuted}
              />
              <Text style={styles.locationText}>{shift.location}</Text>
            </View>
          </View>
        </View>

        {/* Pay Highlight */}
        <View style={styles.payCard}>
          <View style={styles.payItem}>
            <Text style={styles.payValue}>₦{shift.pay.toLocaleString()}</Text>
            <Text style={styles.payItemLabel}>Total Pay</Text>
          </View>
          <View style={styles.payDivider} />
          <View style={styles.payItem}>
            <Text style={styles.payValue}>{shift.startTime}</Text>
            <Text style={styles.payItemLabel}>Start Time</Text>
          </View>
          <View style={styles.payDivider} />
          <View style={styles.payItem}>
            <Text style={styles.payValue}>{shift.endTime}</Text>
            <Text style={styles.payItemLabel}>End Time</Text>
          </View>
        </View>

        {/* Shift Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shift Information</Text>
          <View style={styles.infoCard}>
            {[
              {
                icon: 'calendar-outline',
                label: 'Date',
                value: shift.date,
              },
              {
                icon: 'medical-outline',
                label: 'Specialty',
                value: shift.specialty,
              },
              {
                icon: 'time-outline',
                label: 'Duration',
                value: `${shift.startTime} - ${shift.endTime}`,
              },
              {
                icon: 'location-outline',
                label: 'Location',
                value: shift.location,
              },
            ].map((item, index) => (
              <View key={index}>
                <View style={styles.infoRow}>
                  <View style={styles.infoIconContainer}>
                    <Ionicons
                      name={item.icon as any}
                      size={18}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>{item.label}</Text>
                    <Text style={styles.infoValue}>{item.value}</Text>
                  </View>
                </View>
                {index < 3 && <View style={styles.infoDivider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          <View style={styles.infoCard}>
            {shift.requirements.map((req: string, index: number) => (
              <View key={index} style={styles.requirementRow}>
                <View style={styles.requirementDot}>
                  <Ionicons
                    name="checkmark"
                    size={12}
                    color={colors.white}
                  />
                </View>
                <Text style={styles.requirementText}>{req}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* About Facility */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the Facility</Text>
          <View style={styles.infoCard}>
            <Text style={styles.aboutText}>
              {shift.facility} is a leading healthcare institution committed to
              providing quality medical services. They partner with MedHirely to
              ensure their patients receive the best care from verified
              healthcare professionals.
            </Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Apply Button */}
      <View style={styles.bottomContainer}>
        <View style={styles.bottomPayInfo}>
          <Text style={styles.bottomPayLabel}>Total Pay</Text>
          <Text style={styles.bottomPayValue}>
            ₦{shift.pay.toLocaleString()}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() =>
            navigation.navigate('ConfirmApplication', { shiftId: shift.id })
          }
          activeOpacity={0.85}
        >
          <Text style={styles.applyButtonText}>Apply Now</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.white} />
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
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  facilityCard: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  facilityIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  facilityInfo: {
    flex: 1,
  },
  shiftTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  facilityName: {
    fontSize: typography.md,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: typography.sm,
    color: colors.textMuted,
  },
  payCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payItem: {
    flex: 1,
    alignItems: 'center',
  },
  payValue: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.white,
    marginBottom: 4,
  },
  payItemLabel: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.7)',
  },
  payDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 8,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.xs,
    color: colors.textMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: typography.md,
    fontWeight: typography.medium,
    color: colors.textPrimary,
  },
  infoDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  requirementDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requirementText: {
    fontSize: typography.sm,
    color: colors.textPrimary,
    flex: 1,
  },
  aboutText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  bottomPayInfo: {
    flex: 1,
  },
  bottomPayLabel: {
    fontSize: typography.xs,
    color: colors.textMuted,
    marginBottom: 2,
  },
  bottomPayValue: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.primary,
  },
  applyButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.white,
  },
});

export default ShiftDetailScreen;