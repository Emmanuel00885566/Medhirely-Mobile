import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { ProfileStackParamList } from '../../navigation/ProfileStack';
import { TouchableOpacity } from 'react-native';

type Props = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'ReviewsReceived'>;
};

const MOCK_REVIEWS = [
  {
    id: '1',
    facility: 'Lagos University Teaching Hospital',
    shiftTitle: 'Night Shift Nurse',
    rating: 5,
    comment: 'Excellent nurse, very professional and punctual. Would definitely work with her again.',
    reviewedAt: '2025-06-12T10:00:00Z',
    reviewerName: 'Dr. Adeyemi',
  },
  {
    id: '2',
    facility: 'Eko Hospital',
    shiftTitle: 'Emergency Room Doctor',
    rating: 4,
    comment: 'Very competent and handled emergency cases well. Great team player.',
    reviewedAt: '2025-06-10T10:00:00Z',
    reviewerName: 'Dr. Okafor',
  },
  {
    id: '3',
    facility: 'National Hospital Abuja',
    shiftTitle: 'Pharmacist',
    rating: 5,
    comment: 'Outstanding knowledge of medications and excellent patient communication skills.',
    reviewedAt: '2025-06-08T10:00:00Z',
    reviewerName: 'Dr. Bello',
  },
  {
    id: '4',
    facility: 'St. Nicholas Hospital',
    shiftTitle: 'ICU Nurse',
    rating: 4,
    comment: 'Good critical care skills and attentive to patients. Showed great initiative.',
    reviewedAt: '2025-06-05T10:00:00Z',
    reviewerName: 'Dr. Williams',
  },
];

const ReviewsReceivedScreen = ({ navigation }: Props) => {
  const [isLoading] = useState(false);

  const averageRating =
    MOCK_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / MOCK_REVIEWS.length;

  const getRatingCount = (star: number) =>
    MOCK_REVIEWS.filter((r) => r.rating === star).length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderStars = (rating: number, size = 16) => (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= rating ? 'star' : 'star-outline'}
          size={size}
          color={star <= rating ? '#FFD700' : colors.border}
        />
      ))}
    </View>
  );

  const renderReview = ({ item }: { item: typeof MOCK_REVIEWS[0] }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewerIconContainer}>
          <Ionicons name="business-outline" size={22} color={colors.primary} />
        </View>
        <View style={styles.reviewerInfo}>
          <Text style={styles.facilityName} numberOfLines={1}>
            {item.facility}
          </Text>
          <Text style={styles.shiftTitle} numberOfLines={1}>
            {item.shiftTitle}
          </Text>
        </View>
        <Text style={styles.reviewDate}>{formatDate(item.reviewedAt)}</Text>
      </View>

      <View style={styles.reviewRatingRow}>
        {renderStars(item.rating)}
        <Text style={styles.reviewRatingText}>{item.rating}.0</Text>
      </View>

      <Text style={styles.reviewComment}>{item.comment}</Text>

      <View style={styles.reviewFooter}>
        <Ionicons name="person-outline" size={14} color={colors.textMuted} />
        <Text style={styles.reviewerName}>{item.reviewerName}</Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="star-outline" size={64} color={colors.border} />
      <Text style={styles.emptyTitle}>No Reviews Yet</Text>
      <Text style={styles.emptySubtitle}>
        Complete shifts to start receiving reviews from facilities.
      </Text>
    </View>
  );

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
        <Text style={styles.headerTitle}>Reviews Received</Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={MOCK_REVIEWS}
          renderItem={renderReview}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          ListHeaderComponent={
            MOCK_REVIEWS.length > 0 ? (
              <View>
                {/* Rating Summary */}
                <View style={styles.ratingSummaryCard}>
                  <View style={styles.ratingLeft}>
                    <Text style={styles.averageRating}>
                      {averageRating.toFixed(1)}
                    </Text>
                    {renderStars(Math.round(averageRating), 24)}
                    <Text style={styles.totalReviews}>
                      {MOCK_REVIEWS.length} reviews
                    </Text>
                  </View>

                  <View style={styles.ratingBars}>
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = getRatingCount(star);
                      const percentage = (count / MOCK_REVIEWS.length) * 100;
                      return (
                        <View key={star} style={styles.ratingBarRow}>
                          <Text style={styles.ratingBarLabel}>{star}</Text>
                          <Ionicons name="star" size={10} color="#FFD700" />
                          <View style={styles.ratingBarBackground}>
                            <View
                              style={[
                                styles.ratingBarFill,
                                { width: `${percentage}%` },
                              ]}
                            />
                          </View>
                          <Text style={styles.ratingBarCount}>{count}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                <Text style={styles.sectionTitle}>All Reviews</Text>
              </View>
            ) : null
          }
        />
      )}
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
  listContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 100,
  },
  ratingSummaryCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 20,
  },
  ratingLeft: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  averageRating: {
    fontSize: 48,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  totalReviews: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  ratingBars: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingBarLabel: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    width: 10,
  },
  ratingBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  ratingBarCount: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    width: 16,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  reviewCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  reviewerIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewerInfo: {
    flex: 1,
  },
  facilityName: {
    fontSize: typography.md,
    fontWeight: typography.semiBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  shiftTitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  reviewDate: {
    fontSize: typography.xs,
    color: colors.textMuted,
  },
  reviewRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  reviewRatingText: {
    fontSize: typography.sm,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  reviewComment: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  reviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reviewerName: {
    fontSize: typography.sm,
    color: colors.textMuted,
    fontWeight: typography.medium,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 24,
  },
});

export default ReviewsReceivedScreen;