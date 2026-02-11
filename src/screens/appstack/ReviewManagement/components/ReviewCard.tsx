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
  onRequestRating,
  onRateGuest,
}: ReviewCardProps) => {
  
  // Logic: API score is 10, we want 5 stars (e.g., 10/2 = 5, 8/2 = 4)
  const displayRating = (item.overall_score || 0) / 2;

  const renderStars = (rating: number = 0) => (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map(index => {
        // Rounding ensures that a score like 3.5 fills the 4th star 
        // depending on your UX preference
        const isFilled = index <= Math.round(rating);
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
        {/* Hardcoded Guest Name as requested */}
        <AppText
          text={item?.guest_name ?? ""}
          fontSize={18}
          type="Bold"
          color={Colors.PINE_FOREST}
          mb={15}
        />

        <View style={styles.infoRow}>
          <Svgicons path="navigationMap" size={18} mr={10} />
          <AppText text="Booking Platform: " color={Colors.PINE_FOREST} fontSize={14} type="Bold" />
          <AppText 
            // text={item.booking_id} 
            text={item.booking_platform} 
            style={{ flex: 1 }} 
            color={Colors.PINE_FOREST} 
            fontSize={13} 
          />
        </View>

        <View style={styles.infoRow}>
          <Svgicons path="reviewHouse" size={18} mr={10} />
          <AppText text="Property: " color={Colors.PINE_FOREST} fontSize={14} type="Bold" />
          <AppText 
            text={item.listing_name} 
            style={{ flex: 1 }} 
            color={Colors.PINE_FOREST} 
            fontSize={13} 
          />
        </View>

        <View style={styles.infoRow}>
          <Svgicons path="Calendar_Days" size={22} mr={10} />
          <AppText text="Dates: " color={Colors.PINE_FOREST} fontSize={14} type="Bold" />
          <AppText 
            text={`${item.arrival_date} - ${item.departure_date}`} 
            fontSize={13} 
            color={Colors.PINE_FOREST} 
            style={{ flex: 1 }} 
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
        </View>
      </View>
    </GradientBorder>
  );
};

const styles = StyleSheet.create({
  container: { 
    marginBottom: 20 
  },
  inner: { 
    padding: 20, 
    backgroundColor: Colors.WHITE 
  },
  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginBottom: 10 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  starRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 12 
  },
  divider: { 
    marginBottom: 25 
  },
  buttonRow: { 
    flexDirection: 'row', 
    marginTop: 10 
  },
  flexWrapper: { 
    flex: 1, 
    marginRight: 10 
  },
});

export default ReviewCard;