import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
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

const FIGMA_TEAL = '#21AA8F';

const ReviewDetailScreen = ({ route }: any) => {
  const initialBookingData = route?.params?.bookingData || {};
  const booking_id = route?.params?.booking_id;

  const [apiData, setApiData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (Object.keys(initialBookingData).length === 0 && booking_id) {
      fetchBookingDetails();
    }
  }, [booking_id]);

  const fetchBookingDetails = async () => {
    try {
      setIsLoading(true);
      const formattedId = `O${booking_id}`;
      const response = await getBookingDetailsApi(formattedId);
      setApiData(response?.data || response);
    } catch (error) {
      console.error('Failed to fetch booking details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const bookingData = Object.keys(initialBookingData).length > 0 ? initialBookingData : apiData || {};

  const {
    guest,
    property,
    guest_property_ratings,
    payment_breakdown,
    tasks,
    cancellation_policy
  } = bookingData;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={FIGMA_TEAL} />
      </View>
    );
  }
  console.log('****property***', property)

  const cleanliness = Number(guest_property_ratings.cleanliness) || 0;
  const accuracy = Number(guest_property_ratings.accuracy) || 0;
  const communication = Number(guest_property_ratings.communication) || 0;
  const location = Number(guest_property_ratings.location) || 0;
  const checkin = Number(guest_property_ratings.checkin) || 0;
  const value = Number(guest_property_ratings.value) || 0;

  const ratingValues = [
    cleanliness,
    accuracy,
    communication,
    location,
    checkin,
    value,
  ].filter(val => val > 0); // Only average the ones that have actual values

  // 3. Calculate Overall
  const overallRating = ratingValues.length > 0 
    ? (ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(1) 
    : '0.0';

  // 4. Mapping for the UI loop
  const ratingItems = [
    { label: 'Overall Rating', value: overallRating, icon: 'overallRating' },
    { label: 'Cleanliness', value: cleanliness, icon: 'starIcon' },
    { label: 'Accuracy', value: accuracy, icon: 'starIcon' },
    { label: 'Communication', value: communication, icon: 'starIcon' },
    { label: 'Location', value: location, icon: 'starIcon' },
    { label: 'Check-in', value: checkin, icon: 'starIcon' },
    { label: 'Value', value: value, icon: 'starIcon' },
  ];
  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Title Heading */}
        <AppText text={guest?.name || 'Guest Details'} type="Bold" fontSize={28} mb={vs(20)} color={Colors.BLACK} />

        {/* 1. Guest Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AppText text="Guest Details" type="Bold" fontSize={18} color={Colors.BLACK} />
            <View style={styles.iconCircle}>
              {/* Top right profile icon circle */}
              <Svgicons path="userIcon" size={24} />
            </View>
          </View>
          
          {/* Guest Email Row */}
          <View style={styles.guestInfoRow}>
            <View style={styles.rowIconContainer}>
              <Svgicons path="guestEmail" size={30} />
            </View>
            <View style={styles.infoContent}>
              <AppText text="Guest Email" fontSize={13} color={Colors.BLACK} type="Medium" />
              <AppText text={guest?.email || 'N/A'} fontSize={13} color={Colors.DARK_CHARCOAL} />
            </View>
          </View>

          {/* Guest Contact Row */}
          <View style={styles.guestInfoRow}>
            <View style={styles.rowIconContainer}>
              <Svgicons path="guestContact" size={30} />
            </View>
            <View style={styles.infoContent}>
              <AppText text="Guest Contact" fontSize={13} color={Colors.BLACK} type="Medium" />
              <AppText text={guest?.contact || 'N/A'} fontSize={13} color={Colors.DARK_CHARCOAL} />
            </View>
          </View>

          {/* Guest Rating Row (Conditional) */}
          {property?.booking_platform !== 'host_booking' && (
            <View style={styles.guestInfoRow}>
              <View style={styles.rowIconContainer}>
                <Svgicons path="guestRating" size={30} />
              </View>
              <View style={styles.infoContent}>
                <AppText text="Guest Rating" fontSize={13} color={Colors.BLACK} type="Medium" mb={2} />
                <View style={styles.starRow}>
                  <AppText text={`${guest?.rating || '0'}/5 `} fontSize={13} type="Bold" mr={8} color={Colors.DARK_CHARCOAL} />
                  {[1, 2, 3, 4, 5].map(s => (
                    <Svgicons 
                      key={s} 
                      path={s <= (guest?.rating || 0) ? 'reviewStarIcon' : 'reviewStartUnfilledIcon'} 
                      size={14} 
                      fill={s <= (guest?.rating || 0) ? Colors.BOTTLE_GREEN : Colors.ARGENT} 
                      mr={4} 
                    />
                  ))}
                </View>
              </View>
            </View>
          )} 
        </View>
        

        {/* 2. Check-in/Out Grid Card */}
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

        {/* 3. Property Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <AppText text="Property Details" type="Bold" fontSize={18} mb={6} />
              <AppText text={property?.name || 'N/A'} type="Medium" color={Colors.BLACK} fontSize={14} />
              <AppText text={property?.address || 'N/A'} type="Medium" fontSize={14} color={Colors.DARK_CHARCOAL} mt={8} />
            </View>
            <View style={styles.iconCircle}>
              <Svgicons path="homeIcon" size={20} />
            </View>
          </View>
        </View>

        {/* 9. Booking Platform Card */}
        {property?.booking_platform !== 'host_booking' && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <AppText 
                    text={`${
                      property?.booking_platform === 'host_booking' 
                        ? 'Livedin' 
                        : property?.booking_platform 
                          ? property.booking_platform.charAt(0).toUpperCase() + property.booking_platform.slice(1)
                          : 'N/A'
                    } Booking Code`} 
                    type="Bold" 
                    fontSize={16} 
                    mb={4}
                  />
                <AppText text={property?.confirmation_code || 'N/A'} fontSize={14} color={Colors.BLACK} />
              </View>
              <View style={styles.iconCircle}>
                <Svgicons path="bookingCode" size={18} />
              </View>
            </View>
          </View>
        )}

        {/* 5. Booking Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AppText text="Booking Details" type="Bold" fontSize={18} color={Colors.BLACK} />
            <View style={styles.iconCircle}>
              <Svgicons 
                path={
                  property?.booking_platform === 'host_booking' 
                    ? 'livedinLogo' 
                    : property?.booking_platform === 'airbnb' 
                    ? 'airbnb' 
                    : property?.booking_platform === 'gathern' 
                    ? 'gathern' 
                    : 'homeIcon'
                } 
                size={20} 
              />
            </View>
          </View>

          <View style={styles.bookingInfoContainer}>
            {/* Date of Reservation */}
            <View style={styles.bookingRow}>
              <AppText text="Date Of Reservation" fontSize={14} color={Colors.BLACK} />
              <AppText 
                text={formatDateDisplay(property?.created_at)} 
                fontSize={13} 
                color={Colors.DARK_CHARCOAL} 
                mt={2} 
              />
            </View>

            {/* Booking Platform */}
            <View style={styles.bookingRow}>
              <AppText text="Booking Platform" fontSize={14} color={Colors.BLACK} />
              <AppText 
                text={property?.booking_platform === 'host_booking' ? 'Livedin' : (property?.booking_platform || 'N/A')} 
                fontSize={13} 
                color={Colors.DARK_CHARCOAL} 
                mt={2} 
              />
            </View>

            {/* Number of Nights */}
            <View style={styles.bookingRow}>
              <AppText text="Number Of Nights" fontSize={14} color={Colors.BLACK} />
              <AppText 
                text={property?.number_of_nights ? `${property.number_of_nights} Nights` : 'N/A'} 
                fontSize={13} 
                color={Colors.DARK_CHARCOAL} 
                mt={2} 
              />
            </View>

            {/* Number of Guests */}
            <View style={styles.bookingRow}>
              <AppText text="Number Of Guests" fontSize={14} color={Colors.BLACK} />
              <AppText 
                text={property?.number_of_guests ? `${property.number_of_guests} Guests` : 'N/A'} 
                fontSize={13} 
                color={Colors.DARK_CHARCOAL} 
                mt={2} 
              />
            </View>

            {/* Door Code */}
            <View style={styles.bookingRow}>
              <AppText text="Door Code" fontSize={14} color={Colors.BLACK} />
              <AppText 
                text={property?.door_code || 'N/A'} 
                fontSize={13} 
                color={Colors.DARK_CHARCOAL} 
                mt={2} 
              />
            </View>
          </View>
        </View>

        {/* 10. AI Chat Summary */}
        {property?.booking_platform !== 'host_booking' && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <AppText text="AI Chat Summary" type="Bold" fontSize={18} />
              <View style={[styles.iconCircle, { backgroundColor: '#F0F7F6' }]}>
                <Svgicons path="aiChat" size={20} />
              </View>
            </View>
            <AppText 
              text={guest?.ai_chat_summary || 'No chat summary available.'} 
              fontSize={13} color={Colors.BLACK} lineHeight={20} mt={10} opacity={0.7}
            />
            <TouchableOpacity 
              style={styles.continueChatBtn} 
              onPress={() => navigate(NavigationRoutes.APP_STACK.CHAT_DETAIL, {
                conversation_id: guest?.conversation_id,
                listing_id: guest?.listing_id
              })}
            >
              <AppText text="Continue Chat" type="Bold" fontSize={14} color={Colors.BLACK} />
            </TouchableOpacity>
          </View>
        )}

        {/* 8. Guest Property Ratings Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AppText text="Guest Property Ratings" type="Bold" fontSize={18} color={Colors.BLACK} />
            <View style={styles.iconCircle}>
              <Svgicons path="identityCard" size={20} />
            </View>
          </View>

          <View style={styles.ratingContent}>
            <View style={styles.ratingRow}>
              <View style={styles.rowIconContainer}>
                <Svgicons path="overallRating" size={30} />
              </View>
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

            {showDetails && (
              <View style={{ marginTop: vs(10) }}>
                {ratingItems.filter(item => item.label !== 'Overall Rating').map((item, index) => (
                  <View key={index} style={[styles.ratingRow, { marginTop: vs(12) }]}>
                    <View style={styles.rowIconContainer}>
                      <Svgicons path={item.icon as any} size={18} />
                    </View>
                    <View style={styles.progressContainer}>
                      <AppText text={item.label} fontSize={14} color={Colors.BLACK} type="Medium" mb={vs(5)} />
                      <View style={styles.barWrapper}>
                        <View style={styles.progressBarBg}>
                          <View style={[styles.progressBarFill, { width: `${(Number(item.value) / 5) * 100}%` }]} />
                        </View>
                        <AppText text={item.value.toString()} fontSize={14} type="Bold" color={Colors.BLACK} ml={s(10)} />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Buttons Row */}
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.halfBtn, styles.viewDetailsBtn]}
                onPress={() => setShowDetails(!showDetails)} // Toggles the details
              >
                <AppText 
                  text={showDetails ? "Hide Details" : "View Details"} 
                  type="Medium" 
                  fontSize={14} 
                  color={Colors.BLACK} 
                />
              </TouchableOpacity>

              <AppButton 
                title="Rate Your Guest" 
                style={[styles.halfBtn, styles.rateGuestBtn]}
                backgroundColor={Colors.PRIMARY_TEAL} 
                color={Colors.WHITE} 
                borderRadius={100} 
                onPress={() => navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_GUEST_RATE_SCREEN)}
              />
            </View>
          </View>
        </View>

        {/* 5. Base Price Card */}
        {property?.booking_platform === 'host_booking' && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <AppText text="Base Price" type="Bold" fontSize={18} color={Colors.BLACK} />
              <View style={styles.iconCircle}>
                <Svgicons path="baseprice" size={20} />
              </View>
            </View>
            <AppText text={'SAR' + payment_breakdown?.booking_cost} fontSize={14} color={Colors.DARK_CHARCOAL} />
          </View>
        )}

        {/* 7. Payment Breakdown (Restored ALL 6 keys from original code) */}
        {property?.booking_platform !== 'host_booking' && (
          <View style={[styles.card, { paddingBottom: vs(10) }]}>
            <View style={styles.cardHeader}>
                <AppText text="Payment Breakdown" type="Bold" fontSize={18} />
                <View style={styles.iconCircle}>
                  <Svgicons path="paymentIconNew" size={80} />
                </View>
            </View>
            <View style={styles.paymentGrid}>
                {[
                  { label: 'Platform Fee:', value: payment_breakdown?.booking_platform_fee },
                  { label: 'Booking Cost:', value: payment_breakdown?.booking_cost },
                  { label: 'Paid Amount:', value: payment_breakdown?.guest_paid_amount },
                  { label: 'Remaining Due:', value: payment_breakdown?.remaining_dues },
                  { label: 'Host Share:', value: payment_breakdown?.host_share },
                  { label: 'OTA Share:', value: payment_breakdown?.ota_share },
                ].map((item, index) => (
                  <View key={index} style={styles.paymentItem}>
                    <AppText text={item.label} fontSize={12} color={Colors.BLACK} mb={2} />
                    <AppText text={`SAR ${item.value || '0.00'}`} fontSize={14} type="Bold" />
                  </View>
                ))}
            </View>
          </View>
        )}

        {/* 8. Assigned Task Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AppText text="Assigned Task" type="Bold" fontSize={18} color={Colors.BLACK} />
            <View style={styles.iconCircle}>
              <Svgicons path="assignTaskNew" size={80} />
            </View>
          </View>

          <View style={styles.taskContent}>
            {/* Mapping through tasks array from API */}
            {tasks && tasks.length > 0 ? (
              tasks.map((item: any, index: number) => (
                <View 
                  key={item.id || index} 
                  style={[
                    styles.taskItemWrapper, 
                    index !== 0 && { marginTop: vs(20), borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: vs(15) }
                  ]}
                >
                  {/* Task Title */}
                  <AppText text={item.title || 'N/A'} type="Bold" fontSize={15} color={Colors.BLACK} mb={vs(8)} />
                  
                  {/* Task Address (Fallback to listing_title if address is null) */}
                  <AppText 
                    text={item.property_address || item.listing_title || 'N/A'} 
                    fontSize={14} 
                    color={Colors.DARK_CHARCOAL} 
                    lineHeight={20}
                    mb={vs(15)} 
                  />

                  {/* Assigned Person */}
                  <View style={styles.taskMetaRow}>
                    <Svgicons path="userIcon" size={16} mr={s(8)} fill={Colors.DARK_CHARCOAL} />
                    <AppText 
                      text={`Assigned to ${item.assigned_user_name || 'Unassigned'}`} 
                      fontSize={13} 
                      color={Colors.DARK_CHARCOAL} 
                    />
                  </View>

                  {/* Task Date (Using our date formatter) */}
                  <View style={styles.taskMetaRow}>
                    <Svgicons path="calendar" size={16} mr={s(8)} fill={Colors.DARK_CHARCOAL} />
                    <AppText 
                      text={`Date: ${formatDateDisplay(item.assign_datetime)}`} 
                      fontSize={13} 
                      color={Colors.DARK_CHARCOAL} 
                    />
                  </View>
                </View>
              ))
            ) : (
              <AppText text="No tasks assigned" fontSize={14} color={Colors.DARK_CHARCOAL} textAlign="center" my={vs(10)} />
            )}

            {/* Create New Task Button */}
            <AppButton
              title="Create New Task"
              borderColor={Colors.SMOOTH_GREY}
              mt={30}
              borderRadius={25}
              textStyle={{ color: Colors.PINE_FOREST }}
              onPress={() => navigate(NavigationRoutes.APP_STACK.CREATE_TASK)}
            />
          </View>
        </View>

      {property?.booking_platform !== 'host_booking' && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.headerTextContainer}>
              <AppText text="Cancellation Policy" type="Bold" fontSize={18} color={Colors.BLACK} />
              <AppText 
                text={
                  cancellation_policy 
                    ? cancellation_policy.charAt(0).toUpperCase() + cancellation_policy.slice(1) 
                    : 'N/A'
                } 
                fontSize={14} 
                color={Colors.DARK_CHARCOAL} 
              />
            </View>
            <View style={styles.iconCircle}>
              <Svgicons path="infoIcon" size={20} />
            </View>
          </View>
        </View>
      )}

        
        {property?.booking_platform === 'host_booking' && (
          <AppButton 
            title="Rate Your Guest" 
            backgroundColor={Colors.PRIMARY_TEAL} 
            color={Colors.WHITE} 
            borderRadius={100} 
            mt={vs(10)} 
            mb={vs(40)} 
            onPress={() => navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_GUEST_RATE_SCREEN)}
          />
        )}
      </ScrollView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.WHITE },
  scrollContent: { paddingHorizontal: s(20), paddingTop: vs(20) },
  card: {
    borderRadius: ms(24),
    padding: ms(20),
    marginBottom: vs(15),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: vs(12) 
  },
  iconCircle: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: '#E8F3F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoContent: { flex: 1 },
  starRow: { flexDirection: 'row', alignItems: 'center' },
  gridRow: { flexDirection: 'row' },
  gridItem: { flex: 1 },
  vDivider: { width: 1, backgroundColor: '#E0E0E0', marginHorizontal: s(15) },
  hSpacer: { height: vs(15) },
  continueChatBtn: {
    marginTop: vs(20),
    height: vs(48),
    borderRadius: ms(24),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  paymentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  paymentItem: {
    width: '48%',
    marginBottom: vs(15),
  },
  bookingInfoContainer: {
    marginTop: vs(5),
  },
  bookingRow: {
    marginBottom: vs(15),
  },
  taskContent: {
    marginTop: vs(5),
  },
  taskItemWrapper: {
    width: '100%',
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  createTaskBtn: {
    marginTop: vs(20),
    height: vs(48),
    borderRadius: ms(24),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  guestInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(15),
  },
  rowIconContainer: {
    width: ms(45),
    height: ms(45),
    borderRadius: ms(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: s(12),
  },
  ratingContent: {
    marginTop: vs(5),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(20),
  },
  progressContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  ratingTextRow: {
    marginBottom: vs(5),
  },
  barWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBg: {
    flex: 1,
    height: vs(6),
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#21AA8F', // Figma Teal
    borderRadius: 3,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(10),
  },
  halfBtn: {
    width: '48%',
    height: vs(45),
    borderRadius: ms(22.5),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  viewDetailsBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderColor: '#E0E0E0',
  },
  rateGuestBtn: {
    backgroundColor: '#21AA8F', // Figma Teal
    borderColor: '#21AA8F',
  },
});

export default ReviewDetailScreen;
