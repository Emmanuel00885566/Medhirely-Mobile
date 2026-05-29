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
        <Text style={styles.headerTitle}>Shift Summary</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Completed Banner */}
        <View style={styles.completedBanner}>
          <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
          <Text style={styles.completedBannerText}>Shift Completed!</Text>
        </View>

        {/* Facility Card */}
        <View style={styles.facilityCard}>
          <View style={styles.facilityIconContainer}>
            <Ionicons name="business" size={32} color={colors.primary} />
          </View>
          <View style={styles.facilityInfo}>
            <Text style={styles.shiftTitle}>{shift?.title}</Text>
            <Text style={styles.facilityName}>{shift?.facility}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={colors.textMuted} />
              <Text style={styles.locationText}>{shift?.location}</Text>
            </View>
          </View>
        </View>

        {/* Earnings Summary */}
        <View style={styles.earningsCard}>
          <Text style={styles.earningsTitle}>Earnings Summary</Text>
          <View style={styles.earningsRow}>
            <View style={styles.earningsItem}>
              <Text style={styles.earningsValue}>
                ₦{shift?.pay?.toLocaleString()}
              </Text>
              <Text style={styles.earningsLabel}>Total Earned</Text>
            </View>
            <View style={styles.earningsDivider} />
            <View style={styles.earningsItem}>
              <Text style={styles.earningsValue}>{shift?.date}</Text>
              <Text style={styles.earningsLabel}>Shift Date</Text>
            </View>
            <View style={styles.earningsDivider} />
            <View style={styles.earningsItem}>
              <Text style={styles.earningsValue}>Pending</Text>
              <Text style={styles.earningsLabel}>Payment</Text>
            </View>
          </View>
        </View>

        {/* Shift Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shift Details</Text>
          <View style={styles.infoCard}>
            {[
              { icon: 'calendar-outline', label: 'Date', value: shift?.date },
              {
                icon: 'time-outline',
                label: 'Time',
                value: `${shift?.startTime} - ${shift?.endTime}`,
              },
              {
                icon: 'location-outline',
                label: 'Location',
                value: shift?.location,
              },
              {
                icon: 'cash-outline',
                label: 'Pay',
                value: `₦${shift?.pay?.toLocaleString()}`,
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

        {/* Rating Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rate this Facility</Text>
          {!reviewSubmitted ? (
            <View style={styles.ratingCard}>
              <Text style={styles.ratingQuestion}>
                How was your experience at {shift?.facility}?
              </Text>

              {/* Stars */}
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={star <= rating ? 'star' : 'star-outline'}
                      size={40}
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

              {/* Review Text */}
              <TextInput
                style={styles.reviewInput}
                placeholder="Leave an optional review about your experience..."
                placeholderTextColor={colors.textMuted}
                value={review}
                onChangeText={setReview}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              {/* Submit */}
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
            // ✅ Review submitted state
            <View style={styles.reviewSuccessCard}>
              <Ionicons
                name="checkmark-circle"
                size={48}
                color={colors.success}
              />
              <Text style={styles.reviewSuccessTitle}>Review Submitted!</Text>
              <Text style={styles.reviewSuccessText}>
                Thank you for your feedback. It helps facilities improve their
                working conditions.
              </Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={24}
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
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  completedBannerText: {
    fontSize: typography.sm,
    color: colors.primary,
    fontWeight: typography.semiBold,
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
  earningsCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  earningsTitle: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.white,
    marginBottom: 16,
    textAlign: 'center',
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earningsItem: {
    flex: 1,
    alignItems: 'center',
  },
  earningsValue: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.white,
    marginBottom: 4,
  },
  earningsLabel: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.7)',
  },
  earningsDivider: {
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
  ratingCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  ratingQuestion: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
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
    minHeight: 100,
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
  reviewSuccessText: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
  },
});

export default ShiftSummaryScreen;