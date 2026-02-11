import React from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';

// Helper for the list-style rows in Property Details
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
  const reviewData = route?.params?.reviewData || {
    guestName: 'Ali Masood Ahmed',
    platform: 'Airbnb',
    date: '21-25 January 2026',
  };

  const RatingBar = ({ label, value }: { label: string; value: number }) => (
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
          <View style={[styles.barFill, { width: `${(value / 5) * 100}%` }]} />
        </View>
        <AppText
          text={value.toFixed(1)}
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
            // text={reviewData.guestName}
            text={'Ali Masood Ahmed'}
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
            text="alimasoodahmed@gmail.com"
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
            text="+966 50 123 4567"
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
                path={s <= 4 ? 'reviewStarIcon' : 'reviewStartUnfilledIcon'}
                size={26}
                fill={s <= 4 ? Colors.BOTTLE_GREEN : Colors.ARGENT}
                mr={6}
              />
            ))}
            <AppText
              text="4/5"
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
          text="The guest contacted the host to confirm early check-in availability and asked about parking details. The host confirmed that early check-in is possible from 1:00 PM at no extra cost and shared parking instructions."
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
              text="Alpha House"
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
              text="King Fahd Road, Al Madinah Al Munawarah, Saudi Arabia"
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
              value="Airbnb"
              valueColor={Colors.AIRBNB_RED}
            />
            <DetailRow label="Number of Guests:" value="3" />
            <DetailRow label="Number of Nights:" value="2" />

            <View style={styles.verticalSpacer} />

            <DetailRow label="Check-in Time:" value="9:00AM" />
            <DetailRow label="Check-out Time:" value="11:00PM" />
            <DetailRow label="Booking Dates:" value="21-25 January 2026" />

            <View style={styles.verticalSpacer} />

            <DetailRow label="Confirmation Code:" value="001273" />
            <DetailRow label="Door Code:" value="2010" />
            <DetailRow
              label="Payment Status:"
              value="Unpaid"
              valueColor={Colors.AIRBNB_RED}
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
            <RatingBar label="Cleanliness" value={5.0} />
            <RatingBar label="Accuracy" value={5.0} />
            <RatingBar label="Communication" value={5.0} />
            <RatingBar label="Location" value={5.0} />
            <RatingBar label="Check-in" value={5.0} />
            <RatingBar label="Value" value={5.0} />

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
          onPress={() => {}}
        />
        <View style={styles.cancellationPolicy}>
          <AppText
            text="Cancellation policy"
            type="Medium"
            fontSize={16}
            color={Colors.JET_BLACK}
          />
          <AppText
            text="Flexible - Guests can cancel at least 24 hours before check-in for a full refund"
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
            'Booking Platform Fee:',
            'Booking Cost:',
            'Guest Paid Amount:',
            'Remaining Due:',
            'Host Share:',
            'OTA Share:',
          ].map((item, index) => (
            <View key={index} style={styles.paymentBox}>
              <AppText
                text={item}
                fontSize={16}
                color={Colors.PINE_FOREST}
                type="Bold"
              />
              <AppText
                text="SAR 100.00"
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

      {/* 6. Assigned Task - NEW Gradient Wrap */}
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
              text="Cleaning Task"
              type="Bold"
              fontSize={16}
              color={Colors.PINE_FOREST}
            />
            <AppText
              text="Description: “Need to clean my apartment property, along with pictures”"
              fontSize={14}
              color={Colors.SUPER_GREY}
              mt={8}
              lineHeight={20}
            />
            <AppText
              text="Property: Alpha House, Riyadh Street 4"
              fontSize={14}
              color={Colors.PINE_FOREST}
              mt={12}
              type="Medium"
            />
            <AppText
              text="Due date: 21 January 2026"
              fontSize={14}
              color={Colors.PINE_FOREST}
              mt={4}
              type="Medium"
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 8,
              }}
            >
              <AppText
                text="Task Status: "
                fontSize={14}
                color={Colors.PINE_FOREST}
                type="Medium"
              />
              <AppText
                text="Ongoing"
                fontSize={14}
                color={Colors.GOLDEN_YELLOW}
                type="Bold"
              />
            </View>
          </View>
        </GradientBorder>

        <AppButton
          title="Create New Task"
          borderColor={Colors.SMOOTH_GREY}
          mt={50}
          mb={20}
          borderRadius={25}
          textStyle={{ color: Colors.PINE_FOREST }}
          onPress={() => {}}
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
