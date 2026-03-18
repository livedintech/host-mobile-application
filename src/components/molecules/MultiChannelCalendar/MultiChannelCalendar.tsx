import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { s, vs, ms } from 'react-native-size-matters';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import CalendarListingCard from '../CalendarListingCard/CalendarListingCard';
import { RawBookingData } from '@/types/api/bookingTypes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const OTAs = {
  AIRBNB: { label: 'Airbnb', color: '#FF5A5F' },
  GATHERN: { label: 'Gathern', color: '#A855F7' },
  LIVEDIN: { label: 'Livedin', color: '#21AA8F' }, // Using your new Figma Teal
};

interface MultiChannelCalendarProps {
  markedDates: any;
  onDayPress: (day: any) => void;
  currentDate?: string;
  bookings: RawBookingData[];
}

const CustomDay = ({ date, state, marking, onPress }: any) => {
  const dots = marking?.channels || [];
  const isSelected = marking?.activeSelection;

  return (
    <TouchableOpacity 
      style={styles.dayContainer} 
      onPress={() => onPress(date)}
      activeOpacity={0.7}
    >
      {/* SELECTION RING */}
      {isSelected && <View style={styles.selectionRing} />}

      <Text style={[
        styles.dayText, 
        state === 'disabled' && styles.disabledText,
        isSelected && styles.selectedDayText
      ]}>
        {date.day}
      </Text>

      {/* DOTS CONTAINER */}
      <View style={styles.dotContainer}>
        {dots.map((source: string, index: number) => {
          const config = OTAs[source?.toUpperCase() as keyof typeof OTAs];
          return (
            <View
              key={`${date.dateString}-${index}`}
              style={[styles.dot, { backgroundColor: config?.color || '#CCC' }]}
            />
          );
        })}
      </View>
    </TouchableOpacity>
  );
};

const LegendItem = ({ config }: { config: { label: string, color: string } }) => (
  <View style={styles.legendItem}>
    <View style={[styles.lDot, { backgroundColor: config.color }]} />
    <Text style={[styles.lText, { color: config.color }]}>{config.label}</Text>
  </View>
);


const MultiChannelCalendar = ({ markedDates, onDayPress, currentDate, bookings }: MultiChannelCalendarProps) => {
  return (
    <View>
      {bookings.map((item) => (
        <CalendarListingCard 
          key={item.id} 
          item={item}
        />
      ))}

      {/* <Calendar
        current={currentDate}
        markingType="custom"
        markedDates={markedDates}
        dayComponent={({ date, state, marking }: any) => (
          <CustomDay
            date={date}
            state={state}
            marking={marking}
            onPress={onDayPress}
          />
        )}
        renderArrow={(dir) => (
          dir === 'left' ?
          <ChevronLeft size={ms(22)} color="#A0A0A0" /> :
          <ChevronRight size={ms(22)} color="#1A332C" />
        )}
        style={{ backgroundColor: 'transparent' }}
        theme={{
          backgroundColor: 'transparent',
          calendarBackground: 'transparent',
          // Header Styles
          monthTextColor: '#1A332C',
          textMonthFontWeight: '700',
          textMonthFontSize: ms(18),
          textSectionTitleColor: '#7B8D88',
          textDayHeaderFontSize: ms(13),
          textDayHeaderFontWeight: '600',
          // Clear internal library backgrounds
          'stylesheet.calendar.main': {
            container: {
              paddingLeft: 0,
              paddingRight: 0,
              backgroundColor: 'transparent',
            }
          }
        } as any}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    // --- GLASS STYLE ---
    backgroundColor: 'rgba(255, 255, 255, 0.15)', 
    borderRadius: ms(24), 
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)', 
    // ------------------
    padding: s(12),
    width: '100%',
    alignSelf: 'center',
  },
  legendHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: s(15), 
    marginBottom: vs(12),
    paddingBottom: vs(12),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)', // Softened divider
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lDot: { 
    width: ms(7), 
    height: ms(7), 
    borderRadius: 4, 
    marginRight: s(5) 
  },
  lText: { 
    fontSize: ms(11), 
    fontWeight: '700' 
  },
  dayContainer: { 
    height: vs(50),
    width: (SCREEN_WIDTH - s(80)) / 7, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  dayText: { 
    fontSize: ms(15), 
    fontWeight: '600', 
    color: '#1A332C', 
    marginBottom: vs(2),
    zIndex: 10,
  },
  selectedDayText: { 
    color: '#21AA8F', // Highlight selected text with Teal
    fontWeight: '800' 
  },
  disabledText: { 
    color: 'rgba(26, 51, 44, 0.3)' 
  },
  dotContainer: { 
    flexDirection: 'row', 
    gap: s(3), 
    height: vs(8), 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: '100%',
  },
  dot: { 
    width: ms(6), 
    height: ms(6), 
    borderRadius: ms(3), 
  },
  selectionRing: { 
    position: 'absolute', 
    width: ms(36), 
    height: ms(36), 
    borderRadius: ms(18), 
    borderWidth: 2, 
    borderColor: '#21AA8F',
    top: vs(1),
    zIndex: 1,
  }
});

export default MultiChannelCalendar;

