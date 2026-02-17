import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { s, vs, ms } from 'react-native-size-matters';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CALENDAR_PADDING = s(32);
const COLUMN_WIDTH = (SCREEN_WIDTH - CALENDAR_PADDING) / 7;
const SELECTION_HEIGHT = vs(46); 

const getOTASource = (source?: string) => {
  const s = source?.toLowerCase();
  let iconName: any; 
  if (s === 'airbnb') iconName = 'airbnb';
  else if (s === 'bookingcom' || s === 'booking.com' || s === 'booking') iconName = 'booking';
  else if (s === 'gathern') iconName = 'gathern';
  else iconName = 'livedin'; 

  return { icon: iconName };
};

const CustomDay = ({ date, state, marking, onPress, defaultPrice }: any) => {
  // Destructure values from marking
  const { type, color, guest, price, rate, showLabel, ota } = marking || {};
  const isActive = !!type && type !== 'none';
  const themeColor = color || '#3B82F6';
  
  // Shape Logic
  const isSingle = type === 'single';
  const isStarting = type === 'starting';
  const isEnding = type === 'ending';
  const isMiddle = type === 'middle';
  
  const otaIconData = getOTASource(ota);
  const displayPrice = rate || price || defaultPrice;

  return (
    <View style={styles.dayCell}>
      {/* SELECTION LAYER */}
      {isActive && (
        <View
          pointerEvents="none"
          style={[
            styles.selectionBase,
            { backgroundColor: themeColor },
            isSingle && styles.circleShape,
            isStarting && styles.roundedLeft,
            isEnding && styles.roundedRight,
            (isMiddle || isStarting || isEnding) && styles.fullWidth,
          ]}
        />
      )}

      <TouchableOpacity
        style={styles.dayContainer}
        onPress={() => onPress(date)}
        activeOpacity={0.8}
      >
        <View style={styles.contentWrapper}>
          
          {/* OTA ICON + GUEST NAME */}
          {showLabel && (
            <View style={styles.labelPositioner} pointerEvents="none">
              <View style={styles.labelRow}>
                <Svgicons path={otaIconData.icon} size={ms(8)} />
                <Text style={styles.guestTextInside} numberOfLines={1}>
                  {guest}
                </Text>
              </View>
            </View>
          )}
          
          <Text style={[
            styles.dayNumber,
            state === 'disabled' ? styles.disabledText : { color: isActive ? '#FFF' : '#1A332C' }
          ]}>
            {date.day}
          </Text>

          {/* PRICE DISPLAY */}
          {state !== 'disabled' && (
            <Text style={[
              styles.priceText,
              { color: isActive ? 'rgba(255,255,255,0.85)' : '#9E9E9E' }
            ]}>
              SAR {displayPrice}
            </Text>
          )}
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
        dayComponent={({ date, state, marking }: any) => (
          <CustomDay 
            date={date} 
            state={state} 
            marking={marking} 
            onPress={onDayPress} 
            defaultPrice={defaultPrice} 
          />
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
    overflow: 'visible',
  },
  selectionBase: {
    position: 'absolute',
    height: SELECTION_HEIGHT,
    zIndex: 1,
  },
  circleShape: {
    width: SELECTION_HEIGHT,
    borderRadius: SELECTION_HEIGHT / 2,
  },
  fullWidth: {
    width: '100%',
  },
  roundedLeft: {
    borderTopLeftRadius: SELECTION_HEIGHT / 2,
    borderBottomLeftRadius: SELECTION_HEIGHT / 2,
  },
  roundedRight: {
    borderTopRightRadius: SELECTION_HEIGHT / 2,
    borderBottomRightRadius: SELECTION_HEIGHT / 2,
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
    height: SELECTION_HEIGHT,
    width: '100%',
    overflow: 'visible',
  },
  labelPositioner: {
    position: 'absolute',
    top: vs(4), 
    left: s(10),
    zIndex: 20,
    width: s(150),
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(3),
  },
  guestTextInside: {
    fontSize: ms(6.5),
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'left',
  },
  dayNumber: { 
    fontSize: ms(14), 
    fontWeight: '700',
    marginTop: vs(8), 
  },
  priceText: { 
    fontSize: ms(7), 
    fontWeight: '600', 
    marginTop: 0 
  },
  disabledText: { color: '#E0E0E0' },
});

export default CustomCalendar;