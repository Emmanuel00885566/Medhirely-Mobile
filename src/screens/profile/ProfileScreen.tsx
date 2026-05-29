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
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 'edit',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      icon: 'person-outline',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      id: 'credentials',
      title: 'Manage Credentials',
      subtitle: 'View and update your documents',
      icon: 'document-text-outline',
      onPress: () => navigation.navigate('ManageCredentials'),
    },
    {
      id: 'reviews',
      title: 'Reviews Received',
      subtitle: 'See feedback from facilities',
      icon: 'star-outline',
      onPress: () => navigation.navigate('ReviewsReceived'),
    },
  ];

  const infoItems = [
    {
      id: 'notifications',
      title: 'Notification Settings',
      subtitle: 'Manage your alerts',
      icon: 'notifications-outline',
      onPress: () => Alert.alert('Coming Soon', 'Notification settings coming soon!'),
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      subtitle: 'Read our privacy policy',
      icon: 'shield-outline',
      onPress: () => Alert.alert('Coming Soon', 'Privacy policy coming soon!'),
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      subtitle: 'Read our terms of service',
      icon: 'document-outline',
      onPress: () => Alert.alert('Coming Soon', 'Terms of service coming soon!'),
    },
    {
      id: 'support',
      title: 'Help & Support',
      subtitle: 'Get help from our team',
      icon: 'help-circle-outline',
      onPress: () => Alert.alert('Coming Soon', 'Support coming soon!'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase()}
            </Text>
            <TouchableOpacity style={styles.avatarEditButton}>
              <Ionicons name="camera" size={14} color={colors.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileSpecialty}>{user?.specialty}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>

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

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Shifts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>
        </View>

        {/* Account Section */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.85}
              >
                <View style={styles.menuIconContainer}>
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
              {index < menuItems.length - 1 && (
                <View style={styles.menuDivider} />
              )}
            </View>
          ))}
        </View>

        {/* Info Section */}
        <Text style={styles.sectionTitle}>Information</Text>
        <View style={styles.menuCard}>
          {infoItems.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.85}
              >
                <View style={styles.menuIconContainer}>
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
              {index < infoItems.length - 1 && (
                <View style={styles.menuDivider} />
              )}
            </View>
          ))}
        </View>

        {/* App Version */}
        <Text style={styles.versionText}>MedHirely v1.0.0 (MVP)</Text>

        {/* Logout Button */}
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
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: typography.bold,
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
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  profileSpecialty: {
    fontSize: typography.md,
    color: colors.primary,
    fontWeight: typography.medium,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: typography.sm,
    color: colors.textSecondary,
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
    fontWeight: typography.semiBold,
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
    fontWeight: typography.bold,
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
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 14,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: typography.md,
    fontWeight: typography.medium,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: 14,
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
    fontWeight: typography.bold,
    color: colors.error,
  },
});

export default ProfileScreen;