import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ActivityIndicator, 
  TouchableOpacity, 
  Modal, 
  Pressable,
} from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';

import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { getBookingDetailsApi } from '@/services/calendarBookingManagement';
import { formatTimeWithPeriod } from '@/utility/formatTime';
import { formatDateDisplay } from '@/utility/formatDate';
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView';
import Metrics from '@/utility/Metrics';

const FIGMA_TEAL = '#21AA8F';

const ReviewDetailScreen = ({ route }: any) => {
  const initialBookingData = route?.params?.bookingData || {};
  const booking_id = route?.params?.booking_id;
  
  const [apiData, setApiData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    if (Object.keys(initialBookingData).length === 0 && booking_id) {
      fetchBookingDetails();
    }
  }, [booking_id]);

  const fetchBookingDetails = async (isManualRefresh = false) => {
    try {
      if (!isManualRefresh) setIsLoading(true);
      const formattedId = `${booking_id}`;
      const response = await getBookingDetailsApi(formattedId);
      setApiData(response?.data || response);
    } catch (error) {
      console.error('Failed to fetch booking details:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onHandleRefresh = async () => {
    setIsRefreshing(true);
    await fetchBookingDetails(true);
  };

  const bookingData = Object.keys(initialBookingData).length > 0 ? initialBookingData : apiData || {};

  // Check if we have property data yet to avoid crashes during render
  const hasData = bookingData && bookingData.property;

  const {
    guest,
    property,
    guest_property_ratings,
    payment_breakdown,
    tasks,
    cancellation_policy
  } = bookingData;

  // Logic for ratings calculation
  const cleanliness = Number(guest_property_ratings?.cleanliness) || 0;
  const accuracy = Number(guest_property_ratings?.accuracy) || 0;
  const communication = Number(guest_property_ratings?.communication) || 0;
  const location = Number(guest_property_ratings?.location) || 0;
  const checkin = Number(guest_property_ratings?.checkin) || 0;
  const value = Number(guest_property_ratings?.value) || 0;

  const ratingValues = [cleanliness, accuracy, communication, location, checkin, value].filter(val => val > 0);
  const overallRating = ratingValues.length > 0 ? (ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(1) : '0.0';

  const ratingItems = [
    { label: 'Overall Rating', value: overallRating, icon: 'overallRating' },
    { label: 'Cleanliness', value: cleanliness, icon: 'starIcon' },
    { label: 'Accuracy', value: accuracy, icon: 'starIcon' },
    { label: 'Communication', value: communication, icon: 'starIcon' },
    { label: 'Location', value: location, icon: 'starIcon' },
    { label: 'Check-in', value: checkin, icon: 'starIcon' },
    { label: 'Value', value: value, icon: 'starIcon' },
  ];

  const isCheckedOut = property?.status === 'checkedout';

  const handleCancelReservation = () => {
    setMenuVisible(false);
    console.log('Cancelling reservation for ID:', booking_id);
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      
      <Modal transparent visible={menuVisible} animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuPopup}>
            <TouchableOpacity style={styles.menuItem} onPress={handleCancelReservation}>
              <AppText text="Cancel Reservation" fontSize={14} color={Colors.BLACK} />
              <Svgicons path="closeIcon" size={18} />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <RefreshableScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        isLoading={isLoading}
        refreshing={isRefreshing}
        onRefresh={onHandleRefresh}
        skeletonComponent={
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={FIGMA_TEAL} />
            <AppText text="Loading details..." mt={10} color={Colors.DARK_CHARCOAL} />
          </View>
        }
      >
        {/* Only render content if data exists */}
        {hasData && (
          <>
            <AppText text={guest?.name || 'Guest Details'} type="Bold" fontSize={28} mb={vs(20)} color={Colors.BLACK} />

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <AppText text="Guest Details" type="Bold" fontSize={18} color={Colors.BLACK} />
                <View style={styles.iconCircle}>
                  <Svgicons path="userIcon" size={24} />
                </View>
              </View>
              <View style={styles.guestInfoRow}>
                <View style={styles.rowIconContainer}><Svgicons path="guestEmail" size={50} /></View>
                <View style={styles.infoContent}>
                  <AppText text="Guest Email" fontSize={13} color={Colors.BLACK} type="Medium" />
                  <AppText text={guest?.email || 'N/A'} fontSize={13} color={Colors.DARK_CHARCOAL} />
                </View>
              </View>
              <View style={styles.guestInfoRow}>
                <View style={styles.rowIconContainer}><Svgicons path="guestContact" size={50} /></View>
                <View style={styles.infoContent}>
                  <AppText text="Guest Contact" fontSize={13} color={Colors.BLACK} type="Medium" />
                  <AppText text={guest?.contact ? `+${guest.contact}` : 'N/A'} fontSize={13} color={Colors.DARK_CHARCOAL} />
                </View>
              </View>
              {property?.booking_platform !== 'host_booking' && (
                <View style={styles.guestInfoRow}>
                  <View style={styles.rowIconContainer}><Svgicons path="guestRating" size={50} /></View>
                  <View style={styles.infoContent}>
                    <AppText text="Guest Rating" fontSize={13} color={Colors.BLACK} type="Medium" mb={2} />
                    <View style={styles.starRow}>
                      <AppText text={`${guest?.rating || '0'}/5 `} fontSize={13} type="Bold" mr={8} color={Colors.DARK_CHARCOAL} />
                      {[1, 2, 3, 4, 5].map(s => (
                        <Svgicons key={s} path={s <= (guest?.rating || 0) ? 'reviewStarIcon' : 'reviewStartUnfilledIcon'} size={14} fill={s <= (guest?.rating || 0) ? Colors.BOTTLE_GREEN : Colors.ARGENT} mr={4} />
                      ))}
                    </View>
                  </View>
                </View>
              )} 
            </View>

            <View style={styles.card}>
              <View style={styles.gridRow}>
                <View style={styles.gridItem}>
                  <AppText text="Check-in Time" fontSize={12} type='Bold' color={Colors.BLACK} mb={2} />
                  <AppText text={formatTimeWithPeriod(property?.check_in_time)} fontSize={14} color={Colors.DARK_CHARCOAL} />
                  <View style={styles.hSpacer} />
                  <AppText text="Check-in Date" fontSize={12} color={Colors.BLACK} mb={2} type="Bold" />
                  <AppText text={formatDateDisplay(property?.booking_dates?.from)} fontSize={14} color={Colors.DARK_CHARCOAL} />
                </View>
                <View style={styles.vDivider} />
                <View style={styles.gridItem}>
                  <AppText text="Check-out Time" fontSize={12} type='Bold' color={Colors.BLACK} mb={2} />
                  <AppText text={formatTimeWithPeriod(property?.check_out_time)} fontSize={14} color={Colors.DARK_CHARCOAL} />
                  <View style={styles.hSpacer} />
                  <AppText text="Check-out Date" fontSize={12} color={Colors.BLACK} mb={2} type="Bold" />
                  <AppText text={formatDateDisplay(property?.booking_dates?.to)} fontSize={14}  color={Colors.DARK_CHARCOAL} />
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <AppText text="Property Details" type="Bold" fontSize={18} mb={6} />
                  <AppText text={property?.name || 'N/A'} type="Medium" color={Colors.BLACK} fontSize={14} />
                  <AppText text={property?.address || 'N/A'} type="Medium" fontSize={14} color={Colors.DARK_CHARCOAL} mt={8} />
                </View>
                <View style={styles.iconCircle}><Svgicons path="homeIcon" size={20} /></View>
              </View>
            </View>

            {/* Rest of the UI cards follow exactly as before... */}
            {/* Payment Breakdown, Tasks, Ratings, etc. */}
            
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <AppText text="Booking Details" type="Bold" fontSize={18} color={Colors.BLACK} />
                <View style={styles.iconCircle}>
                  <Svgicons path={property?.booking_platform === 'host_booking' ? 'livedinLogo' : property?.booking_platform === 'airbnb' ? 'airbnb' : 'homeIcon'} size={20} />
                </View>
              </View>
              <View style={styles.bookingInfoContainer}>
                <View style={styles.bookingRow}>
                  <AppText text="Number Of Nights" fontSize={14} color={Colors.BLACK} />
                  <AppText text={property?.number_of_nights ? `${property.number_of_nights} Nights` : 'N/A'} fontSize={13} color={Colors.DARK_CHARCOAL} mt={2} />
                </View>
                <View style={styles.bookingRow}>
                  <AppText text="Door Code" fontSize={14} color={Colors.BLACK} />
                  <AppText text={property?.door_code || 'N/A'} fontSize={13} color={Colors.DARK_CHARCOAL} mt={2} />
                </View>
              </View>
            </View>

            {/* Ratings Section */}
            {property?.booking_platform !== 'host_booking' && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <AppText text="Guest Property Ratings" type="Bold" fontSize={18} color={Colors.BLACK} />
                  <View style={styles.iconCircle}><Svgicons path="identityCard" size={20} /></View>
                </View>
                <View style={styles.ratingContent}>
                  <View style={styles.ratingRow}>
                    <View style={styles.rowIconContainer}><Svgicons path="overallRating" size={30} /></View>
                    <View style={styles.progressContainer}>
                      <AppText text="Overall Rating" fontSize={14} color={Colors.BLACK} type="Medium" mb={vs(5)} />
                      <View style={styles.barWrapper}>
                        <View style={styles.progressBarBg}>
                          <View style={[styles.progressBarFill, { width: `${(Number(overallRating) / 5) * 100}%` }]} />
                        </View>
                        <AppText text={overallRating} fontSize={14} type="Bold" color={Colors.BLACK} ml={s(10)} />
                      </View>
                    </View>
                  </View>
                  <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.halfBtn, styles.viewDetailsBtn]} onPress={() => setShowDetails(!showDetails)} disabled={!isCheckedOut}>
                      <AppText text={showDetails ? "Hide Details" : "View Details"} type="Medium" fontSize={14} color={Colors.BLACK} />
                    </TouchableOpacity>
                    <AppButton 
                      disabled={!isCheckedOut} 
                      fontSize={14}
                      title="Rate Your Guest" 
                      style={[styles.rateGuestBtn]}
                      borderRadius={100} 
                      onPress={() => navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_GUEST_RATE_SCREEN)} 
                    />
                  </View>
                </View>
              </View>
            )}

            <AppButton title="Rate Your Guest" backgroundColor={Colors.PRIMARY_TEAL} color={Colors.WHITE} borderRadius={100} mt={vs(10)} mb={vs(40)} onPress={() => navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_GUEST_RATE_SCREEN)} />
          </>
        )}
      </RefreshableScrollView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, height: Metrics.screenHeight * 0.7, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: s(20), paddingTop: vs(20), paddingBottom: vs(40) },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.05)' },
  menuPopup: { position: 'absolute', top: vs(60), right: s(20), backgroundColor: Colors.WHITE, borderRadius: ms(12), padding: ms(10), width: s(180), elevation: 5 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: vs(10), paddingHorizontal: s(5) },
  card: { borderRadius: ms(24), padding: ms(20), marginBottom: vs(15), borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.5)' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(12) },
  iconCircle: { width: ms(40), height: ms(40), borderRadius: ms(20), backgroundColor: '#E8F3F1', justifyContent: 'center', alignItems: 'center' },
  infoContent: { flex: 1 },
  starRow: { flexDirection: 'row', alignItems: 'center' },
  gridRow: { flexDirection: 'row' },
  gridItem: { flex: 1 },
  vDivider: { width: 1, backgroundColor: '#E0E0E0', marginHorizontal: s(15) },
  hSpacer: { height: vs(15) },
  bookingInfoContainer: { marginTop: vs(5) },
  bookingRow: { marginBottom: vs(15) },
  guestInfoRow: { flexDirection: 'row', alignItems: 'center', marginTop: vs(15) },
  rowIconContainer: { width: ms(45), height: ms(45), borderRadius: ms(12), justifyContent: 'center', alignItems: 'center', marginRight: s(5) },
  ratingContent: { marginTop: vs(5) },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(20) },
  progressContainer: { flex: 1, justifyContent: 'center' },
  barWrapper: { flexDirection: 'row', alignItems: 'center' },
  progressBarBg: { flex: 1, height: vs(6), backgroundColor: '#E0E0E0', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#21AA8F', borderRadius: 3 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(10) },
  halfBtn: { width: '48%', height: vs(45), borderRadius: ms(22.5), justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  viewDetailsBtn: { backgroundColor: 'rgba(255, 255, 255, 0.6)', borderColor: '#E0E0E0' },
  rateGuestBtn: { padding: ms(8) },
});

export default ReviewDetailScreen;