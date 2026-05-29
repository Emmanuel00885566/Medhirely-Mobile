import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Clipboard,
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
  const [pinRevealed, setPinRevealed] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await applicationsService.getApplicationById(applicationId);
      setApplication(data);
      setIsLoading(false);
    };
    load();
  }, []);

  const handleCopyPin = () => {
    Clipboard.setString(application?.shift?.checkInPin || '');
    Alert.alert('Copied!', 'Check-in PIN copied to clipboard');
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
        <Text style={styles.headerTitle}>Upcoming Shift</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Status Banner */}
        <View style={styles.statusBanner}>
          <Ionicons name="checkmark-circle" size={24} color={colors.success} />
          <Text style={styles.statusBannerText}>
            Your application has been accepted!
          </Text>
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

        {/* Shift Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shift Details</Text>
          <View style={styles.infoCard}>
            {[
              { icon: 'calendar-outline', label: 'Date', value: shift?.date },
              { icon: 'time-outline', label: 'Time', value: `${shift?.startTime} - ${shift?.endTime}` },
              { icon: 'location-outline', label: 'Address', value: shift?.address },
              { icon: 'cash-outline', label: 'Pay', value: `₦${shift?.pay?.toLocaleString()}` },
            ].map((item, index) => (
              <View key={index}>
                <View style={styles.infoRow}>
                  <View style={styles.infoIconContainer}>
                    <Ionicons name={item.icon as any} size={18} color={colors.primary} />
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

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="person-outline" size={18} color={colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Contact Person</Text>
                <Text style={styles.infoValue}>{shift?.contactName}</Text>
              </View>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="call-outline" size={18} color={colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>{shift?.contactPhone}</Text>
              </View>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => Alert.alert('Call', `Calling ${shift?.contactPhone}`)}
              >
                <Ionicons name="call" size={16} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Check-in PIN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Check-in PIN</Text>
          <View style={styles.pinCard}>
            <View style={styles.pinHeader}>
              <Ionicons name="key-outline" size={20} color={colors.primary} />
              <Text style={styles.pinHeaderText}>
                Use this PIN to check in at the facility
              </Text>
            </View>
            <View style={styles.pinContainer}>
              {pinRevealed ? (
                <Text style={styles.pinText}>{shift?.checkInPin}</Text>
              ) : (
                <Text style={styles.pinHidden}>••••</Text>
              )}
              <View style={styles.pinActions}>
                <TouchableOpacity
                  style={styles.pinActionButton}
                  onPress={() => setPinRevealed(!pinRevealed)}
                >
                  <Ionicons
                    name={pinRevealed ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.primary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.pinActionButton}
                  onPress={handleCopyPin}
                >
                  <Ionicons name="copy-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.pinNote}>
              ⚠️ Keep this PIN confidential. Only share with the facility coordinator.
            </Text>
          </View>
        </View>

        {/* Important Notice */}
        <View style={styles.noticeCard}>
          <Ionicons name="information-circle-outline" size={20} color={colors.warning} />
          <Text style={styles.noticeText}>
            Please arrive at least 15 minutes before your shift starts. Contact the facility if you need to cancel.
          </Text>
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
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.secondaryLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  statusBannerText: {
    fontSize: typography.sm,
    color: colors.success,
    fontWeight: typography.semiBold,
    flex: 1,
  },
  facilityCard: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
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
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pinHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  pinHeaderText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  pinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  pinText: {
    fontSize: 32,
    fontWeight: typography.bold,
    color: colors.primary,
    letterSpacing: 8,
  },
  pinHidden: {
    fontSize: 32,
    fontWeight: typography.bold,
    color: colors.primary,
    letterSpacing: 8,
  },
  pinActions: {
    flexDirection: 'row',
    gap: 8,
  },
  pinActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinNote: {
    fontSize: typography.xs,
    color: colors.textMuted,
    lineHeight: 18,
  },
  noticeCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    alignItems: 'flex-start',
  },
  noticeText: {
    flex: 1,
    fontSize: typography.sm,
    color: colors.warning,
    lineHeight: 20,
  },
});

export default UpcomingShiftDetailScreen;