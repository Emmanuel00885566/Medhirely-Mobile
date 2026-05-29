import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { applicationsService } from '../../services/applications';
import { useAuth } from '../../context/AuthContext';
import { ApplicationsStackParamList } from '../../navigation/ApplicationsStack';

type NavigationProp = NativeStackNavigationProp<ApplicationsStackParamList, 'ApplicationsList'>;

const TABS = ['Pending', 'Accepted', 'Completed'];

const ApplicationsScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState('Pending');
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const loadApplications = async () => {
    try {
      const status = activeTab.toLowerCase();
      const data = await applicationsService.getMyApplications(
        user?.id || '1',
        status
      );
      setApplications(data);
    } catch (error) {
      console.log('Error loading applications:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      loadApplications();
    }, [activeTab])
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    loadApplications();
  };

  const handleWithdraw = async () => {
    if (!selectedApp) return;
    setIsWithdrawing(true);
    try {
      await applicationsService.withdrawApplication(selectedApp.id);
      setWithdrawModal(false);
      Alert.alert('Success', 'Application withdrawn successfully');
      loadApplications();
    } catch (error) {
      Alert.alert('Error', 'Failed to withdraw application');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return colors.warning;
      case 'accepted': return colors.success;
      case 'completed': return colors.primary;
      case 'rejected': return colors.error;
      default: return colors.textMuted;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'pending': return '#FFF3E0';
      case 'accepted': return colors.secondaryLight;
      case 'completed': return colors.primaryLight;
      case 'rejected': return '#FFF0F0';
      default: return colors.borderLight;
    }
  };

  const renderApplicationCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.facilityIconContainer}>
          <Ionicons name="business-outline" size={22} color={colors.primary} />
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={styles.shiftTitle} numberOfLines={1}>
            {item.shift.title}
          </Text>
          <Text style={styles.facilityName} numberOfLines={1}>
            {item.shift.facility}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusBg(item.status) }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.cardDivider} />

      {/* Card Details */}
      <View style={styles.cardDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={14} color={colors.textMuted} />
          <Text style={styles.detailText} numberOfLines={1}>
            {item.shift.location}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
          <Text style={styles.detailText}>{item.shift.date}</Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={14} color={colors.textMuted} />
          <Text style={styles.detailText}>
            {item.shift.startTime} - {item.shift.endTime}
          </Text>
        </View>
        <Text style={styles.payText}>₦{item.shift.pay.toLocaleString()}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.cardActions}>
        {/* Pending Tab Actions */}
        {activeTab === 'Pending' && (
          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={() => {
              setSelectedApp(item);
              setWithdrawModal(true);
            }}
            activeOpacity={0.85}
          >
            <Ionicons name="close-circle-outline" size={16} color={colors.error} />
            <Text style={styles.withdrawButtonText}>Withdraw</Text>
          </TouchableOpacity>
        )}

        {/* Accepted Tab Actions */}
        {activeTab === 'Accepted' && (
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => navigation.navigate('UpcomingShiftDetail', { applicationId: item.id })}
            activeOpacity={0.85}
          >
            <Text style={styles.viewButtonText}>View Shift Details</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.white} />
          </TouchableOpacity>
        )}

        {/* Completed Tab Actions */}
        {activeTab === 'Completed' && (
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => navigation.navigate('ShiftSummary', { applicationId: item.id })}
            activeOpacity={0.85}
          >
            <Text style={styles.viewButtonText}>View Summary</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.white} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={64} color={colors.border} />
      <Text style={styles.emptyTitle}>No {activeTab} Applications</Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'Pending'
          ? 'You have no pending applications right now'
          : activeTab === 'Accepted'
          ? 'No accepted shifts yet'
          : 'No completed shifts yet'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Applications</Text>
        <Text style={styles.headerSubtitle}>Track all your shift applications</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => {
              setActiveTab(tab);
              setIsLoading(true);
            }}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Applications List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading applications...</Text>
        </View>
      ) : (
        <FlatList
          data={applications}
          renderItem={renderApplicationCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}

      {/* Withdraw Modal */}
      <Modal
        visible={withdrawModal}
        transparent
        animationType="slide"
        onRequestClose={() => setWithdrawModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons
                name="alert-circle-outline"
                size={48}
                color={colors.warning}
              />
            </View>
            <Text style={styles.modalTitle}>Withdraw Application?</Text>
            <Text style={styles.modalSubtitle}>
              Are you sure you want to withdraw your application for{' '}
              <Text style={styles.modalHighlight}>
                {selectedApp?.shift?.title}
              </Text>
              ? This action cannot be undone.
            </Text>

            <TouchableOpacity
              style={[styles.modalWithdrawButton, isWithdrawing && { opacity: 0.7 }]}
              onPress={handleWithdraw}
              disabled={isWithdrawing}
              activeOpacity={0.85}
            >
              {isWithdrawing ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.modalWithdrawButtonText}>
                  Yes, Withdraw
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setWithdrawModal(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.modalCancelButtonText}>No, Keep It</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    fontSize: typography.xxl,
    fontWeight: typography.bold,
    color: colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 16,
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: typography.sm,
    color: colors.textMuted,
    fontWeight: typography.medium,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: typography.bold,
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  facilityIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeaderText: {
    flex: 1,
  },
  shiftTitle: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  facilityName: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: typography.xs,
    fontWeight: typography.bold,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginBottom: 12,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  detailText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  payText: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.primary,
  },
  cardActions: {
    marginTop: 12,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.error,
    backgroundColor: '#FFF0F0',
  },
  withdrawButtonText: {
    fontSize: typography.sm,
    fontWeight: typography.bold,
    color: colors.error,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  viewButtonText: {
    fontSize: typography.sm,
    fontWeight: typography.bold,
    color: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: typography.md,
    color: colors.textSecondary,
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  modalIconContainer: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalHighlight: {
    color: colors.primary,
    fontWeight: typography.semiBold,
  },
  modalWithdrawButton: {
    width: '100%',
    backgroundColor: colors.error,
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalWithdrawButtonText: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.white,
  },
  modalCancelButton: {
    width: '100%',
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: typography.md,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
});

export default ApplicationsScreen;