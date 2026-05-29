import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { notificationsService } from '../../services/notifications';

const getNotificationIcon = (type: string): keyof typeof Ionicons.glyphMap => {
  switch (type) {
    case 'application_accepted': return 'checkmark-circle';
    case 'application_rejected': return 'close-circle';
    case 'verification_approved': return 'shield-checkmark';
    case 'document_rejected': return 'alert-circle';
    case 'payment_released': return 'wallet';
    case 'shift_reminder': return 'time';
    case 'new_shift_available': return 'briefcase';
    case 'application_withdrawn': return 'remove-circle';
    default: return 'notifications';
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'application_accepted': return colors.success;
    case 'application_rejected': return colors.error;
    case 'verification_approved': return colors.success;
    case 'document_rejected': return colors.warning;
    case 'payment_released': return colors.primary;
    case 'shift_reminder': return colors.warning;
    case 'new_shift_available': return colors.primary;
    case 'application_withdrawn': return colors.textMuted;
    default: return colors.primary;
  }
};

const getNotificationBg = (type: string) => {
  switch (type) {
    case 'application_accepted': return colors.secondaryLight;
    case 'application_rejected': return '#FFF0F0';
    case 'verification_approved': return colors.secondaryLight;
    case 'document_rejected': return '#FFF3E0';
    case 'payment_released': return colors.primaryLight;
    case 'shift_reminder': return '#FFF3E0';
    case 'new_shift_available': return colors.primaryLight;
    case 'application_withdrawn': return colors.borderLight;
    default: return colors.primaryLight;
  }
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async () => {
    try {
      const data = await notificationsService.getNotifications();
      setNotifications(data);
      const count = await notificationsService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.log('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  const handleMarkAsRead = async (id: string) => {
    await notificationsService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = async () => {
    await notificationsService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    loadNotifications();
  };

  const renderNotification = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.read && styles.notificationCardUnread]}
      onPress={() => !item.read && handleMarkAsRead(item.id)}
      activeOpacity={0.85}
    >
      {/* Unread dot */}
      {!item.read && <View style={styles.unreadDot} />}

      {/* Icon */}
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: getNotificationBg(item.type) },
        ]}
      >
        <Ionicons
          name={getNotificationIcon(item.type)}
          size={24}
          color={getNotificationColor(item.type)}
        />
      </View>

      {/* Content */}
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text
            style={[
              styles.notificationTitle,
              !item.read && styles.notificationTitleUnread,
            ]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={styles.notificationTime}>
            {formatTime(item.createdAt)}
          </Text>
        </View>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-outline" size={64} color={colors.border} />
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptySubtitle}>
        You're all caught up! We'll notify you when something new happens.
      </Text>
    </View>
  );

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={styles.headerSubtitle}>
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={handleMarkAllAsRead}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark-done" size={16} color={colors.white} />
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
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
          ListHeaderComponent={
            notifications.length > 0 ? (
              <View>
                {unreadNotifications.length > 0 && (
                  <Text style={styles.sectionLabel}>New</Text>
                )}
              </View>
            ) : null
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  markAllText: {
    fontSize: typography.sm,
    color: colors.white,
    fontWeight: typography.medium,
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100,
  },
  sectionLabel: {
    fontSize: typography.sm,
    fontWeight: typography.bold,
    color: colors.textMuted,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
    position: 'relative',
  },
  notificationCardUnread: {
    borderColor: colors.primaryLight,
    backgroundColor: '#F8FAFF',
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: typography.md,
    fontWeight: typography.medium,
    color: colors.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  notificationTitleUnread: {
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  notificationTime: {
    fontSize: typography.xs,
    color: colors.textMuted,
  },
  notificationMessage: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  separator: {
    height: 10,
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
    paddingHorizontal: 24,
  },
});

export default NotificationsScreen;