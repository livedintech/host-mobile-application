import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { s, vs, ms } from 'react-native-size-matters';
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

const CustomDay = ({ date, state, marking, onPress, defaultPrice }: any) => {
  const { type, color, guest, price, rate, showLabel, ota } = marking || {};
  const isActive = !!type && type !== 'none';
  const themeColor = color || '#3B82F6';
  
  const isSingle = type === 'single' || (marking?.starting && marking?.ending);
  const isStarting = marking?.starting && !isSingle;
  const isEnding = marking?.ending && !isSingle;
  
  const otaIconData = getOTASource(ota);
  const displayPrice = rate || price || defaultPrice;

  // --- MANUAL TRUNCATION LOGIC ---
  // If it's a single circle, we limit the name strictly to fit the diameter
  const truncateName = (name: string, limit: number) => {
    if (!name) return '';
    return name.length > limit ? `${name.substring(0, limit)}..` : name;
  };

  const displayName = isSingle ? truncateName(guest, 4) : truncateName(guest, 10);

  return (
    <View style={styles.dayCell}>
      {/* 1. SELECTION BACKGROUND */}
      {isActive && (
        <View
          pointerEvents="none"
          style={[
            styles.selectionBase,
            { 
              backgroundColor: themeColor,
              width: isSingle ? SELECTION_HEIGHT : '100%',
              left: isSingle ? (COLUMN_WIDTH - SELECTION_HEIGHT) / 2 : 0,
              borderTopLeftRadius: (isSingle || isStarting) ? SELECTION_HEIGHT / 2 : 0,
              borderBottomLeftRadius: (isSingle || isStarting) ? SELECTION_HEIGHT / 2 : 0,
              borderTopRightRadius: (isSingle || isEnding) ? SELECTION_HEIGHT / 2 : 0,
              borderBottomRightRadius: (isSingle || isEnding) ? SELECTION_HEIGHT / 2 : 0,
            }
          ]}
        />
      )}

      {/* 2. CONTENT CONTAINER */}
      <TouchableOpacity
        style={styles.dayContainer}
        onPress={() => onPress(date)}
        activeOpacity={0.8}
      >
        <View style={styles.contentWrapper}>
          {/* TRUNCATED GUEST LABEL */}
          {showLabel && (
            <View style={styles.labelPositioner} pointerEvents="none">
              <View style={[
                styles.labelRow, 
                isSingle && { maxWidth: SELECTION_HEIGHT * 0.9 }
              ]}>
                <Svgicons path={otaIconData.icon as any} size={ms(7)} />
                <AppText 
                  text={displayName} 
                  style={styles.guestTextInside} 
                  numberOfLines={1} 
                />
              </View>
            </View>
          )}

          <View style={styles.textGroup}>
            <Text style={[
              styles.dayNumber, 
              { color: isActive ? '#FFF' : '#1A332C' },
              state === 'disabled' && styles.disabledText
            ]}>
              {date.day}
            </Text>
            
            <Text style={[
              styles.priceText, 
              { color: isActive ? 'rgba(255,255,255,0.85)' : '#7B8D88' }
            ]}>
              SAR {displayPrice}
            </Text>
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
    zIndex: 1,
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
    top: vs(2),
    zIndex: 20,
    alignItems: 'center',
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(2),
    overflow: 'hidden',
  },
  textGroup: {
    alignItems: 'center',
    marginTop: vs(8),
  },
  guestTextInside: {
    fontSize: ms(6),
    fontWeight: '800',
    color: '#FFF',
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
  },
  disabledText: { color: '#E0E0E0' },
});

export default CustomCalendar;