import React from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';

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
      {/* 1. Profile Header - Column Layout */}
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
            text={reviewData.guestName}
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
        <View style={[styles.headingRow, { justifyContent: 'center' }]}>
          <Svgicons path="sparkleIcon" size={24} mr={8} />
          <AppText
            text="AI Chat Summary"
            type="Medium"
            fontSize={22}
            color={Colors.PINE_FOREST}
          />
        </View>
        <AppText
          text="The guest contacted the host to confirm early check-in availability and asked about parking details. The host confirmed that early check-in is possible from 1:00 PM at no extra cost and shared parking instructions. The guest acknowledged the details and confirmed arrival time."
          fontSize={15}
          color={Colors.PINE_FOREST}
          opacity={0.7}
          textAlign="center"
          lineHeight={24}
          mt={15}
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
      <View style={styles.section}>
        <View style={styles.headingRow}>
          <Svgicons path="homeIcon" size={22} mr={8} />
          <AppText
            text="Property Details"
            type="Bold"
            fontSize={20}
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
          <AppText
            text="Alpha House"
            color={Colors.PINE_FOREST}
            fontSize={15}
          />
        </View>
        <View style={styles.propRow}>
          <AppText
            text="Property Address: "
            type="Bold"
            color={Colors.PINE_FOREST}
            fontSize={15}
          />
          <AppText
            text="King Fahd Road, Al Madinah Al Munawarah, Saudi Arabia"
            flex={1}
            color={Colors.PINE_FOREST}
            fontSize={15}
          />
        </View>

        <GradientBorder borderRadius={16} style={styles.infoCard}>
          <View style={styles.innerInfoCard}>
            <View style={styles.gridRow}>
              <View style={styles.gridItem}>
                <AppText
                  text="Booking Platform:"
                  color={Colors.SUPER_GREY}
                  fontSize={12}
                />
                <AppText
                  text={reviewData.platform}
                  color={Colors.BITTERSWEET}
                  type="Bold"
                  fontSize={14}
                />
              </View>
              <View style={styles.gridItem}>
                <AppText
                  text="Number of Guests:"
                  color={Colors.SUPER_GREY}
                  fontSize={12}
                />
                <AppText text="3" type="Bold" fontSize={14} />
              </View>
            </View>
            <View style={styles.gridRow}>
              <View style={styles.gridItem}>
                <AppText
                  text="Number of Nights:"
                  color={Colors.SUPER_GREY}
                  fontSize={12}
                />
                <AppText text="2" type="Bold" fontSize={14} />
              </View>
              <View style={styles.gridItem}>
                <AppText
                  text="Booking Dates:"
                  color={Colors.SUPER_GREY}
                  fontSize={12}
                />
                <AppText text={reviewData.date} type="Bold" fontSize={14} />
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.gridRow}>
              <View style={styles.gridItem}>
                <AppText
                  text="Confirmation Code:"
                  color={Colors.SUPER_GREY}
                  fontSize={12}
                />
                <AppText text="001275" type="Bold" fontSize={14} />
              </View>
              <View style={styles.gridItem}>
                <AppText
                  text="Payment Status:"
                  color={Colors.SUPER_GREY}
                  fontSize={12}
                />
                <AppText
                  text="Paid"
                  color={Colors.BOTTLE_GREEN}
                  type="Bold"
                  fontSize={14}
                />
              </View>
            </View>
          </View>
        </GradientBorder>
      </View>

      {/* 4. Guest Property Ratings */}
      <View style={styles.section}>
        <AppText
          text="Guest Property Ratings"
          type="Bold"
          fontSize={20}
          mb={20}
          color={Colors.PINE_FOREST}
        />
        <RatingBar label="Cleanliness" value={5.0} />
        <RatingBar label="Accuracy" value={5.0} />
        <RatingBar label="Communication" value={5.0} />
        <RatingBar label="Location" value={5.0} />
        <RatingBar label="Check-in" value={5.0} />
        <RatingBar label="Value" value={5.0} />

        <AppButton
          title="Rate Your Guest"
          backgroundColor={Colors.WHITE}
          color={Colors.PINE_FOREST}
          outline
          borderColor={Colors.SMOOTH_GREY}
          mt={20}
          borderRadius={25}
          height={50}
        />
      </View>

      {/* 5. Payment Breakdown */}
      <View style={styles.section}>
        <View style={styles.headingRow}>
          <Svgicons path="paymentIcon" size={22} mr={8} />
          <AppText
            text="Payment Breakdown"
            type="Bold"
            fontSize={20}
            color={Colors.PINE_FOREST}
          />
        </View>
        <View style={styles.paymentGrid}>
          <View style={styles.paymentBox}>
            <AppText
              text="Booking Platform Fee"
              fontSize={12}
              color={Colors.PINE_FOREST}
              type="Medium"
            />
            <AppText text="SAR 100.00" type="Bold" mt={4} />
          </View>
          <View style={styles.paymentBox}>
            <AppText
              text="Booking Cost"
              fontSize={12}
              color={Colors.PINE_FOREST}
              type="Medium"
            />
            <AppText text="SAR 250.00" type="Bold" mt={4} />
          </View>
          <View style={styles.paymentBox}>
            <AppText
              text="Guest Paid Amount"
              fontSize={12}
              color={Colors.PINE_FOREST}
              type="Medium"
            />
            <AppText text="SAR 100.00" type="Bold" mt={4} />
          </View>
          <View style={styles.paymentBox}>
            <AppText
              text="Remaining Due"
              fontSize={12}
              color={Colors.PINE_FOREST}
              type="Medium"
            />
            <AppText text="SAR 150.00" type="Bold" mt={4} />
          </View>
          <View style={styles.paymentBox}>
            <AppText
              text="Host Share"
              fontSize={12}
              color={Colors.PINE_FOREST}
              type="Medium"
            />
            <AppText text="SAR 80.00" type="Bold" mt={4} />
          </View>
          <View style={styles.paymentBox}>
            <AppText
              text="OTA Share"
              fontSize={12}
              color={Colors.PINE_FOREST}
              type="Medium"
            />
            <AppText text="SAR 20.00" type="Bold" mt={4} />
          </View>
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
        <View style={styles.taskCard}>
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
            mt={4}
            type="Medium"
          />
          <AppText
            text="Due date: 21 January 2026"
            fontSize={14}
            color={Colors.PINE_FOREST}
            mt={2}
            type="Medium"
          />
          <View
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}
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
              color={Colors.YELLOW}
              type="Bold"
            />
          </View>
        </View>
        <AppButton
          title="Create New Task"
          outline
          borderColor={Colors.SMOOTH_GREY}
          mt={20}
          mb={50}
          borderRadius={25}
          height={50}
          textStyle={{ color: Colors.PINE_FOREST }}
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
  headingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
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
    marginHorizontal: 10,
    width: '100%',
  },
  propRow: { flexDirection: 'row', marginBottom: 8 },
  infoCard: { marginTop: 15 },
  innerInfoCard: { padding: 20, backgroundColor: Colors.WHITE },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  gridItem: { width: '48%' },
  divider: {
    height: 1,
    backgroundColor: Colors.ANTI_FLASH_WHITE,
    marginBottom: 15,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    justifyContent: 'space-between',
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.5,
    justifyContent: 'flex-end',
  },
  barBg: {
    width: 140,
    height: 6,
    backgroundColor: Colors.ANTI_FLASH_WHITE,
    borderRadius: 3,
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.BOTTLE_GREEN,
    borderRadius: 3,
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
});

export default ReviewDetailScreen;
