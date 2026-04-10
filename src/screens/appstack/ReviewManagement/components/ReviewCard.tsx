import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';

import { ReviewItem } from '../containers/useFetchReviews';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

interface ReviewCardProps {
  item: ReviewItem;
  onPress: () => void;
  onViewReview: () => void;
  onTalkToGuest: () => void;
  onRequestRating: () => void;
  onRateGuest: () => void;
  hostRating?: number | null;
}

const ReviewCard = ({
  item,
  onPress,
  onViewReview,
  onTalkToGuest,
  onRateGuest,
  onRequestRating,
  hostRating = null,
}: ReviewCardProps) => {
  const guestRating = item.overall_score || 0;
  console.log("hostRating",hostRating)

 
  const borderColors = [
    'rgba(128, 128, 128, 0.66)',
    'rgba(255, 255, 255, 0.66)',
    'rgba(128, 128, 128, 0.66)',
  ];

  const renderProgressBar = (score: number) => (
    <View style={styles.progressWrapper}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${(score / 5) * 100}%` }]} />
      </View>
      <AppText
        text={score.toFixed(1)}
        fontSize={12}
        type="Bold"
        ml={10}
        color={Colors.PINE_FOREST}
      />
    </View>
  );

  return (
    <GlassCard width="100%" style={styles.card}>
      <ButtonView onPress={onPress}>
      <View>
      <AppText
        text={item.guest_name || 'Guest'}
        fontSize={18}
        type="Bold"
        color={Colors.BLACK}
        mb={27}
      />

      <View style={styles.detailsContainer}>
        <AppText
          text={item.listing_name}
          fontSize={14}
          type="Bold"
          color={Colors.BLACK}
          mb={24}
        />
        {/* <AppText
          text="Al Riyadh Housing, Street 4"
          fontSize={12}
          color={Colors.SUPER_GREY}
        />
        <AppText
          text="Opposite Burj Al Arab"
          fontSize={12}
          color={Colors.SUPER_GREY}
        /> */}

        <AppText
          text="Booking Dates"
          fontSize={14}
          type="Bold"
          color={Colors.BLACK}
          mt={12}
        />
        <AppText
          text={`${item.arrival_date} - ${item.departure_date}`}
          fontSize={13}
          color={Colors.BLACK}
        />
      </View>

      {/* SECTION: Guest Experience Rating */}
      <View style={styles.sectionMargin}>
        <View style={styles.rowAlignCenter}>
          <View style={styles.iconBox}>
            <Svgicons path="guestExpIcon" size={30} />
          </View>
          <AppText
            text="Guest Experience Rating"
            fontSize={14}
            type="Bold"
            color={Colors.PINE_FOREST}
            ml={10}
          />
        </View>

        {guestRating > 0 ? (
          <View>
            {renderProgressBar(guestRating)}
            <View style={styles.buttonRow}>
              {/* View Details with Gradient Border */}
              <GradientBorder
                colors={borderColors}
                borderRadius={25}
                style={styles.flex1}
              >
                <ButtonView
                  onPress={onViewReview}
                  style={styles.gradientBtnInner}
                >
                  <AppText
                    text="View Details"
                    fontSize={13}
                    color={Colors.BLACK}
                  />
                </ButtonView>
              </GradientBorder>

              <AppButton
                title="Talk To Guest"
                onPress={onTalkToGuest}
                color={Colors.WHITE}
                backgroundColor={Colors.BOTTLE_GREEN}
                borderColor={Colors.BOTTLE_GREEN}
                style={styles.primaryBtn}
              />
            </View>
          </View>
        ) : (
          <View>
            <AppText
              text="The guest hasn't submitted a review yet. Reach out via chat."
              fontSize={12}
              color={Colors.SUPER_GREY}
              mt={8}
            />
            <GradientBorder
              colors={borderColors}
              borderRadius={25}
              style={styles.smallGradientBtn}
            >
              <ButtonView
                onPress={onRequestRating}
                style={styles.gradientBtnInner}
              >
                <AppText
                  text="Request Rating"
                  fontSize={12}
                  color={Colors.PINE_FOREST}
                />
              </ButtonView>
            </GradientBorder>
          </View>
        )}
      </View>

      {/* SECTION: Guest Rating - By You */}
      <View style={styles.sectionMargin}>
        <View style={styles.rowAlignCenter}>
          <View style={styles.iconBox}>
            <Svgicons path="guestExpIcon" size={30} />
          </View>
          <AppText
            text="Guest Rating - By You"
            fontSize={14}
            type="Bold"
            color={Colors.PINE_FOREST}
            ml={10}
          />
        </View>
        {
        hostRating !== null ? 
        // false ?
        (
          renderProgressBar(hostRating)
        ) : (
          <GradientBorder
            colors={borderColors}
            borderRadius={25}
            style={styles.smallGradientBtn}
          >
            <ButtonView
              onPress={onRateGuest}
              style={styles.gradientBtnInner}
            >
              <AppText
                text="Rate Your Guest"
                fontSize={12}
                color={Colors.PINE_FOREST}
              />
            </ButtonView>
          </GradientBorder>
        )}
      </View>
      </View>
      </ButtonView>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: { padding: 20, marginBottom: 15 },
  detailsContainer: { marginBottom: 15 },
  sectionMargin: { marginTop: 15 },
  rowAlignCenter: { flexDirection: 'row', alignItems: 'center' },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  track: {
    flex: 1,
    height: 5,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: Colors.BOTTLE_GREEN },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  flex1: { flex: 1 },
  gradientBtnInner: {
    height: 48,
    backgroundColor: Colors.WHITE, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtn: {
    flex: 1,
    height: 48,
    backgroundColor: '#4DB6AC',
    borderRadius: 25,
    marginLeft: 10,
  },
  smallGradientBtn: { width: 140, marginTop: 10 },
});

export default ReviewCard;
