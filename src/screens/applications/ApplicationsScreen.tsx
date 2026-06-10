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
import { navigateToNotifications } from '../../utils/navigation';

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
    // ✅ Remove from list immediately without refetching
    setApplications((prev) =>
      prev.filter((app) => app.id !== selectedApp.id)
    );
    setWithdrawModal(false);
    Alert.alert('Success', 'Application withdrawn successfully');
  } catch (error) {
    Alert.alert('Error', 'Failed to withdraw application');
  } finally {
    setIsWithdrawing(false);
  }
};

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { color: colors.warning, bg: '#FFF3E0', label: 'PENDING' };
      case 'accepted':
        return { color: colors.success, bg: colors.secondaryLight, label: 'ACCEPTED' };
      case 'completed':
        return { color: colors.primary, bg: colors.primaryLight, label: 'COMPLETED' };
      case 'rejected':
        return { color: colors.error, bg: '#FFF0F0', label: 'REJECTED' };
      default:
        return { color: colors.textMuted, bg: colors.borderLight, label: status.toUpperCase() };
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `Applied ${days}d ago`;
    if (hours > 0) return `Applied ${hours}h ago`;
    return 'Applied just now';
  };

  const renderApplicationCard = ({ item }: { item: any }) => {
    const config = getStatusConfig(item.status);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          if (activeTab === 'Accepted') {
            navigation.navigate('UpcomingShiftDetail', { applicationId: item.id });
          } else if (activeTab === 'Completed') {
            navigation.navigate('ShiftSummary', { applicationId: item.id });
          }
        }}
        activeOpacity={0.85}
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.facilityIconContainer}>
            <Ionicons name="add" size={20} color={colors.white} />
          </View>
          <View style={styles.cardHeaderText}>
            <View style={styles.titleRow}>
              <Text style={styles.facilityName} numberOfLines={1}>
                {item.shift.facility}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                <Text style={[styles.statusText, { color: config.color }]}>
                  {config.label}
                </Text>
              </View>
            </View>
            <Text style={styles.roleText}>{item.shift.title}</Text>
          </View>
        </View>

        {/* Shift Info */}
        <View style={styles.shiftInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
            <Text style={styles.infoText}>{item.shift.date}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={14} color={colors.textMuted} />
            <Text style={styles.infoText}>
              {item.shift.startTime} - {item.shift.endTime}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={14} color={colors.textMuted} />
            <Text style={styles.infoText}>{item.shift.location}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <Text style={styles.timeAgoText}>{formatTimeAgo(item.appliedAt)}</Text>

          {activeTab === 'Pending' && (
            <TouchableOpacity
              style={styles.withdrawButton}
              onPress={() => {
                setSelectedApp(item);
                setWithdrawModal(true);
              }}
            >
              <Text style={styles.withdrawButtonText}>Withdraw</Text>
            </TouchableOpacity>
          )}

          {activeTab === 'Accepted' && (
            <View style={styles.chevronContainer}>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </View>
          )}

          {activeTab === 'Completed' && (
            <View style={styles.chevronContainer}>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.headerTitle}>Applications</Text>
        <TouchableOpacity style={styles.bellButton}
        onPress={navigateToNotifications}
        >
          <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
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
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.tabTextActive,
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Applications List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
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
              <Ionicons name="alert-circle-outline" size={48} color={colors.warning} />
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
                <Text style={styles.modalWithdrawButtonText}>Yes, Withdraw</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: typography.xxl,
    fontFamily: typography.bold,
    color: colors.textPrimary,
  },
  bellButton: {
    position: 'relative',
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: typography.sm,
    color: colors.textMuted,
    fontFamily: typography.medium,
  },
  tabTextActive: {
    color: colors.white,
    fontFamily: typography.bold,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  facilityIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeaderText: {
    flex: 1,
  },
  titleRow: {
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: typography.xs,
    fontFamily: typography.bold,
  },
  roleText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  shiftInfo: {
    gap: 6,
    marginBottom: 12,
    paddingLeft: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 12,
  },
  timeAgoText: {
    fontSize: typography.sm,
    color: colors.textMuted,
  },
  withdrawButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error,
  },
  withdrawButtonText: {
    fontSize: typography.sm,
    color: colors.error,
    fontFamily: typography.medium,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontFamily: typography.bold,
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
    fontFamily: typography.semiBold,
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
    fontFamily: typography.bold,
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
    fontFamily: typography.medium,
  },
});

export default ApplicationsScreen;