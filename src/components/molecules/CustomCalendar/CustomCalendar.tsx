import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { s, vs, ms } from 'react-native-size-matters';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { AirbnbIcon, GathernIcon } from './CustomIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const INITIAL_BOOKINGS: any = {
  '2026-01-01': { type: 'single', color: '#D32F2F', textColor: '#FFF' },
  '2026-01-02': { type: 'start', color: '#F8B6B6' },
  '2026-01-03': { type: 'middle', color: '#F8B6B6' },
  '2026-01-04': { type: 'middle', color: '#F8B6B6', showLabel: true, guest: 'Ahmed', ota: 'airbnb' },
  '2026-01-05': { type: 'middle', color: '#F8B6B6' },
  '2026-01-06': { type: 'middle', color: '#F8B6B6' },
  '2026-01-07': { type: 'end', color: '#F8B6B6' },
  '2026-01-08': { type: 'single', color: '#D32F2F', textColor: '#FFF' },
  '2026-01-09': { type: 'single', color: '#B39DDB', textColor: '#FFF' },
  '2026-01-10': { type: 'start', color: '#F3E5F5' },
  '2026-01-11': { type: 'middle', color: '#F3E5F5' },
  '2026-01-12': { type: 'middle', color: '#F3E5F5', showLabel: true, guest: 'Fayyaz', ota: 'gathern' },
  '2026-01-13': { type: 'middle', color: '#F3E5F5' },
  '2026-01-14': { type: 'end', color: '#F3E5F5' },
  '2026-01-15': { type: 'single', color: '#B39DDB', textColor: '#FFF' },
};

const CustomDay = ({ date, state, marking, onPress }: any) => {
  const isActive = !!marking;
  const { type, color, textColor } = marking || {};

  return (
    <TouchableOpacity
      style={styles.dayContainer}
      onPress={() => onPress(date)}
      activeOpacity={1}
    >
      {/* BACKGROUND BAR */}
      {isActive && (
        <View
          style={[
            styles.selectionBg,
            { backgroundColor: color },
            type === 'single' && styles.circleBg,
            type === 'start' && styles.startEdge,
            type === 'middle' && styles.middleEdge,
            type === 'end' && styles.endEdge,
          ]}
        />
      )}

      {/* CENTER LABEL (Guest Name & OTA Icon) */}
      {marking?.showLabel && (
        <View style={styles.overlayContainer}>
          <View style={styles.otaRow}>
            {marking.ota === 'airbnb' ? (
              <AirbnbIcon size={ms(11)} />
            ) : (
              <GathernIcon size={ms(11)} />
            )}
            <Text
              style={styles.guestNameText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {marking.guest}
            </Text>
          </View>
        </View>
      )}


      {/* DAY NUMBER */}
      <View style={styles.dateNumberContainer}>
        <Text
          style={[
            styles.dayText,
            state === 'disabled' ? styles.disabledText : styles.activeText,
            textColor && { color: textColor },
          ]}
        >
          {date.day}
        </Text>
      </View>

      {/* PRICE */}
      {!isActive && state !== 'disabled' && <Text style={styles.priceText}>SAR 500</Text>}
      {date.dateString === '2026-01-16' && !isActive && <Text style={styles.priceText}>SAR 5000</Text>}
    </TouchableOpacity>
  );
};

const CustomCalendar = () => {
  return (
    <View style={styles.card}>
      <Calendar
        current="2026-01-01"
        markingType="custom"
        markedDates={INITIAL_BOOKINGS}
        dayComponent={({ date, state, marking }: any) => (
          <CustomDay
            date={date}
            state={state}
            marking={marking}
            onPress={(d: any) => console.log(d.dateString)}
          />
        )}
        renderArrow={(dir) =>
          dir === 'left' ? (
            <ChevronLeft size={ms(22)} color="#A0A0A0" />
          ) : (
            <ChevronRight size={ms(22)} color="#000" />
          )
        }
        theme={{
          calendarBackground: 'transparent',
          monthTextColor: '#000',
          textMonthFontWeight: '500',
          textMonthFontSize: ms(22),
          textSectionTitleColor: '#7B8D88',
          textDayHeaderFontSize: ms(16),
          textDayHeaderFontWeight: '400',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    width: SCREEN_WIDTH,
    paddingTop: vs(20),
  },
  dayContainer: {
    width: SCREEN_WIDTH / 7,
    height: vs(60),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible', // allows names to bleed out
  },
  selectionBg: {
    position: 'absolute',
    height: vs(48),
    width: '100%',
    zIndex: 1,
  },
  circleBg: {
    width: vs(48),
    borderRadius: vs(24),
  },
  startEdge: {
    borderTopLeftRadius: ms(20),
    borderBottomLeftRadius: ms(20),
    width: '105%',
    left: '5%',
  },
  middleEdge: {
    width: '110%',
  },
  endEdge: {
    borderTopRightRadius: ms(20),
    borderBottomRightRadius: ms(20),
    width: '105%',
    right: '5%',
  },
  // <<< FIXED overlayContainer >>>
  overlayContainer: {
    position: 'absolute',
    top: vs(10),      // inside the selection box
    zIndex: 20,
    minWidth: s(70),  // minimum for short names
    maxWidth: SCREEN_WIDTH / 2, // allow longer names
    paddingHorizontal: s(2),
    alignItems: 'center',       // center horizontally
  },
  otaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guestNameText: {
    fontSize: ms(9),
    color: '#666',
    fontWeight: '500',
    marginLeft: s(2),
    textAlign: 'center',
  },
  dateNumberContainer: {
    zIndex: 30,
    marginTop: vs(8),
  },
  dayText: {
    fontSize: ms(19),
    fontWeight: '600',
  },
  activeText: {
    color: '#1A332C',
  },
  disabledText: {
    color: '#E0E0E0',
  },
  priceText: {
    position: 'absolute',
    bottom: vs(4),
    fontSize: ms(8),
    color: '#9E9E9E',
    fontWeight: '500',
  },
});

export default CustomCalendar;
