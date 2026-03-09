import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, TextStyle } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { s, vs, ms } from 'react-native-size-matters';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppText from '../AppText/AppText';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CALENDAR_PADDING = s(32);
const COLUMN_WIDTH = (SCREEN_WIDTH - CALENDAR_PADDING) / 7;
const SELECTION_HEIGHT = vs(46); 

const getOTASource = (source?: string) => {
  const name = source?.toLowerCase() || '';
  if (name.includes('airbnb')) return { icon: 'airbnb' };
  if (name.includes('booking')) return { icon: 'booking' };
  if (name.includes('gathern')) return { icon: 'gathern' };
  return { icon: 'livedin' };
};

const getSolidLightColor = (hex: string) => {
  const color = hex?.toUpperCase();
  switch (color) {
    case '#FF5A5F': return '#FFEBEB'; 
    case '#A855F7': return '#F3E8FF';
    case '#003580': return '#EBF3FF';
    case '#3B82F6': return '#D6E4FF';
    default: return '#F3F4F6'; 
  }
};

const CustomDay = ({ date, marking, onPress, defaultPrice }: any) => {
  const { type, color, guest, price, rate, showLabel, ota, bookingData } = marking || {};
  const isActive = !!type && type !== 'none';
  const themeColor = color || '#3B82F6';
  
  const dateString = date.dateString;
  const arrival = bookingData?.arrival_date;
  const departure = bookingData?.departure_date;

  const isArrival = isActive && dateString === arrival;
  const isDeparture = isActive && dateString === departure;
  const isSingleDay = isActive && isArrival && isDeparture;
  const isStart = isActive && isArrival && !isDeparture;
  const isEnd = isActive && isDeparture && !isArrival;
  const isMid = isActive && !isArrival && !isDeparture;

  const otaIconData = getOTASource(ota);
  const solidLight = getSolidLightColor(themeColor);

  const truncateName = (name: string, limit: number) => {
    if (!name || typeof name !== 'string') return '';
    return name.length > limit ? `${name.substring(0, limit)}..` : name;
  };

  const isSolidCircle = isStart || isEnd || isSingleDay;
  const displayName = isSolidCircle ? truncateName(guest, 6) : truncateName(guest, 12);
  const iconColor = isMid ? themeColor : '#FFFFFF';

  return (
    <View style={styles.dayCell}>
      {/* 1. PILL BACKGROUND */}
      {isActive && !isSingleDay && (
        <View
          pointerEvents="none"
          style={[
            styles.selectionBase,
            { 
              backgroundColor: solidLight,
              width: COLUMN_WIDTH,
              left: 0, 
              borderTopLeftRadius: isStart ? SELECTION_HEIGHT / 2 : 0,
              borderBottomLeftRadius: isStart ? SELECTION_HEIGHT / 2 : 0,
              borderTopRightRadius: isEnd ? SELECTION_HEIGHT / 2 : 0,
              borderBottomRightRadius: isEnd ? SELECTION_HEIGHT / 2 : 0,
              zIndex: 1,
            }
          ]}
        />
      )}

      {/* 2. SOLID CIRCLE */}
      {(isStart || isEnd || isSingleDay) && (
        <View
          pointerEvents="none"
          style={[
            styles.selectionBase,
            {
              backgroundColor: themeColor,
              width: SELECTION_HEIGHT,
              left: (COLUMN_WIDTH - SELECTION_HEIGHT) / 2,
              borderRadius: SELECTION_HEIGHT / 2,
              zIndex: 2,
            }
          ]}
        />
      )}

      <TouchableOpacity style={styles.dayContainer} onPress={() => onPress(date)} activeOpacity={0.8}>
        <View style={styles.contentWrapper}>
          {showLabel && isActive && (
            <View style={styles.labelPositioner} pointerEvents="none">
              <View style={[styles.labelRow, isSingleDay && { maxWidth: SELECTION_HEIGHT * 0.9 }]}>
                <Svgicons path={otaIconData.icon as any} size={ms(9)} color={iconColor} />
                <AppText 
                  text={displayName} 
                  style={[styles.guestTextInside, { color: isMid ? themeColor : '#FFF' } as TextStyle]} 
                  numberOfLines={1} 
                />
              </View>
            </View>
          )}

          <View style={[styles.textGroup, ...(showLabel ? [{ marginTop: vs(12) }] : [])]}>
            <Text style={[styles.dayNumber, { color: isActive ? (isMid ? '#1A332C' : '#FFF') : '#1A332C' } as TextStyle]}>
              {date.day}
            </Text>
            
            {/* FIXED: Only show price if the day is NOT part of a booking */}
            {!isActive && (
              <Text style={styles.priceText}>
                SAR {rate || price || defaultPrice}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const CustomCalendar = ({ markedDates, onDayPress, currentDate, defaultPrice }: any) => {
  return (
    <View style={styles.card}>
      <Calendar
        current={currentDate}
        markingType="custom"
        markedDates={markedDates}
        dayComponent={(props: any) => <CustomDay {...props} defaultPrice={defaultPrice} onPress={onDayPress} />}
        renderArrow={(dir: any) => (
          dir === 'left' ? <ChevronLeft size={ms(22)} color="#A0A0A0" /> : <ChevronRight size={ms(22)} color="#1A332C" />
        )}
        theme={{
          calendarBackground: 'transparent',
          monthTextColor: '#1A332C',
          textMonthFontWeight: '700',
          textMonthFontSize: ms(18),
        } as any}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFF', width: '100%' },
  dayCell: {
    width: COLUMN_WIDTH,
    height: vs(55),
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionBase: {
    position: 'absolute',
    height: SELECTION_HEIGHT,
  },
  dayContainer: {
    width: '100%',
    height: SELECTION_HEIGHT,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelPositioner: {
    position: 'absolute',
    top: vs(7),
    zIndex: 20,
    alignItems: 'center',
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(3),
  },
  textGroup: {
    alignItems: 'center',
    marginTop: vs(8),
  },
  guestTextInside: {
    fontSize: ms(6.5),
    fontWeight: '800',
    textAlign: 'center',
  },
  dayNumber: { 
    fontSize: ms(13), 
    fontWeight: '700',
    lineHeight: ms(15),
  },
  priceText: { 
    fontSize: ms(7), 
    fontWeight: '600',
    color: '#7B8D88', 
  },
});

export default CustomCalendar;