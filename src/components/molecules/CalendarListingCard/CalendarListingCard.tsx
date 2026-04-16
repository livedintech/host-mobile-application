import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import moment from 'moment';
import { RawBookingData } from '@/types/api/bookingTypes';
import ButtonView from '../AppButton/ButtonView';
import { Colors } from '@/theme/colors';

const FIGMA_TEAL = '#09A389';
const DOT_EMPTY = '#a8a8a8';
const TEXT_MAIN = '#000000';
const TEXT_SUB = '#7B8D88';

interface CalendarListingCardProps {
  item: RawBookingData;
  onPress?: (id: string | number) => void;
}

const PLACEHOLDER_IMAGE = require('@/assets/img/property_placeholder.png');

const CalendarListingCard = ({ item, onPress }: CalendarListingCardProps) => {
  const renderMonthGrid = () => {
    const referenceDate = moment();
    const daysInMonth = referenceDate.daysInMonth();
    const startOfMonth = moment(referenceDate).startOf('month');

    const DOT_SIZE = ms(6);
    const GAP_SIZE = ms(3);
    const DOTS_PER_ROW = 7; // Changed from 10 to 7

    const daysData = Array.from({
      length: daysInMonth,
    }).map((_, i) => {
      const currentDotDate = moment(startOfMonth).add(i, 'days').startOf('day');
      const bookingIndex =
        item.bookings?.findIndex(booking => {
          const start = moment(booking.start_date).startOf('day');
          const end = moment(booking.calendar_end_date).startOf('day');
          return (
            currentDotDate.isSameOrAfter(start) &&
            currentDotDate.isSameOrBefore(end)
          );
        }) ?? -1;
      return { isBooked: bookingIndex !== -1, bookingIndex };
    });

    const rows: { isBooked: boolean; bookingIndex: number }[][] = [];
    for (let i = 0; i < daysData.length; i += DOTS_PER_ROW) {
      rows.push(daysData.slice(i, i + DOTS_PER_ROW));
    }

    return rows.map((row, rowIndex) => {
      const rowElements: React.ReactElement[] = [];
      let i = 0;

      while (i < row.length) {
        if (row[i].isBooked) {
          let count = 0;
          const startIdx = i;
          const currentBookingIndex = row[i].bookingIndex;

          while (
            i < row.length &&
            row[i].isBooked &&
            row[i].bookingIndex === currentBookingIndex
          ) {
            count++;
            i++;
          }

          const barWidth = DOT_SIZE * count + GAP_SIZE * (count - 1);
          rowElements.push(
            <View
              key={`bar-${rowIndex}-${startIdx}`}
              style={[
                styles.miniBar,
                { backgroundColor: FIGMA_TEAL, width: barWidth },
              ]}
            />,
          );
        } else {
          rowElements.push(
            <View
              key={`dot-${rowIndex}-${i}`}
              style={[styles.miniDot, { backgroundColor: DOT_EMPTY }]}
            />,
          );
          i++;
        }
      }

      return (
        <View key={`row-${rowIndex}`} style={styles.dotsRow}>
          {rowElements}
        </View>
      );
    });
  };
  return (
    <ButtonView activeOpacity={0.8} onPress={() => onPress?.(item.listing_id)}>
      <View style={styles.cardContainer}>
        {/* Property Image */}
        <Image
          source={
            item?.listing_image
              ? { uri: item.listing_image }
              : PLACEHOLDER_IMAGE
          }
          style={styles.propertyImage}
          resizeMode="cover"
        />

        {/* Listing Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.propertyTitle} numberOfLines={1}>
            {item.listing_title || 'Untitled Property'}
          </Text>

          {item.address ? (
            <Text style={styles.propertyAddress} numberOfLines={2}>
              {item.address}
            </Text>
          ) : null}

          <Text style={styles.propertyDescription} numberOfLines={1}>
            {item?.listing_desc || ''}
          </Text>
        </View>

        {/* Dynamic Calendar Column */}
        <View style={styles.calendarColumn}>
          <View style={styles.dotsGrid}>{renderMonthGrid()}</View>
        </View>
      </View>
    </ButtonView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: ms(10),
    padding: s(12),
    marginBottom: vs(12),
    // borderWidth: 1.5,
    // borderColor: 'rgba(255, 255, 255, 0.7)',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',

    boxShadow: [
      {
        offsetX: 0,
        offsetY: 4,
        blurRadius: 9,
        spreadDistance: 0,
        color: '#00000021',
        inset: false,
      },
    ],
  },

  propertyImage: {
    width: ms(62),
    height: ms(60),
    backgroundColor: '#F5F5F5',
    borderRadius: ms(15),
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: s(12),
    justifyContent: 'center',
  },
  propertyTitle: {
    fontSize: ms(15),
    fontWeight: '700',
    color: TEXT_MAIN,
    marginBottom: vs(2),
  },
  propertyAddress: {
    fontSize: ms(9),
    color: Colors.DARK_1C,
    fontWeight: '500',
    marginBottom: vs(2),
  },
  propertyDescription: {
    fontSize: ms(10),
    color: TEXT_SUB,
    marginTop: vs(1),
  },
  calendarColumn: {
    width: ms(70), // Reduced width to fit 7 dots better
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  dotsGrid: {
    flexDirection: 'column',
    gap: ms(6), // Slightly more vertical gap for better readability
    width: '100%',
    alignItems: 'flex-start',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: ms(4), // This matches the GAP_SIZE in your logic
    alignItems: 'center',
    marginBottom: vs(1),
  },
  miniDot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
  },
  miniBar: {
    height: ms(6),
    borderRadius: ms(3),
  },
});

export default CalendarListingCard;
