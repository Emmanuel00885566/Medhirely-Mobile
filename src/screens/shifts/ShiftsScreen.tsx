import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { shiftsService } from '../../services/shifts';
import { useAuth } from '../../context/AuthContext';
import { ShiftsStackParamList } from '../../navigation/ShiftsStack';

type NavigationProp = NativeStackNavigationProp<ShiftsStackParamList, 'ShiftsFeed'>;

const FILTERS = ['All', 'Nursing', 'Emergency Medicine', 'Pharmacy', 'Critical Care'];

const ShiftsScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const [shifts, setShifts] = useState<any[]>([]);
  const [filteredShifts, setFilteredShifts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const loadShifts = async () => {
    try {
      const data = await shiftsService.getShifts();
      setShifts(data);
      setFilteredShifts(data);
    } catch (error) {
      console.log('Error loading shifts:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadShifts();
  }, []);

  useEffect(() => {
    let result = shifts;
    if (activeFilter !== 'All') {
      result = result.filter((s) => s.specialty === activeFilter);
    }
    if (searchQuery) {
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.facility.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredShifts(result);
  }, [searchQuery, activeFilter, shifts]);

  const onRefresh = () => {
    setIsRefreshing(true);
    loadShifts();
  };

  const getPayColor = (pay: number) => {
    if (pay >= 50000) return colors.success;
    if (pay >= 30000) return colors.warning;
    return colors.primary;
  };

  const renderShiftCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.shiftCard}
      onPress={() => navigation.navigate('ShiftDetail', { shiftId: item.id })}
      activeOpacity={0.85}
    >
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.facilityIconContainer}>
          <Ionicons name="business-outline" size={22} color={colors.primary} />
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={styles.shiftTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.facilityName} numberOfLines={1}>
            {item.facility}
          </Text>
        </View>
        <View style={styles.payBadge}>
          <Text style={[styles.payAmount, { color: getPayColor(item.pay) }]}>
            ₦{item.pay.toLocaleString()}
          </Text>
          <Text style={styles.payLabel}>per shift</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.cardDivider} />

      {/* Card Details */}
      <View style={styles.cardDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={14} color={colors.textMuted} />
          <Text style={styles.detailText} numberOfLines={1}>
            {item.location}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={14} color={colors.textMuted} />
          <Text style={styles.detailText}>
            {item.startTime} - {item.endTime}
          </Text>
        </View>
        <View style={styles.specialtyBadge}>
          <Text style={styles.specialtyText} numberOfLines={1}>
            {item.specialty}
          </Text>
        </View>
      </View>

      {/* Apply Button */}
      <TouchableOpacity
        style={styles.applyButton}
        onPress={() => navigation.navigate('ShiftDetail', { shiftId: item.id })}
        activeOpacity={0.85}
      >
        <Text style={styles.applyButtonText}>View & Apply</Text>
        <Ionicons name="arrow-forward" size={16} color={colors.white} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="briefcase-outline" size={64} color={colors.border} />
      <Text style={styles.emptyTitle}>No shifts found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your search or filters
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hello, {user?.name?.split(' ')[0]} 👋
          </Text>
          <Text style={styles.headerTitle}>Find Your Next Shift</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={22} color={colors.white} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search shifts, facilities..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersWrapper}>
        <FlatList
          data={FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filtersContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                activeFilter === item && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(item)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === item && styles.filterChipTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Results count */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {filteredShifts.length} shift{filteredShifts.length !== 1 ? 's' : ''} available
        </Text>
      </View>

      {/* Shifts List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading shifts...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredShifts}
          renderItem={renderShiftCard}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  greeting: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: typography.xxl,
    fontWeight: typography.bold,
    color: colors.white,
  },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.md,
    color: colors.textPrimary,
  },
  filtersWrapper: {
    marginBottom: 12,
  },
  filtersContainer: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
  filterChipTextActive: {
    color: colors.white,
    fontWeight: typography.bold,
  },
  resultsRow: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  resultsText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  shiftCard: {
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
  payBadge: {
    alignItems: 'flex-end',
  },
  payAmount: {
    fontSize: typography.md,
    fontWeight: typography.bold,
  },
  payLabel: {
    fontSize: typography.xs,
    color: colors.textMuted,
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
  specialtyBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    maxWidth: 140,
  },
  specialtyText: {
    fontSize: typography.xs,
    color: colors.primary,
    fontWeight: typography.medium,
  },
  applyButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  applyButtonText: {
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
  },
});

export default ShiftsScreen;