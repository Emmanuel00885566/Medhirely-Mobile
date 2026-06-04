import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { applicationsService } from '../../services/applications';
import { ApplicationsStackParamList } from '../../navigation/ApplicationsStack';

type Props = {
  navigation: NativeStackNavigationProp<ApplicationsStackParamList, 'ShiftSummary'>;
  route: RouteProp<ApplicationsStackParamList, 'ShiftSummary'>;
};

const ShiftSummaryScreen = ({ navigation, route }: Props) => {
  const { applicationId } = route.params;
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await applicationsService.getApplicationById(applicationId);
      setApplication(data);
      setIsLoading(false);
    };
    load();
  }, []);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating before submitting');
      return;
    }
    setIsSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 1000));
      setReviewSubmitted(true);
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

  const shift = application?.shift;
  const basePay = shift?.pay || 45000;
  const hourlyRate = 3750;
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
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Facility Info */}
        <View style={styles.facilityCard}>
          <View style={styles.facilityIconContainer}>
            <Ionicons name="add" size={28} color={colors.white} />
          </View>
          <View style={styles.facilityInfo}>
            <Text style={styles.facilityName}>{shift?.facility}</Text>
            <Text style={styles.specialtyText}>{shift?.title}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>4.5 (21 reviews)</Text>
            </View>
          </View>
        </View>

        {/* Shift Detail */}
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
                {shift?.startTime} - {shift?.endTime}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.detailText}>{shift?.address}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.detailText}>
                ₦{basePay.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Breakdown</Text>
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Base Pay (12 hrs)</Text>
              <Text style={styles.breakdownValue}>
                {basePay.toLocaleString()}
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
              <Text style={styles.youEarnedLabel}>You Earned</Text>
              <Text style={styles.youEarnedValue}>
                ₦{youEarned.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Rate this Facility */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rate this Facility</Text>
          {!reviewSubmitted ? (
            <View style={styles.ratingCard}>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={star <= rating ? 'star' : 'star-outline'}
                      size={36}
                      color={star <= rating ? '#FFD700' : colors.border}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {rating > 0 && (
                <Text style={styles.ratingLabel}>
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent!'}
                </Text>
              )}

              <TextInput
                style={styles.reviewInput}
                placeholder="Leave an optional review..."
                placeholderTextColor={colors.textMuted}
                value={review}
                onChangeText={setReview}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isSubmitting && styles.buttonDisabled,
                ]}
                onPress={handleSubmitReview}
                disabled={isSubmitting}
                activeOpacity={0.85}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Review</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.reviewSuccessCard}>
              <Ionicons name="checkmark-circle" size={48} color={colors.success} />
              <Text style={styles.reviewSuccessTitle}>Review Submitted!</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={20}
                    color={star <= rating ? '#FFD700' : colors.border}
                  />
                ))}
              </View>
            </View>
          )}
        </View>

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 8,
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
    marginBottom: 20,
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
  facilityName: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: 4,
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
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: typography.md,
    fontWeight: typography.bold,
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
  },
  breakdownValue: {
    fontSize: typography.md,
    color: colors.textPrimary,
    fontWeight: typography.medium,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  youEarnedLabel: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  youEarnedValue: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.primary,
  },
  ratingCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  ratingLabel: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.primary,
    marginBottom: 16,
  },
  reviewInput: {
    width: '100%',
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    fontSize: typography.md,
    color: colors.textPrimary,
    minHeight: 80,
    marginBottom: 16,
  },
  submitButton: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 52,
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
  submitButtonText: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.white,
  },
  reviewSuccessCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 12,
  },
  reviewSuccessTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
  },
});

export default ShiftSummaryScreen;