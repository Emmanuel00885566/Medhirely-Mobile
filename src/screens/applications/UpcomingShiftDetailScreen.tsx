import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { applicationsService } from '../../services/applications';
import { ApplicationsStackParamList } from '../../navigation/ApplicationsStack';

type Props = {
  navigation: NativeStackNavigationProp<ApplicationsStackParamList, 'UpcomingShiftDetail'>;
  route: RouteProp<ApplicationsStackParamList, 'UpcomingShiftDetail'>;
};

const UpcomingShiftDetailScreen = ({ navigation, route }: Props) => {
  const { applicationId } = route.params;
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await applicationsService.getApplicationById(applicationId);
      setApplication(data);
      setIsLoading(false);
    };
    load();
  }, []);

  const handleCheckIn = () => {
    Alert.alert(
      'Shift Check-in',
      'Confirm you have arrived at the facility and are ready to start your shift.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Check In',
          onPress: () => {
            setCheckedIn(true);
            Alert.alert('Checked In! ✅', 'You have successfully checked in. Have a great shift!');
          },
        },
      ]
    );
  };
const handleCompleteShift = () => {
  Alert.alert(
    'Complete Shift',
    'Are you sure you want to mark this shift as completed?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes, Complete',
        onPress: async () => {
          try {
            await applicationsService.withdrawApplication(applicationId);
            Alert.alert(
              'Shift Completed! 🎉',
              'Your shift has been marked as completed. Payment will be processed by the facility.',
              [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
          } catch (error) {
            Alert.alert('Error', 'Failed to complete shift. Please try again.');
          }
        },
      },
    ]
  );
};

  const handleGetDirections = () => {
    const address = encodeURIComponent(application?.shift?.address || '');
    Linking.openURL(`https://maps.google.com/?q=${address}`);
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
            <View style={styles.facilityNameRow}>
              <Text style={styles.facilityName}>{shift?.facility}</Text>
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>Pending</Text>
              </View>
            </View>
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
                ₦{shift?.pay?.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Check in notice */}
        <View style={styles.checkInNotice}>
          <Ionicons name="checkmark-circle-outline" size={18} color={colors.success} />
          <Text style={styles.checkInNoticeText}>
            Please Check in 15 minutes before your shift starts
          </Text>
        </View>

        {/* Facility Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Facility Contact</Text>
          <View style={styles.contactCard}>
            <View style={styles.contactLeft}>
              <Ionicons name="call-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.contactNumber}>{shift?.contactPhone}</Text>
            </View>
            <TouchableOpacity
              style={styles.messageButton}
              onPress={() => Alert.alert('Message', 'Messaging coming soon!')}
            >
              <Ionicons name="chatbubble-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Notes from Facility */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes from Facility</Text>
          <View style={styles.notesCard}>
            <Text style={styles.notesText}>
              {shift?.notes || 'Please carry your ID card and arrive on time. Thank you!'}
            </Text>
          </View>
        </View>

        {/* Application Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Info</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Applied on</Text>
              <Text style={styles.infoValue}>
                {new Date(application?.appliedAt).toLocaleDateString('en-NG', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={[styles.infoValue, { color: colors.warning }]}>
                Pending
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Application ID</Text>
              <Text style={styles.infoValue}>APP{application?.id}65</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 145 }} />
      </ScrollView>

      {/* Bottom Buttons */}
      {/* Bottom Buttons */}
<View style={styles.bottomContainer}>
  {!checkedIn ? (
    <>
      <TouchableOpacity
        style={styles.directionsButton}
        onPress={handleGetDirections}
        activeOpacity={0.85}
      >
        <Text style={styles.directionsButtonText}>Get Directions</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.checkInButton}
        onPress={handleCheckIn}
        activeOpacity={0.85}
      >
        <Text style={styles.checkInButtonText}>Shift Check-in</Text>
      </TouchableOpacity>
    </>
  ) : (
    <TouchableOpacity
      style={styles.completeButton}
      onPress={handleCompleteShift}
      activeOpacity={0.85}
    >
      <Ionicons name="checkmark-circle-outline" size={20} color={colors.white} />
      <Text style={styles.completeButtonText}>Mark Shift as Completed</Text>
    </TouchableOpacity>
  )}
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
  facilityNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  facilityName: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  pendingBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pendingBadgeText: {
    fontSize: typography.xs,
    fontFamily: typography.bold,
    color: colors.warning,
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
  checkInNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.secondaryLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  checkInNoticeText: {
    flex: 1,
    fontSize: typography.sm,
    color: colors.success,
    fontFamily: typography.medium,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contactNumber: {
    fontSize: typography.md,
    fontFamily: typography.medium,
    color: colors.textPrimary,
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
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
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: typography.md,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: typography.md,
    fontFamily: typography.medium,
    color: colors.textPrimary,
  },
  infoDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  directionsButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  directionsButtonText: {
    fontSize: typography.md,
    fontFamily: typography.semiBold,
    color: colors.textPrimary,
  },
  checkInButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedInButton: {
    backgroundColor: colors.secondaryLight,
  },
  checkInButtonText: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.white,
  },
  completeButton: {
  flex: 1,
  height: 52,
  borderRadius: 12,
  backgroundColor: colors.success,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  gap: 8,
  shadowColor: colors.success,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 4,
},
completeButtonText: {
  fontSize: typography.md,
  fontFamily: typography.bold,
  color: colors.white,
},
});

export default UpcomingShiftDetailScreen;