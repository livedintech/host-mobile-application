import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import moment from 'moment';
import { RawBookingData } from '@/types/api/bookingTypes';

const FIGMA_TEAL = '#20957B';
const DOT_EMPTY = '#A0A0A0'; 
const TEXT_MAIN = '#1A332C';
const TEXT_SUB = '#7B8D88';

interface CalendarListingCardProps {
  item: RawBookingData;
}
const PLACEHOLDER_IMAGE = require('@/assets/img/property_placeholder.png');
const CalendarListingCard = ({ item }: CalendarListingCardProps) => {
  
  const renderMonthGrid = () => {
    // 1. If dates are null, anchor to TODAY's month. Otherwise, anchor to booking month.
    const referenceDate = (item.start_date && item.calendar_end_date) 
      ? moment(item.start_date) 
      : moment();

    const bookingStart = item.start_date ? moment(item.start_date).startOf('day') : null;
    const bookingEnd = item.calendar_end_date ? moment(item.calendar_end_date).startOf('day') : null;

    // 2. Get total days in that specific month (28, 30, or 31)
    const daysInMonth = referenceDate.daysInMonth();
    const startOfMonth = moment(referenceDate).startOf('month');

    return Array.from({ length: daysInMonth }).map((_, i) => {
      const currentDotDate = moment(startOfMonth).add(i, 'days');
      
      // 3. Highlight logic (Only if both dates exist and current dot falls in between)
      const isHighlighted = bookingStart && bookingEnd && 
                            currentDotDate.isSameOrAfter(bookingStart) && 
                            currentDotDate.isSameOrBefore(bookingEnd);

      return (
        <View 
          key={i} 
          style={[
            styles.miniDot, 
            { backgroundColor: isHighlighted ? FIGMA_TEAL : DOT_EMPTY }
          ]} 
        />
      );
    });
  };

  return (
    <View style={styles.cardContainer}>
      {/* Property Image */}

      <Image 
        source={item?.listing_image ? { uri: item.listing_image } : PLACEHOLDER_IMAGE} 
        style={styles.propertyImage} 
        resizeMode="cover"
      />
      
      {/* Listing Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.propertyTitle} numberOfLines={1}>
          {item.listing_title || "Untitled Property"}
        </Text>
        <Text style={styles.propertyDescription} numberOfLines={2}>
          {item?.listing_desc && item?.listing_desc}
        </Text>
      </View>

      {/* Dynamic Calendar Column */}
      <View style={styles.calendarColumn}>
        <View style={styles.dotsGrid}>
          {renderMonthGrid()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: ms(10),
    padding: s(10),
    marginBottom: vs(12),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  propertyImage: {
    width: ms(60),
    height: ms(60),
    backgroundColor: '#F5F5F5',
    borderRadius: 10
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: s(12),
  },
  propertyTitle: {
    fontSize: ms(14),
    fontWeight: '700',
    color: TEXT_MAIN,
  },
  propertyDescription: {
    fontSize: ms(11),
    color: TEXT_SUB,
    marginTop: vs(2),
  },
  calendarColumn: {
    width: ms(75),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: ms(70), 
    gap: ms(3),
    justifyContent: 'flex-start',
  },
  miniDot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
  },
});

export default CalendarListingCard;