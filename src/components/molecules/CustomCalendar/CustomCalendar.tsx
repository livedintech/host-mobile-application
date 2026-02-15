import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { s, vs, ms } from 'react-native-size-matters';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_WIDTH = (SCREEN_WIDTH - s(32)) / 7;

const CustomDay = ({ date, state, marking, onPress }: any) => {
  const { type, color, guest, price, showLabel } = marking || {};
  const isActive = !!type && type !== 'none';
  const themeColor = color || '#3B82F6';
  
  // Determine rounding based on booking type
  const isStarting = type === 'starting' || type === 'single';
  const isEnding = type === 'ending' || type === 'single';

  return (
    <View style={styles.dayCell}>
      {/* LAYER 1: SELECTION BOX (The Pill) */}
      {isActive && (
        <View
          pointerEvents="none"
          style={[
            styles.selectionFullBox,
            { backgroundColor: themeColor },
            isStarting && styles.roundedLeft,
            isEnding && styles.roundedRight,
          ]}
        />
      )}

      {/* LAYER 2: INTERACTIVE CONTENT */}
      <TouchableOpacity
        style={styles.dayContainer}
        onPress={() => onPress(date)}
        activeOpacity={0.8}
      >
        <View style={styles.contentWrapper}>
          {/* GUEST NAME: Centered and elevated to prevent clipping */}
          {showLabel && (
            <View style={styles.labelPositioner} pointerEvents="none">
              <Text style={styles.guestTextInside} numberOfLines={1}>
                {guest}
              </Text>
            </View>
          )}
          
          <Text style={[
            styles.dayNumber,
            state === 'disabled' ? styles.disabledText : { color: isActive ? '#FFF' : '#1A332C' }
          ]}>
            {date.day}
          </Text>

          {state !== 'disabled' && (
            <Text style={[
              styles.priceText,
              { color: isActive ? 'rgba(255,255,255,0.9)' : '#9E9E9E' }
            ]}>
              SAR {price || '0'}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const CustomCalendar = ({ markedDates, onDayPress, currentDate }: any) => {
  return (
    <View style={styles.card}>
      <Calendar
        current={currentDate}
        markingType="custom"
        markedDates={markedDates}
        dayComponent={({ date, state, marking }: any) => (
          <CustomDay date={date} state={state} marking={marking} onPress={onDayPress} />
        )}
        renderArrow={(dir) => (
          dir === 'left' ? <ChevronLeft size={ms(22)} color="#A0A0A0" /> : <ChevronRight size={ms(22)} color="#1A332C" />
        )}
        theme={{
          calendarBackground: 'transparent',
          monthTextColor: '#1A332C',
          textMonthFontWeight: '700',
          textMonthFontSize: ms(18),
          textSectionTitleColor: '#7B8D88',
        } as any}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFF', width: '100%' },
  dayCell: {
    width: COLUMN_WIDTH,
    height: vs(60),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible', // Allows names to expand outward
  },
  selectionFullBox: {
    position: 'absolute',
    height: vs(48),
    width: '100%',
    zIndex: 1,
  },
  roundedLeft: {
    borderTopLeftRadius: ms(24),
    borderBottomLeftRadius: ms(24),
  },
  roundedRight: {
    borderTopRightRadius: ms(24),
    borderBottomRightRadius: ms(24),
  },
  dayContainer: {
    width: '100%',
    height: '100%',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: vs(48),
    width: '100%',
    overflow: 'visible',
  },
  labelPositioner: {
    position: 'absolute',
    top: vs(4), 
    left: s(8),
    zIndex: 20,
    width: s(150),
    flexDirection: 'row',
    alignItems: 'center',
  },
  guestTextInside: {
    fontSize: ms(8.5),
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'left',
    backgroundColor: 'transparent',
  },
  dayNumber: { 
    fontSize: ms(14), 
    fontWeight: '700',
    marginTop: vs(8), 
  },
  priceText: { 
    fontSize: ms(7.5), 
    fontWeight: '600', 
    marginTop: 1 
  },
  disabledText: { color: '#E0E0E0' },
});

export default CustomCalendar;