import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import moment from 'moment';
import { RawBookingData } from '@/types/api/bookingTypes';

const FIGMA_TEAL = '#20957B';
const DOT_EMPTY = '#E0E0E0';
const TEXT_MAIN = '#1A332C';
const TEXT_SUB = '#7B8D88';

interface CalendarListingCardProps {
  item: RawBookingData;
}

const PLACEHOLDER_IMAGE = require('@/assets/img/property_placeholder.png');

const CalendarListingCard = ({ item }: CalendarListingCardProps) => {
  
  const renderMonthGrid = () => {
    // Anchor to the current month (today) to show real-time availability
    const referenceDate = moment(); 
    const daysInMonth = referenceDate.daysInMonth();
    const startOfMonth = moment(referenceDate).startOf('month');

    return Array.from({ length: daysInMonth }).map((_, i) => {
      const currentDotDate = moment(startOfMonth).add(i, 'days').startOf('day');
      const uniqueKey = `${item.id}-${currentDotDate.format('YYYY-MM-DD')}`;
      // Check if this specific day overlaps with ANY of the bookings for this property
      const isHighlighted = item.bookings?.some(booking => {
        // Use the actual keys from your API response: start_date and calendar_end_date
        if (!booking.start_date || !booking.calendar_end_date) return false;
        
        const start = moment(booking.start_date).startOf('day');
        const end = moment(booking.calendar_end_date).startOf('day');
        
        return currentDotDate.isSameOrAfter(start) && currentDotDate.isSameOrBefore(end);
      });

      return (
        <View 
          key={uniqueKey}
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
          {item?.listing_desc || ""}
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
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Added slight bg for glass effect
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