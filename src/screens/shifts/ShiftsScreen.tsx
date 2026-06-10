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
  Image,
  Modal,
  ScrollView,
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

const TABS = ['For you', 'Current'];
const SPECIALTIES = ['All', 'Nurse', 'Doctor', 'Therapist', 'Technician', 'Other'];
const SHIFT_TYPES = ['All', 'Day Shift', 'Night Shift'];
const PAY_RANGES = [
  { label: 'All', min: 0 },
  { label: '₦10,000+', min: 10000 },
  { label: '₦25,000+', min: 25000 },
  { label: '₦50,000+', min: 50000 },
  { label: '₦100,000+', min: 100000 },
];

const ShiftsScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const [shifts, setShifts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('For you');
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  // Filter states
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedShiftType, setSelectedShiftType] = useState('All');
  const [selectedPayRange, setSelectedPayRange] = useState(0);

  const loadShifts = async () => {
    try {
      const data = await shiftsService.getShifts();
      setShifts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log('Error loading shifts:', error);
      setShifts([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadShifts();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    loadShifts();
  };

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSelectedSpecialty('All');
    setSelectedShiftType('All');
    setSelectedPayRange(0);
  };

  const activeFilterCount = [
    selectedSpecialty !== 'All',
    selectedShiftType !== 'All',
    selectedPayRange > 0,
  ].filter(Boolean).length;

  const filteredShifts = shifts.filter((s) => {
    const matchesSearch = searchQuery
      ? s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.facility.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesSpecialty =
      selectedSpecialty === 'All' ||
      s.specialty?.toLowerCase() === selectedSpecialty.toLowerCase();

    const matchesShiftType =
      selectedShiftType === 'All' || s.shiftType === selectedShiftType;

    const matchesPay = s.payPerShift >= selectedPayRange;

    return matchesSearch && matchesSpecialty && matchesShiftType && matchesPay;
  });

  const renderFilterModal = () => (
    <Modal
      visible={showFilter}
      animationType="slide"
      transparent
      onRequestClose={() => setShowFilter(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Shifts</Text>
            <TouchableOpacity onPress={() => setShowFilter(false)}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Specialty */}
            <Text style={styles.filterSectionTitle}>Specialty</Text>
            <View style={styles.filterChipsRow}>
              {SPECIALTIES.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.filterChip,
                    selectedSpecialty === item && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedSpecialty(item)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedSpecialty === item && styles.filterChipTextActive,
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Shift Type */}
            <Text style={styles.filterSectionTitle}>Shift Type</Text>
            <View style={styles.filterChipsRow}>
              {SHIFT_TYPES.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.filterChip,
                    selectedShiftType === item && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedShiftType(item)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedShiftType === item && styles.filterChipTextActive,
                  ]}>
                    {item === 'Night Shift' ? '🌙 Night Shift' : item === 'Day Shift' ? '☀️ Day Shift' : item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Pay Range */}
            <Text style={styles.filterSectionTitle}>Minimum Pay</Text>
            <View style={styles.filterChipsRow}>
              {PAY_RANGES.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.filterChip,
                    selectedPayRange === item.min && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedPayRange(item.min)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedPayRange === item.min && styles.filterChipTextActive,
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Buttons */}
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearFilters}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyFilterButton}
              onPress={() => setShowFilter(false)}
            >
              <Text style={styles.applyFilterButtonText}>
                Show {filteredShifts.length} Shifts
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderShiftCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.shiftCard}
      onPress={() => navigation.navigate('ShiftDetail', {
        shiftId: item.id,
        shiftData: JSON.stringify(item)
      })}
      activeOpacity={0.85}
    >
      {/* Card Top Row */}
      <View style={styles.cardTopRow}>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.shiftTitle}>{item.title}</Text>
          <Text style={styles.appliedText}>{item.applied} applied</Text>
        </View>
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleBookmark(item.id);
          }}
        >
          <Ionicons
            name={bookmarked.includes(item.id) ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={bookmarked.includes(item.id) ? colors.primary : colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      {/* Pay */}
      <Text style={styles.payText}>
        ₦{item.hourlyRate.toLocaleString()}{' '}
        <Text style={styles.payLabel}>[Hourly]</Text>
      </Text>

      {/* Badges Row */}
      <View style={styles.badgesRow}>
        <View style={styles.expBadge}>
          <Text style={styles.expBadgeText}>{item.requirements[0]}</Text>
        </View>
        <View style={[
          styles.shiftTypeBadge,
          { backgroundColor: item.shiftType === 'Night Shift' ? colors.black : '#FFF9E6' }
        ]}>
          <Text style={styles.shiftTypeIcon}>
            {item.shiftType === 'Night Shift' ? '🌙' : '☀️'}
          </Text>
          <Text style={[
            styles.shiftTypeBadgeText,
            { color: item.shiftType === 'Night Shift' ? colors.white : '#B07D00' }
          ]}>
            {item.shiftType}
          </Text>
        </View>
        <View style={styles.distanceBadge}>
          <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
          <Text style={styles.distanceBadgeText}>{item.distance}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.cardDivider} />

      {/* Facility Row */}
      <View style={styles.facilityRow}>
        <View style={styles.facilityLeft}>
          <Text style={styles.facilityName}>{item.facility}</Text>
          {item.facilityVerified && (
            <Image
              source={require('../../assets/verified.png')}
              style={styles.verifiedIcon}
            />
          )}
        </View>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={(e) => {
            e.stopPropagation();
            navigation.navigate('ShiftDetail', {
              shiftId: item.id,
              shiftData: JSON.stringify(item)
            });
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {/* Rating Row */}
      <View style={styles.ratingRow}>
        <Ionicons name="star" size={14} color="#FFD700" />
        <Text style={styles.ratingText}>
          {item.facilityRating} ({item.facilityReviews} reviews)
        </Text>
      </View>
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
      {renderFilterModal()}

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
          ListHeaderComponent={
            <View>
              {/* Search Bar */}
              <View style={styles.searchBar}>
                <Ionicons name="search-outline" size={18} color={colors.textMuted} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Find your preferences"
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

              {/* User Info */}
              <View style={styles.userInfoRow}>
                <View>
                  <Text style={styles.userSpecialty}>{user?.specialty}</Text>
                  <View style={styles.locationRow}>
                    <Ionicons name="location" size={14} color={colors.textSecondary} />
                    <Text style={styles.locationText}>Nigeria</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.notificationButton}
                  onPress={() => navigation.navigate('Notifications')}
                >
                  <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
                  <View style={styles.notificationDot} />
                </TouchableOpacity>
              </View>

              {/* Tabs + Filter */}
              <View style={styles.tabsRow}>
                <View style={styles.tabs}>
                  {TABS.map((tab) => (
                    <TouchableOpacity
                      key={tab}
                      onPress={() => setActiveTab(tab)}
                      style={styles.tab}
                    >
                      <Text style={[
                        styles.tabText,
                        activeTab === tab && styles.tabTextActive,
                      ]}>
                        {tab}
                      </Text>
                      {activeTab === tab && <View style={styles.tabUnderline} />}
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.filterButton}
                  onPress={() => setShowFilter(true)}
                >
                  <Ionicons name="options-outline" size={22} color={colors.textPrimary} />
                  {activeFilterCount > 0 && (
                    <View style={styles.filterBadge}>
                      <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
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
    gap: 12,
  },
  loadingText: {
    fontSize: typography.md,
    color: colors.textSecondary,
  },
  listContainer: {
    paddingBottom: 120,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingHorizontal: 16,
    height: 48,
    gap: 10,
    marginHorizontal: 16,
    marginTop: 60,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.md,
    color: colors.textPrimary,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  userSpecialty: {
    fontSize: typography.xxl,
    fontFamily: typography.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: typography.md,
    color: colors.textSecondary,
  },
  notificationButton: {
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
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabs: {
    flexDirection: 'row',
    gap: 24,
  },
  tab: {
    paddingBottom: 12,
    position: 'relative',
  },
  tabText: {
    fontSize: typography.md,
    color: colors.textMuted,
    fontFamily: typography.medium,
  },
  tabTextActive: {
    color: colors.primary,
    fontFamily: typography.bold,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  filterButton: {
    paddingBottom: 12,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    color: colors.white,
    fontFamily: typography.bold,
  },
  shiftCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  shiftTitle: {
    fontSize: typography.lg,
    fontFamily: typography.bold,
    color: colors.textPrimary,
  },
  appliedText: {
    fontSize: typography.sm,
    color: colors.textMuted,
  },
  bookmarkButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payText: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.primary,
    marginBottom: 12,
  },
  payLabel: {
    fontFamily: typography.regular,
    color: colors.textSecondary,
    fontSize: typography.sm,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  expBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  expBadgeText: {
    fontSize: typography.xs,
    color: colors.textPrimary,
    fontFamily: typography.medium,
  },
  shiftTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  shiftTypeIcon: {
    fontSize: 12,
  },
  shiftTypeBadgeText: {
    fontSize: typography.xs,
    fontFamily: typography.medium,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  distanceBadgeText: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    fontFamily: typography.medium,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginBottom: 12,
  },
  facilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  facilityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  facilityName: {
    fontSize: typography.md,
    fontFamily: typography.semiBold,
    color: colors.textPrimary,
    flex: 1,
  },
  verifiedIcon: {
    width: 40,
    height: 40,
  },
  applyButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  applyButtonText: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.white,
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
  },

  // Filter Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: typography.xl,
    fontFamily: typography.bold,
    color: colors.textPrimary,
  },
  filterSectionTitle: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.textPrimary,
    marginBottom: 12,
    marginTop: 8,
  },
  filterChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  filterChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  filterChipText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontFamily: typography.medium,
  },
  filterChipTextActive: {
    color: colors.primary,
    fontFamily: typography.bold,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  clearButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: typography.md,
    color: colors.textSecondary,
    fontFamily: typography.medium,
  },
  applyFilterButton: {
    flex: 2,
    height: 50,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  applyFilterButtonText: {
    fontSize: typography.md,
    fontFamily: typography.bold,
    color: colors.white,
  },
});

export default ShiftsScreen;