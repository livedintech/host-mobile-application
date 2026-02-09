import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';

interface ReviewCardProps {
  item: {
    id: string;
    guestName: string;
    platform: 'Airbnb' | 'Gathern' | 'Booking.com';
    property: string;
    date: string;
    guestRating?: number;
    myRating?: number;
    hasGuestReviewed: boolean;
  };
  onViewReview: () => void;
  onTalkToGuest: () => void;
  onRequestRating: () => void;
  onRateGuest: () => void;
}

const ReviewCard = ({
  item,
  onViewReview,
  onTalkToGuest,
  onRequestRating,
  onRateGuest,
}: ReviewCardProps) => {
  const renderStars = (rating: number = 0) => (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map(index => {
        const isFilled = index <= rating;
        return (
          <Svgicons
            key={index}
            path={isFilled ? 'reviewStarIcon' : 'reviewStartUnfilledIcon'}
            size={24}
            fill={isFilled ? Colors.BOTTLE_GREEN : Colors.ARGENT}
            mr={4}
          />
        );
      })}
      <AppText
        text={`${rating}/5`}
        ml={8}
        color={Colors.SUPER_GREY}
        fontSize={16}
      />
    </View>
  );

  return (
    <GradientBorder style={styles.container} borderRadius={16}>
      <View style={styles.inner}>
        <AppText
          text={item.guestName}
          fontSize={18}
          type="Bold"
          color={Colors.PINE_FOREST}
          mb={15}
        />

        <View style={styles.infoRow}>
          <Svgicons path="navigationMap" size={18} mr={10} />
          <AppText
            text="Booking Platform: "
            color={Colors.PINE_FOREST}
            fontSize={14}
            type="Bold"
          />
          {/* FLEX: 1 allows the platform text to wrap if it's very long */}
          <AppText
            text={item.platform}
            style={{ flex: 1 }} 
            color={
              item.platform === 'Airbnb'
                ? Colors.AIRBNB_RED
                : item.platform === 'Gathern'
                ? Colors.GATHEM_PURPLE
                : Colors.PINE_FOREST
            }
            type="Regular"
            fontSize={14}
          />
        </View>

        <View style={styles.infoRow}>
          {/* Top-aligned icon for multiline property text */}
          <Svgicons path="reviewHouse" size={18} mr={10} />
          <AppText
            text="Property: "
            color={Colors.PINE_FOREST}
            fontSize={14}
            type="Bold"
          />
          {/* FLEX: 1 is critical here to fix the overflow from your image */}
          <AppText
            text={item.property}
            type="Regular"
            fontSize={14}
            color={Colors.PINE_FOREST}
            style={{ flex: 1 }}
          />
        </View>

        <View style={styles.infoRow}>
          <Svgicons path="Calendar_Days" size={18} mr={10} />
          <AppText
            text="Date: "
            color={Colors.PINE_FOREST}
            fontSize={14}
            type="Bold"
          />
          <AppText
            text={item.date}
            type="Regular"
            fontSize={14}
            color={Colors.PINE_FOREST}
            style={{ flex: 1 }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.sectionHeader}>
          <Svgicons
            path={item.hasGuestReviewed ? 'smileySparksIcon' : 'smileyHappyIcon'}
            size={18}
            mr={10}
          />
          <AppText
            text="Guest Experience Rating"
            fontSize={15}
            type="Bold"
            color={Colors.PINE_FOREST}
          />
        </View>

        {item.hasGuestReviewed ? (
          <View style={{ marginTop: 10 }}>
            {renderStars(item.guestRating)}

            <View style={styles.buttonRow}>
              <View style={styles.flexWrapper}>
                <AppButton
                  title="Talk To Guest"
                  onPress={onTalkToGuest}
                  borderColor={Colors.SMOOTH_GREY}
                />
              </View>

              <View style={[styles.flexWrapper, { marginRight: 0 }]}>
                <AppButton
                  title="View Review"
                  onPress={onViewReview}
                  borderColor={Colors.SMOOTH_GREY}
                />
              </View>
            </View>
          </View>
        ) : (
          <View style={{ marginTop: 10 }}>
            <AppText
              text="The guest hasn't submitted a review yet. You can reach out via chat to request their feedback."
              color={Colors.PINE_FOREST}
              fontSize={13}
              mb={12}
              lineHeight={18}
              type="Regular"
              opacity={0.7}
            />
            <AppButton
              title="Request Rating"
              onPress={onRequestRating}
              style={styles.requestBtn}
              borderColor={Colors.SMOOTH_GREY}
            />
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.sectionHeader}>
          <Svgicons
            path={item.myRating ? 'smileyHappyIcon' : 'smileySparksIcon'}
            size={18}
            mr={10}
          />
          <AppText
            text="Guest Rating (By You)"
            fontSize={15}
            type="Bold"
            color={Colors.PINE_FOREST}
          />
        </View>

        <View style={{ marginTop: 10 }}>
          {item.myRating ? (
            renderStars(item.myRating)
          ) : (
            <View>
              <AppText
                text="You haven't left a review yet. Take a moment to rate your experience with the guest."
                color={Colors.PINE_FOREST}
                fontSize={13}
                mb={12}
                lineHeight={18}
                type="Regular"
                opacity={0.7}
              />
              <AppButton
                title="Rate Your Guest"
                onPress={onRateGuest}
                style={styles.requestBtn}
                borderColor={Colors.SMOOTH_GREY}
              />
            </View>
          )}
        </View>
      </View>
    </GradientBorder>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  inner: { padding: 20, backgroundColor: Colors.WHITE },

  // Added alignItems: 'flex-start' so icons stay at top when text wraps
  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginBottom: 10 
  },

  sectionHeader: { flexDirection: 'row', alignItems: 'center' },

  starRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },

  divider: {
    // height: 1,
    // backgroundColor: Colors.ANTI_FLASH_WHITE,
    // marginVertical: 20,
    // width: '100%',
    marginBottom:30,
  },

  buttonRow: {
    flexDirection: 'row',
    marginTop: 5,
  },

  flexWrapper: {
    flex: 1,
    marginRight: 10,
  },

  requestBtn: {
    width: '70%'
  },
});

export default ReviewCard;