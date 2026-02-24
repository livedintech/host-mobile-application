import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, ActivityIndicator } from 'react-native';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { getBookingDetailsApi } from '@/services/calendarBookingManagement';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';

// --- Interface for Task Data ---
interface Task {
  id: number;
  task_id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigned_user_name: string;
  property_address: string;
  listing_title: string;
  date: string;
}

const DetailRow = ({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) => (
  <View style={styles.detailRow}>
    <AppText
      text={label}
      fontSize={15}
      color={Colors.PINE_FOREST}
      type="Medium"
    />
    <AppText
      text={value}
      fontSize={14}
      color={valueColor || Colors.SUPER_GREY}
      type="Medium"
    />
  </View>
);

const ReviewDetailScreen = ({ route }: any) => {
  const initialBookingData = route?.params?.bookingData || {};
  const booking_id = route?.params?.booking_id;

  const [apiData, setApiData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const bookingData =
    Object.keys(initialBookingData).length > 0
      ? initialBookingData
      : apiData || {};

  const {
    guest,
    property,
    guest_property_ratings,
    payment_breakdown,
    tasks = [], // Array of tasks from API
  } = bookingData;

  const RatingBar = ({
    label,
    value,
  }: {
    label: string;
    value: number | null;
  }) => (
    <View style={styles.barRow}>
      <AppText
        text={label}
        fontSize={15}
        color={Colors.PINE_FOREST}
        style={{ flex: 1 }}
        type="Medium"
      />
      <View style={styles.barContainer}>
        <View style={styles.barBg}>
          <View
            style={[styles.barFill, { width: `${((value || 0) / 5) * 100}%` }]}
          />
        </View>
        <AppText
          text={(value || 0).toFixed(1)}
          ml={12}
          type="Bold"
          fontSize={14}
          color={Colors.PINE_FOREST}
        />
      </View>
    </View>
  );

  // --- Task Card Renderer ---
  // --- Task Card Renderer ---
  const renderTaskItem = ({ item }: { item: Task }) => {
    // Extracts the date part only (e.g., 2026-02-21)
    // const formattedDate = item?.assign_datetime ? item.assign_datetime.split('T')[0] : 'N/A';

    return (
      <GradientBorder
        borderRadius={24}
        style={styles.taskGradient}
        borderWidth={1.5}
      >
        <View style={styles.taskInnerCard}>
          <View style={styles.taskHeader}>
            {/* Title */}
            <View style={{ marginBottom: 12 }}>
              <AppText
                text={item.title}
                type="Bold"
                fontSize={18}
                color={Colors.PINE_FOREST}
              />
            </View>

            {/* Description */}
            <View style={styles.rowWrapper}>
              <AppText
                text={'Description: '}
                type="Bold"
                fontSize={16}
                color={Colors.PINE_FOREST}
              />
              <AppText
                text={item.description}
                type="Regular"
                fontSize={16}
                color={Colors.PINE_FOREST}
                style={{ flex: 1 }} // Fixes cutoff: allows text to wrap
              />
            </View>

            {/* Property */}
            <View style={styles.rowWrapper}>
              <AppText
                text={'Property: '}
                type="Bold"
                fontSize={16}
                color={Colors.PINE_FOREST}
              />
              <AppText
                text={item.listing_title}
                type="Regular"
                fontSize={16}
                color={Colors.PINE_FOREST}
                style={{ flex: 1 }} // Fixes cutoff: allows text to wrap
              />
            </View>

            {/* Due Date */}
            {/* <View style={styles.rowWrapper}>
              <AppText text={"Due Date: "} type="Bold" fontSize={16} color={Colors.PINE_FOREST} />
              <AppText text={formattedDate} type="Regular" fontSize={16} color={Colors.PINE_FOREST} />
            </View> */}

            {/* Task Status */}
            <View style={styles.rowWrapper}>
              <AppText
                text={'Task Status: '}
                type="Bold"
                fontSize={16}
                color={Colors.PINE_FOREST}
              />
              <AppText
                text={item.status}
                type="Regular"
                fontSize={16}
                color={
                  item.status === 'todo'
                    ? Colors.ALERT_RED
                    : item.status === 'inprogress'
                      ? Colors.GOLDEN_YELLOW
                      : Colors.TEAL_GREEN
                }
              />
            </View>
          </View>
        </View>
      </GradientBorder>
    );
  };
  // console.log('conversation_id',guest?.conversation_id);

  // --- Main Header UI ---
  const ListHeader = () => (
    <View>
      {/* 1. Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageWrapper}>
          <Image
            source={require('@/assets/img/guestAvatar.png')}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.infoCol}>
          <AppText
            text="Guest Name:"
            fontSize={14}
            color={Colors.PINE_FOREST}
            type="Bold"
            mb={2}
          />
          <AppText
            text={guest?.name || 'N/A'}
            fontSize={16}
            mb={25}
            color={Colors.PINE_FOREST}
            opacity={0.7}
          />

          <AppText
            text="Guest Email:"
            fontSize={14}
            color={Colors.PINE_FOREST}
            type="Bold"
            mb={2}
          />
          <AppText
            text={guest?.email || 'N/A'}
            fontSize={16}
            mb={25}
            color={Colors.PINE_FOREST}
            opacity={0.7}
          />

          <AppText
            text="Guest Contact:"
            fontSize={14}
            color={Colors.PINE_FOREST}
            type="Bold"
            mb={2}
          />
          <AppText
            text={guest?.contact || 'N/A'}
            fontSize={16}
            mb={25}
            color={Colors.PINE_FOREST}
            opacity={0.7}
          />

          <AppText
            text="Guest Rating"
            fontSize={14}
            color={Colors.PINE_FOREST}
            type="Bold"
            mb={6}
          />
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map(s => (
              <Svgicons
                key={s}
                path={
                  s <= (guest?.rating || 0)
                    ? 'reviewStarIcon'
                    : 'reviewStartUnfilledIcon'
                }
                size={26}
                fill={
                  s <= (guest?.rating || 0)
                    ? Colors.BOTTLE_GREEN
                    : Colors.ARGENT
                }
                mr={6}
              />
            ))}
            <AppText
              text={`${guest?.rating || 0}/5`}
              fontSize={18}
              ml={10}
              color={Colors.SUPER_GREY}
              type="Medium"
            />
          </View>
        </View>
      </View>

      {/* 2. AI Chat Summary */}
      {property?.booking_platform === 'airbnb' && (
        guest?.conversation_id && (
          <View style={styles.section}>
            <View style={styles.headingRowCenter}>
              <Svgicons path="sparkleIcon" size={24} mr={8} />
              <AppText
                text="AI Chat Summary"
                type="Medium"
                fontSize={22}
                color={Colors.PINE_FOREST}
              />
            </View>
            <AppText
              text={guest?.ai_chat_summary || 'No chat summary available.'}
              fontSize={15}
              color={Colors.PINE_FOREST}
              opacity={0.7}
              textAlign="center"
              lineHeight={24}
            />
            <View style={styles.chatActionRow}>
              <ButtonView style={styles.chatBtn} onPress={() => {
                navigate(NavigationRoutes.APP_STACK.CHAT_DETAIL, {
                  conversation_id: guest?.conversation_id,
                  listing_id: guest?.listing_id
                });
              }}>
                <AppText
                  text="Continue Chat"
                  color={Colors.PINE_FOREST}
                  fontSize={14}
                  type="Medium"
                  style={{ textAlign: 'center' }}
                />
              </ButtonView>
            </View>
          </View>
        )

      )}


      {/* 3. Property Details */}
      <View style={styles.section}>
        <View style={styles.headingRow}>
          <Svgicons path="homeIcon" size={22} mr={8} />
          <AppText
            text="Property Details"
            type="Bold"
            fontSize={22}
            color={Colors.PINE_FOREST}
          />
        </View>
        <GradientBorder borderRadius={24} style={styles.gradientWrapper}>
          <View style={styles.innerCard}>
            <DetailRow
              label="Booking Platform:"
              value={
                property?.booking_platform === 'host_booking'
                  ? 'Livedin'
                  : property?.booking_platform || 'N/A'
              }
            />
            <DetailRow
              label="Number of Guests:"
              value={property?.number_of_guests || 'N/A'}
            />
            <DetailRow
              label="Number of Nights:"
              value={String(property?.number_of_nights || '0')}
            />
            <View style={styles.verticalSpacer} />
            <DetailRow
              label="Check-in Time:"
              value={property?.check_in_time || 'N/A'}
            />
            <DetailRow
              label="Check-out Time:"
              value={property?.check_out_time || 'N/A'}
            />
            <DetailRow
              label="Confirmation Code:"
              value={property?.confirmation_code || 'N/A'}
            />
            <View style={styles.verticalSpacer} />
            <DetailRow
              label="Door Code:"
              value={property?.door_code || 'N/A'}
            />
            {property?.booking_platform === 'airbnb' ? (
              <DetailRow
                label="Payment Status: "
                value={'Verified'}
                valueColor={Colors.BOTTLE_GREEN}
              />
            ) : (
              <DetailRow
                label="Payment Status: "
                value={
                  property?.payment_status?.replace('_', ' ').toUpperCase() ||
                  'N/A'
                }
                valueColor={
                  property?.payment_status === 'payment_unverified'
                    ? Colors.AIRBNB_RED
                    : Colors.BOTTLE_GREEN
                }
              />
            )}
            {/* <DetailRow
              label="Payment Status: "
              value={
                property?.payment_status?.replace('_', ' ').toUpperCase() ||
                'N/A'
              }
              valueColor={
                property?.payment_status === 'payment_unverified'
                  ? Colors.AIRBNB_RED
                  : Colors.BOTTLE_GREEN 
              }
            /> */}
          </View>
        </GradientBorder>
      </View>

      {/* 4. Guest Property Ratings */}
      <View style={styles.section}>
        <GradientBorder borderRadius={24} style={styles.gradientWrapper}>
          <View style={styles.innerCard}>
            <AppText
              text="Guest Property Ratings"
              type="Bold"
              fontSize={22}
              mb={25}
              color={Colors.PINE_FOREST}
            />
            <RatingBar
              label="Cleanliness"
              value={guest_property_ratings?.cleanliness}
            />
            <RatingBar
              label="Accuracy"
              value={guest_property_ratings?.accuracy}
            />
            <RatingBar
              label="Communication"
              value={guest_property_ratings?.communication}
            />
            <RatingBar
              label="Location"
              value={guest_property_ratings?.location}
            />
            <RatingBar
              label="Check-in"
              value={guest_property_ratings?.checkin}
            />
            <RatingBar label="Value" value={guest_property_ratings?.value} />
          </View>
        </GradientBorder>
      </View>

      {/* 5. Cancellation Policy & Action */}
      <View style={styles.section}>
        <AppButton
          title="Rate Your Guest"
          backgroundColor={Colors.WHITE}
          color={Colors.PINE_FOREST}
          borderColor={Colors.SMOOTH_GREY}
          mt={10}
          mb={30}
          borderRadius={25}
          onPress={() =>
            navigate(
              NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_GUEST_RATE_SCREEN,
            )
          }
        />
        <View style={styles.cancellationPolicy}>
          <AppText
            text="Cancellation policy"
            type="Medium"
            fontSize={16}
            color={Colors.JET_BLACK}
          />
          <AppText
            text={property?.booking_platform === 'airbnb' ? 'Flexible - Guests can cancel at least 24 hours before check-in' : guest_property_ratings?.cancellation_policy || 'N/A'}
            type="Regular"
            fontSize={14}
            color={Colors.STEEL_GREY}
          />
        </View>

        <View style={styles.headingRow}>
          <Svgicons path="paymentCardIcon" size={30} mr={8} />
          <AppText
            text="Payment Breakdown"
            type="Bold"
            fontSize={20}
            color={Colors.PINE_FOREST}
          />
        </View>

        <View style={styles.paymentGrid}>
          {[
            {
              label: 'Platform Fee:',
              value: payment_breakdown?.booking_platform_fee,
            },
            { label: 'Booking Cost:', value: payment_breakdown?.booking_cost },
            {
              label: 'Paid Amount:',
              value: payment_breakdown?.guest_paid_amount,
            },
            {
              label: 'Remaining Due:',
              value: payment_breakdown?.remaining_dues,
            },
            { label: 'Host Share:', value: payment_breakdown?.host_share },
            { label: 'OTA Share:', value: payment_breakdown?.ota_share },
          ].map((item, index) => (
            <View key={index} style={styles.paymentBox}>
              <AppText
                text={item.label}
                fontSize={15}
                color={Colors.PINE_FOREST}
                type="Bold"
              />
              <AppText
                text={`SAR ${item.value || '0.00'}`}
                type="Bold"
                mt={4}
                color={Colors.PINE_FOREST}
                opacity={0.5}
                fontSize={14}
              />
            </View>
          ))}
        </View>
      </View>

      {/* 6. Tasks Heading */}
      <View style={[styles.headingRow, { marginTop: 20, marginBottom: 15 }]}>
        <Svgicons path="taskIcon" size={22} mr={8} />
        <AppText
          text="Assigned Tasks"
          type="Bold"
          fontSize={20}
          color={Colors.PINE_FOREST}
        />
      </View>
    </View>
  );

  const ListFooter = () => (
    <AppButton
      title="Create New Task"
      borderColor={Colors.SMOOTH_GREY}
      mt={30}
      mb={50}
      borderRadius={25}
      textStyle={{ color: Colors.PINE_FOREST }}
      onPress={() => navigate(NavigationRoutes.APP_STACK.CREATE_TASK)}
    />
  );

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color={Colors.PINE_FOREST} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatListSimpleHandler
        data={tasks}
        renderItem={renderTaskItem}
        isLoading={isLoading}
        HeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        contentContainerStyle={styles.scrollContent}
        listEmptyText="No tasks assigned "
        keyExtractor={(item: Task) => item.task_id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  scrollContent: { padding: 24 },
  profileSection: { alignItems: 'center', marginBottom: 50 },
  profileImageWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
    borderWidth: 6,
    borderColor: Colors.BRUNSWICK_GREEN,
    marginBottom: 20,
    backgroundColor: '#829e98',
  },
  profileImage: { width: '100%', height: '100%' },
  infoCol: { width: '100%' },
  starRow: { flexDirection: 'row', alignItems: 'center' },
  section: { marginBottom: 35 },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'flex-start',
  },
  headingRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  chatActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  chatBtn: {
    paddingHorizontal: 25,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.ARGENT,
    justifyContent: 'center',
    width: '100%',
  },
  gradientWrapper: { marginTop: 15, padding: 1.5 },
  innerCard: { padding: 24, backgroundColor: Colors.WHITE, borderRadius: 24 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  verticalSpacer: { height: 20 },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.2,
    justifyContent: 'flex-end',
  },
  barBg: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.ANTI_FLASH_WHITE,
    borderRadius: 2,
    maxWidth: 160,
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.BOTTLE_GREEN,
    borderRadius: 2,
  },
  paymentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
  },
  paymentBox: { width: '47%', paddingVertical: 12 },
  cancellationPolicy: { marginBottom: 30 },

  // --- Task Styles ---
  taskGradient: { marginBottom: 16, padding: 1.5 },
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Keeps label at the top if text wraps
    marginBottom: 4,
    flexWrap: 'wrap', // Ensures text doesn't push off screen
  },
  taskInnerCard: {
    padding: 16,
    backgroundColor: Colors.WHITE,
  },
  taskHeader: {},
  priorityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2',
    paddingTop: 12,
    marginTop: 5,
  },
  iconInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4 },
});

export default ReviewDetailScreen;
