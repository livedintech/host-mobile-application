import React from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

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
      fontSize={16}
      color={Colors.PINE_FOREST}
      type="Medium"
    />
    <AppText
      text={value}
      fontSize={16}
      color={valueColor || Colors.SUPER_GREY}
      type="Medium"
    />
  </View>
);

const ReviewDetailScreen = ({ route }: any) => {
  // Extract dynamic data from navigation params
  console.log('routeparams', route.params);
  const bookingData = route?.params?.bookingData || {};

  // Destructure for easier access based on your specific API structure
  const {
    guest,
    property,
    booking_dates,
    guest_property_ratings,
    payment_breakdown,
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
        fontSize={16}
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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* 1. Profile Header */}
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
          text={
            guest?.ai_chat_summary ||
            'No chat summary available for this booking.'
          }
          fontSize={15}
          color={Colors.PINE_FOREST}
          opacity={0.7}
          textAlign="center"
          lineHeight={24}
        />
        <View style={styles.chatActionRow}>
          <ButtonView style={styles.chatBtn}>
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

      {/* 3. Property Details */}
      <View style={[styles.section, { marginTop: 30 }]}>
        <View style={styles.headingRow}>
          <Svgicons path="homeIcon" size={22} mr={8} />
          <AppText
            text="Property Details"
            type="Bold"
            fontSize={22}
            color={Colors.PINE_FOREST}
          />
        </View>
        <View style={styles.propRow}>
          <AppText
            text="Property Name: "
            type="Bold"
            color={Colors.PINE_FOREST}
            fontSize={15}
          />
          <View style={{ flex: 1 }}>
            <AppText
              text={property?.name || 'N/A'}
              color={Colors.PINE_FOREST}
              fontSize={15}
              opacity={0.7}
            />
          </View>
        </View>
        <View style={styles.propRow}>
          <AppText
            text="Property Address: "
            type="Bold"
            color={Colors.PINE_FOREST}
            fontSize={15}
          />
          <View style={{ flex: 1 }}>
            <AppText
              text={property?.address || 'N/A'}
              color={Colors.PINE_FOREST}
              fontSize={15}
              opacity={0.7}
            />
          </View>
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
              valueColor={
                property?.booking_platform?.toLowerCase() === 'airbnb'
                  ? Colors.AIRBNB_RED
                  : Colors.PINE_FOREST
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
            {/* Note: Map specific dates if available in booking_dates */}
            <DetailRow
              label="Confirmation Code:"
              value={property?.confirmation_code || 'N/A'}
            />

            <View style={styles.verticalSpacer} />

            <DetailRow
              label="Door Code:"
              value={property?.door_code || 'N/A'}
            />
            <DetailRow
              label="Payment Status:"
              value={
                property?.payment_status
                  ?.replace('_', ' ')
                  .toUpperCase() || 'N/A'
              }
              valueColor={
                property?.payment_status === 'payment_unverified'
                  ? Colors.AIRBNB_RED
                  : Colors.BOTTLE_GREEN
              }
            />
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

            <AppButton
              title="View Detail"
              backgroundColor={Colors.WHITE}
              color={Colors.PINE_FOREST}
              borderColor={Colors.SMOOTH_GREY}
              mt={25}
              borderRadius={25}
              onPress={() => {}}
            />
          </View>
        </GradientBorder>
      </View>

      {/* 5. Payment Breakdown */}
      <View style={styles.section}>
        <AppButton
          title="Rate Your Guest"
          backgroundColor={Colors.WHITE}
          color={Colors.PINE_FOREST}
          borderColor={Colors.SMOOTH_GREY}
          mt={10}
          mb={50}
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
            text={guest_property_ratings?.cancellation_policy || 'N/A'}
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

      {/* 6. Assigned Task */}
      <View style={styles.section}>
        <View style={styles.headingRow}>
          <Svgicons path="taskIcon" size={22} mr={8} />
          <AppText
            text="Assigned Task"
            type="Bold"
            fontSize={20}
            color={Colors.PINE_FOREST}
          />
        </View>

        <GradientBorder borderRadius={24} style={styles.gradientWrapper}>
          <View style={styles.innerCard}>
            <AppText
              text="No Tasks Assigned"
              type="Bold"
              fontSize={16}
              color={Colors.PINE_FOREST}
            />
            <AppText
              text="There are currently no tasks associated with this booking."
              fontSize={14}
              color={Colors.SUPER_GREY}
              mt={8}
            />
          </View>
        </GradientBorder>

        <AppButton
          title="Create New Task"
          borderColor={Colors.SMOOTH_GREY}
          mt={50}
          mb={20}
          borderRadius={25}
          textStyle={{ color: Colors.PINE_FOREST }}
          onPress={() => navigate(NavigationRoutes.APP_STACK.CREATE_TASK)}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  scrollContent: { padding: 24 },
  profileSection: { alignItems: 'center', marginBottom: 60 },
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
  infoCol: { width: '100%', alignItems: 'flex-start' },
  starRow: { flexDirection: 'row', alignItems: 'center' },
  section: { marginBottom: 35 },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
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
  propRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 4,
  },
  gradientWrapper: {
    marginTop: 15,
    padding: 1.5,
  },
  innerCard: {
    padding: 24,
    backgroundColor: Colors.WHITE,
    borderRadius: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  verticalSpacer: {
    height: 20,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
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
  taskCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.SMOOTH_GREY,
    marginTop: 15,
  },
  cancellationPolicy: {
    marginBottom: 50,
  },
});

export default ReviewDetailScreen;
