import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { ProfileStackParamList } from '../../navigation/ProfileStack';

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
        <View style={styles.facilityIconContainer}>
          <Ionicons name="add" size={20} color={colors.white} />
        </View>
        <View style={styles.reviewerInfo}>
          <Text style={styles.facilityName} numberOfLines={1}>
            {item.facility}
          </Text>
          <Text style={styles.shiftTitle}>{item.shiftTitle}</Text>
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
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews Received</Text>
        <View style={{ width: 40 }} />
      </View>

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
                  {renderStars(Math.round(averageRating), 22)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.lg,
    fontFamily: typography.bold,
    color: colors.textPrimary,
  },
  listContainer: {
    paddingHorizontal: 16,
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
    gap: 6,
  },
  averageRating: {
    fontSize: 48,
    fontFamily: typography.bold,
    color: colors.textPrimary,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  totalReviews: {
    fontSize: typography.sm,
    fontFamily: typography.medium,
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
    fontFamily: typography.bold,
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
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  facilityIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewerInfo: {
    flex: 1,
  },
  facilityName: {
    fontSize: typography.md,
    fontFamily: typography.semiBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  shiftTitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontFamily: typography.medium,
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
    fontFamily: typography.bold,
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
    fontFamily: typography.medium,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: typography.lg,
    fontFamily: typography.bold,
    color: colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ReviewsReceivedScreen;