import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { s, vs, ms } from 'react-native-size-matters';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- OTA Configuration ---
const OTAs = {
  AIRBNB: { label: 'Airbnb', color: '#FF5A5F' },
  GATHERN: { label: 'Gathern', color: '#A855F7' },
  BOOKING: { label: 'Booking.com', color: '#3B82F6' },
};

// --- Mock Data ---
const DOTS_DATA: any = {
  '2026-01-01': { channels: ['airbnb', 'gathern'], price: '500' },
  '2026-01-02': { channels: ['airbnb', 'booking', 'gathern'], price: '500' },
  '2026-01-03': { channels: ['airbnb', 'booking', 'gathern'], price: '500' },
  '2026-01-04': { channels: ['airbnb', 'booking', 'gathern'], price: '500' },
  '2026-01-05': { channels: ['airbnb', 'booking', 'gathern'], price: '500' },
};

const CustomDay = ({ date, state, marking, onPress }: any) => {
  const data = marking || {};
  const isActiveSelection = data.activeSelection;
  const hasChannels = data.channels && data.channels.length > 0;

  return (
    <TouchableOpacity
      style={styles.dayContainer}
      onPress={() => onPress(date)}
      activeOpacity={0.8}
    >
      {/* User Selection Ring */}
      {isActiveSelection && <View style={styles.selectionRing} />}

      {/* Date Number */}
      <Text style={[
        styles.dayText,
        state === 'disabled' && styles.disabledText,
        isActiveSelection && styles.selectedDayText
      ]}>
        {date.day}
      </Text>

      {/* Multi-OTA Dots */}
      <View style={styles.dotContainer}>
        {hasChannels && data.channels.map((channel: string, index: number) => {
          const config = OTAs[channel.toUpperCase() as keyof typeof OTAs];
          return (
            <View
              key={index}
              style={[styles.dot, { backgroundColor: config?.color || '#CCC' }]}
            />
          );
        })}
      </View>

      {/* Pricing */}
      {state !== 'disabled' && (
        <Text style={styles.priceText}>SAR {data.price || '500'}</Text>
      )}
    </TouchableOpacity>
  );
};

const MultiChannelCalendar = () => {
  const [selected, setSelected] = useState('');

  const markedDates = useMemo(() => ({
    ...DOTS_DATA,
    [selected]: { ...DOTS_DATA[selected], activeSelection: true }
  }), [selected]);

  return (
    <View style={styles.card}>
      {/* Legend Header with Color-Matched Text */}
      <View style={styles.legendHeader}>
        <LegendItem config={OTAs.AIRBNB} />
        <LegendItem config={OTAs.GATHERN} />
        <LegendItem config={OTAs.BOOKING} />
      </View>

      <Calendar
        current={'2026-01-01'}
        dayComponent={({ date, state, marking }: any) => (
          <CustomDay
            date={date}
            state={state}
            marking={marking}
            onPress={(d: any) => setSelected(d.dateString)}
          />
        )}
        markedDates={markedDates}
        renderArrow={(dir) => (
          dir === 'left' ?
          <ChevronLeft size={22} color="#A0A0A0" /> :
          <ChevronRight size={22} color="#A0A0A0" />
        )}
        theme={{
          calendarBackground: 'transparent',
          monthTextColor: '#1A332C',
          textMonthFontWeight: '700',
          textMonthFontSize: ms(20),
          // Clean week headers
          'stylesheet.calendar.header': {
            week: {
              marginTop: vs(15),
              flexDirection: 'row',
              justifyContent: 'space-around',
              borderBottomWidth: 0,
            }
          }
        }}
      />
    </View>
  );
};

// --- Helper Components ---
const LegendItem = ({ config }: { config: { label: string, color: string } }) => (
  <View style={styles.legendItem}>
    <View style={[styles.lDot, { backgroundColor: config.color }]} />
    <Text style={[styles.lText, { color: config.color }]}>{config.label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: ms(25),
    padding: s(15),
    width: SCREEN_WIDTH - s(30),
    alignSelf: 'center',
    // Professional shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  legendHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: s(15),
    marginBottom: vs(15),
    paddingBottom: vs(10),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6)
  },
  lDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: 4
  },
  lText: {
    fontSize: ms(13),
    fontWeight: '700', // Bold matching the screenshot
    letterSpacing: -0.2,
  },
  dayContainer: {
    height: vs(65),
    width: (SCREEN_WIDTH - s(80)) / 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: ms(18),
    fontWeight: '500',
    color: '#4A4A4A',
    marginBottom: vs(2),
  },
  selectedDayText: {
    color: '#2D4A41',
    fontWeight: '800'
  },
  disabledText: {
    color: '#E0E0E0'
  },
  dotContainer: {
    flexDirection: 'row',
    gap: s(3),
    height: vs(6),
    alignItems: 'center',
    marginBottom: vs(4),
  },
  dot: {
    width: ms(5),
    height: ms(5),
    borderRadius: 3,
  },
  priceText: {
    fontSize: ms(8.5),
    color: '#999',
    fontWeight: '600',
  },
  selectionRing: {
    position: 'absolute',
    width: ms(44),
    height: ms(44),
    borderRadius: ms(22),
    borderWidth: 1.5,
    borderColor: '#2D4A41',
    top: vs(4),
  }
});

export default MultiChannelCalendar;