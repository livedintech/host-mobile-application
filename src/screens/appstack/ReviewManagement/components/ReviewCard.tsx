import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { ReviewItem } from '../containers/useFetchReviews';

interface ReviewCardProps {
  item: ReviewItem;
  onViewReview: () => void;
  onTalkToGuest: () => void;
  onRequestRating: () => void;
  onRateGuest: () => void;
}

const ReviewCard = ({
  item,
  onViewReview,
  onTalkToGuest,
  onRateGuest,
}: ReviewCardProps) => {
  // API score is out of 10, converting to 5-star scale (e.g., 3 / 2 = 1.5)
  const displayRating = (item.overall_score || 0) / 2;

  const renderStars = (rating: number = 0) => {
    return (
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map(index => {
          let iconPath: any = 'reviewStartUnfilledIcon';
          let iconColor = Colors.ARGENT;

          if (rating >= index) {
            // Full Star (e.g., rating is 4, index is 3)
            iconPath = 'reviewStarIcon';
            iconColor = Colors.BOTTLE_GREEN;
          } else if (rating >= index - 0.5) {
            // Half Star (e.g., rating is 1.5, index is 2. 1.5 >= 2 - 0.5 is true)
            iconPath = 'reviewStarHalfIcon';
            iconColor = Colors.BOTTLE_GREEN;
          }

          return (
            <Svgicons
              key={index}
              path={iconPath}
              size={24}
              fill={iconColor}
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
  };

  return (
    <GradientBorder style={styles.container} borderRadius={16}>
      <View style={styles.inner}>
        <AppText
          text={item?.guest_name ?? 'Guest'}
          fontSize={18}
          type="Bold"
          color={Colors.PINE_FOREST}
          mb={15}
        />

        {/* Property Info Rows */}
        <View style={styles.infoRow}>
          <Svgicons path="navigationMap" size={18} mr={10} />
          <AppText
            text="Booking Platform: "
            color={Colors.PINE_FOREST}
            fontSize={14}
            type="Bold"
          />
          <AppText
            text={item.booking_platform}
            style={{ flex: 1 }}
            color={Colors.PINE_FOREST}
            fontSize={13}
          />
        </View>

        <View style={styles.infoRow}>
          <Svgicons path="reviewHouse" size={18} mr={10} />
          <AppText
            text="Property: "
            color={Colors.PINE_FOREST}
            fontSize={14}
            type="Bold"
          />
          <AppText
            text={item.listing_name}
            style={{ flex: 1 }}
            color={Colors.PINE_FOREST}
            fontSize={13}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.sectionHeader}>
          <Svgicons path="smileySparksIcon" size={18} mr={10} />
          <AppText
            text="Guest Experience Rating"
            fontSize={15}
            type="Bold"
            color={Colors.PINE_FOREST}
          />
        </View>

        <View style={{ marginTop: 10 }}>
          {renderStars(displayRating)}

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
                title="View Details"
                onPress={onViewReview}
                borderColor={Colors.SMOOTH_GREY}
              />
            </View>
          </View>
          <View style={styles.btnRateYourGuest}>
            <AppButton title="Rate Your Guest" onPress={onRateGuest} />
          </View>
        </View>
      </View>
    </GradientBorder>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  inner: { padding: 20, backgroundColor: Colors.WHITE },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center' },
  starRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  divider: {
    marginBottom: 25,
    height: 1,
    backgroundColor: Colors.SMOOTH_GREY,
    opacity: 0.3,
  },
  buttonRow: { flexDirection: 'row', marginTop: 10 },
  flexWrapper: { flex: 1, marginRight: 10 },
  btnRateYourGuest: { marginTop: 20 },
});

export default ReviewCard;
