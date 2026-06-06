import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { useAuth } from '../../context/AuthContext';
import { ProfileStackParamList } from '../../navigation/ProfileStack';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'ProfileHome'>;

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  const accountItems = [
    {
      id: 'edit',
      title: 'Edit Profile',
      icon: 'person-outline',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      id: 'credentials',
      title: 'Manage Credentials',
      icon: 'document-text-outline',
      onPress: () => navigation.navigate('ManageCredentials'),
    },
    {
      id: 'reviews',
      title: 'Reviews Received',
      icon: 'star-outline',
      onPress: () => navigation.navigate('ReviewsReceived'),
    },
    {
      id: 'availability',
      title: 'Availability & Schedule',
      icon: 'calendar-outline',
      onPress: () => Alert.alert('Coming Soon', 'Availability settings coming soon!'),
    },
  ];

  const settingsItems = [
    {
      id: 'payments',
      title: 'Payment Settings',
      icon: 'wallet-outline',
      onPress: () => Alert.alert('Coming Soon', 'Payment settings coming soon!'),
    },
    {
      id: 'notifications',
      title: 'Notification Settings',
      icon: 'notifications-outline',
      onPress: () => Alert.alert('Coming Soon', 'Notification settings coming soon!'),
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: 'shield-outline',
      onPress: () => Alert.alert('Coming Soon', 'Privacy settings coming soon!'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => Alert.alert('Coming Soon', 'Support coming soon!'),
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      icon: 'document-outline',
      onPress: () => Alert.alert('Coming Soon', 'Terms coming soon!'),
    },
  ];

  const renderMenuItem = (item: any, index: number, total: number) => (
    <View key={item.id}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={item.onPress}
        activeOpacity={0.85}
      >
        <View style={styles.menuIconContainer}>
          <Ionicons name={item.icon} size={20} color={colors.primary} />
        </View>
        <Text style={styles.menuTitle}>{item.title}</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </TouchableOpacity>
      {index < total - 1 && <View style={styles.menuDivider} />}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.bellButton}>
          <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
  {user?.firstName?.charAt(0).toUpperCase() || 'U'}
              </Text>
            <TouchableOpacity style={styles.avatarEditButton}>
              <Ionicons name="camera" size={14} color={colors.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>{user?.firstName} {user?.lastName}</Text>
          <Text style={styles.profileSpecialty}>{user?.specialty}</Text>
        <Text style={styles.profileEmail}>
  {user?.email}
</Text>
          {/* Verification Badge */}
          <View style={[
            styles.verificationBadge,
            { backgroundColor: user?.verified ? colors.secondaryLight : '#FFF3E0' }
          ]}>
            <Ionicons
              name={user?.verified ? 'shield-checkmark' : 'time-outline'}
              size={14}
              color={user?.verified ? colors.success : colors.warning}
            />
            <Text style={[
              styles.verificationText,
              { color: user?.verified ? colors.success : colors.warning }
            ]}>
              {user?.verified ? 'Verified Professional' : 'Pending Verification'}
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>28</Text>
              <Text style={styles.statLabel}>Shifts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>212</Text>
              <Text style={styles.statLabel}>Hours</Text>
            </View>
          </View>
        </View>

        {/* Account Section */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuCard}>
          {accountItems.map((item, index) =>
            renderMenuItem(item, index, accountItems.length)
          )}
        </View>

        {/* Settings Section */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.menuCard}>
          {settingsItems.map((item, index) =>
            renderMenuItem(item, index, settingsItems.length)
          )}
        </View>

        {/* Version */}
        <Text style={styles.versionText}>MedHirely v1.0.0 (MVP)</Text>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
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
  content: {
    paddingHorizontal: 16,
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  avatarText: {
    fontSize: 36,
    fontFamily: typography.bold,
    color: colors.white,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  profileName: {
    fontSize: typography.xl,
    fontFamily: typography.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  profileSpecialty: {
    fontSize: typography.md,
    color: colors.primary,
    fontFamily: typography.medium,
    marginBottom: 12,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  verificationText: {
    fontSize: typography.sm,
    fontFamily: typography.semiBold,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.xl,
    fontFamily: typography.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  sectionTitle: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileEmail: {
  fontSize: typography.sm,
  color: colors.textSecondary,
  marginBottom: 12,
},
  menuTitle: {
    flex: 1,
    fontSize: typography.md,
    color: colors.textPrimary,
    fontFamily: typography.medium,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: 16,
  },
  versionText: {
    fontSize: typography.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 54,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.error,
    backgroundColor: '#FFF0F0',
    marginBottom: 16,
  },
  logoutText: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.error,
  },
});

export default ProfileScreen;