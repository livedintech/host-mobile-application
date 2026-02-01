import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { s, vs, ms } from 'react-native-size-matters';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const INITIAL_BOOKINGS: any = {
  '2026-01-01': { type: 'start', color: '#D32F2F', guest: 'Ahmed Ali', ota: 'airbnb' },
  '2026-01-02': { type: 'middle', color: '#EF9A9A' },
  '2026-01-03': { type: 'middle', color: '#EF9A9A', guest: 'Ahmed Ali', ota: 'airbnb' },
  '2026-01-04': { type: 'middle', color: '#EF9A9A' },
  '2026-01-05': { type: 'end', color: '#EF9A9A' },
  '2026-01-08': { type: 'start', color: '#D32F2F' },
  '2026-01-09': { type: 'start', color: '#B39DDB', guest: 'Fayyaz Ahmed', ota: 'gathern' },
  '2026-01-10': { type: 'middle', color: '#F3E5F5' },
  '2026-01-11': { type: 'middle', color: '#F3E5F5' },
  '2026-01-12': { type: 'end', color: '#F3E5F5' },
};

const PRICES: any = {
  '2026-01-16': '5000',
  'DEFAULT': '500',
};

const CustomDay = ({ date, state, marking, onPress }: any) => {
  const isSelected = !!marking;
  const isStart = marking?.type === 'start';
  const isEnd = marking?.type === 'end';
  const isMiddle = marking?.type === 'middle';
  const isActiveSelection = marking?.activeSelection;

  const getBgColor = () => {
    if (marking?.color) return marking.color;
    if (isActiveSelection) return '#E8F2EF';
    return 'transparent';
  };

  const dailyPrice = PRICES[date.dateString] || PRICES['DEFAULT'];

  return (
    <TouchableOpacity
      style={styles.dayContainer}
      onPress={() => onPress(date)}
      activeOpacity={0.9}
    >
      {/* 1. SELECTION/BOOKING BACKGROUND */}
      {(marking?.color || isActiveSelection) && (
        <View style={[
          styles.selectionBg,
          { backgroundColor: getBgColor() },
          isStart && styles.startRadius,
          isEnd && styles.endRadius,
          isMiddle && styles.noRadius,
          (isActiveSelection && !marking?.color) && styles.fullRadius,
        ]} />
      )}

      {/* 2. FOCUS RING */}
      {isActiveSelection && (
        <View style={styles.userSelectionRing} />
      )}

      {/* 3. OTA BRANDING */}
      {marking?.guest && (
        <View style={styles.otaHeader}>
           <Text style={styles.otaIcon}>{marking.ota === 'airbnb' ? '󰘄' : '󰠄'}</Text>
           <Text style={styles.guestName} numberOfLines={1}>
             {marking.guest}
           </Text>
        </View>
      )}

      {/* 4. DATE NUMBER */}
      <View style={styles.dateNumberWrapper}>
        <Text style={[
          styles.dayText,
          state === 'disabled' ? styles.disabledText : styles.activeText,
          isStart && styles.whiteText,
          (isActiveSelection && !isStart) && { color: '#2D4A41', fontWeight: '700' },
        ]}>
          {date.day}
        </Text>
      </View>

      {/* 5. PRICING */}
      {!marking?.color && state !== 'disabled' && (
        <View style={styles.priceWrapper}>
          <Text style={styles.priceText}>SAR {dailyPrice}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const CustomCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');

  const markedDates = useMemo(() => {
    return {
      ...INITIAL_BOOKINGS,
      [selectedDate]: {
        ...(INITIAL_BOOKINGS[selectedDate] || {}),
        activeSelection: true,
      },
    };
  }, [selectedDate]);

  return (
    <View style={styles.card}>
      <Calendar
        current={'2026-01-01'}
        dayComponent={({ date, state, marking }: any) => (
          <CustomDay
            date={date}
            state={state}
            marking={marking}
            onPress={(d: any) => setSelectedDate(d.dateString)}
          />
        )}
        markedDates={markedDates}
        markingType={'custom'}
        renderArrow={(dir: string) => (dir === 'left' ?
            <ChevronLeft size={24} color="#333" /> :
            <ChevronRight size={24} color="#333" />
        )}
        theme={{
            calendarBackground: 'transparent',
            textSectionTitleColor: '#666',
            dayTextColor: '#333',
            monthTextColor: '#1A332C',
            textMonthFontWeight: '700',
            textMonthFontSize: ms(20),
            // @ts-ignore
            'stylesheet.calendar.header': {
              week: {
                marginTop: vs(15),
                flexDirection: 'row',
                justifyContent: 'space-around',
              },
            },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: ms(20),
    padding: s(10),
    width: SCREEN_WIDTH - s(30),
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  dayContainer: {
    width: (SCREEN_WIDTH - s(80)) / 7,
    height: vs(65),
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionBg: {
    position: 'absolute',
    height: vs(50),
    width: '100%',
    zIndex: 1,
    top: vs(7),
  },
  fullRadius: {
    borderRadius: ms(25),
    width: ms(50),
  },
  userSelectionRing: {
    position: 'absolute',
    height: vs(50),
    width: ms(50),
    borderRadius: ms(25),
    borderWidth: 2,
    borderColor: '#2D4A41',
    zIndex: 2,
    top: vs(7),
  },
  startRadius: {
    borderTopLeftRadius: ms(25),
    borderBottomLeftRadius: ms(25),
    width: '110%',
    left: '10%',
  },
  endRadius: {
    borderTopRightRadius: ms(25),
    borderBottomRightRadius: ms(25),
    width: '110%',
    right: '10%',
  },
  noRadius: {
    borderRadius: 0,
    width: '125%',
  },
  otaHeader: {
    position: 'absolute',
    top: vs(10),
    left: s(4),
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    maxWidth: '90%',
  },
  otaIcon: {
    fontSize: ms(10),
    color: '#666',
    marginRight: s(2),
  },
  guestName: {
    fontSize: ms(8),
    color: '#666',
    fontWeight: '600',
  },
  dateNumberWrapper: {
    zIndex: 5,
    marginTop: vs(5),
  },
  dayText: {
    fontSize: ms(18),
    fontWeight: '500',
  },
  activeText: { color: '#1A332C' },
  disabledText: { color: '#D1D1D1' },
  whiteText: { color: '#FFF' },
  priceWrapper: {
    position: 'absolute',
    bottom: vs(2),
    zIndex: 5,
  },
  priceText: {
    fontSize: ms(8),
    color: '#999',
    fontWeight: '500',
  },
});

export default CustomCalendar;