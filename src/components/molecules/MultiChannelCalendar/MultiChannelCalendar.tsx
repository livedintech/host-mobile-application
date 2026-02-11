import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { s, vs, ms } from 'react-native-size-matters';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const OTAs = {
  AIRBNB: { label: 'Airbnb', color: '#FF5A5F' },
  GATHERN: { label: 'Gathern', color: '#A855F7' },
  BOOKING: { label: 'Booking.com', color: '#3B82F6' },
};

interface MultiChannelCalendarProps {
  markedDates: any;
  onDayPress: (day: any) => void;
  currentDate?: string;
}

const CustomDay = ({ date, state, marking, onPress }: any) => {
  // Extract channels/sources from the marking object
  const dots = marking?.channels || [];
  const displayPrice = marking?.price;
  const isSelected = marking?.activeSelection;

  return (
    <TouchableOpacity 
      style={[
        styles.dayContainer, 
        isSelected && styles.selectedDayContainer
      ]} 
      onPress={() => onPress(date)}
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

      {/* PRICE LABEL */}
      {state !== 'disabled' && displayPrice && (
        <Text style={[styles.priceText, isSelected && styles.selectedPriceText]}>
          SAR {displayPrice}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const LegendItem = ({ config }: { config: { label: string, color: string } }) => (
  <View style={styles.legendItem}>
    <View style={[styles.lDot, { backgroundColor: config.color }]} />
    <Text style={[styles.lText, { color: config.color }]}>{config.label}</Text>
  </View>
);

const MultiChannelCalendar = ({ markedDates, onDayPress, currentDate }: MultiChannelCalendarProps) => {
  return (
    <View style={styles.card}>
      {/* LEGEND HEADER */}
      <View style={styles.legendHeader}>
        <LegendItem config={OTAs.AIRBNB} />
        <LegendItem config={OTAs.GATHERN} />
        <LegendItem config={OTAs.BOOKING} />
      </View>

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
          />
        )}
        renderArrow={(dir) => (
          dir === 'left' ?
          <ChevronLeft size={ms(22)} color="#A0A0A0" /> :
          <ChevronRight size={ms(22)} color="#1A332C" />
        )}
        theme={{
          calendarBackground: 'transparent',
          monthTextColor: '#1A332C',
          textMonthFontWeight: '700',
          textMonthFontSize: ms(20),
          textSectionTitleColor: '#7B8D88',
          textDayHeaderFontSize: ms(14),
          textDayHeaderFontWeight: '600',
          // We cast the whole object to bypass the strict 'Theme' check
        } as any}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: ms(25),
    padding: s(15),
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  legendHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: s(12), 
    marginBottom: vs(10),
    paddingBottom: vs(10),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lDot: { width: ms(8), height: ms(8), borderRadius: 4, marginRight: s(4) },
  lText: { fontSize: ms(12), fontWeight: '700' },
  dayContainer: { 
    height: vs(65), 
    width: (SCREEN_WIDTH - s(70)) / 7, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  selectedDayContainer: {
    // Optional: add a light background to the selected day cell
  },
  dayText: { 
    fontSize: ms(16), 
    fontWeight: '500', 
    color: '#4A4A4A', 
    marginBottom: vs(2),
    zIndex: 10,
  },
  selectedDayText: { 
    color: '#1A332C', 
    fontWeight: '800' 
  },
  disabledText: { 
    color: '#E0E0E0' 
  },
  dotContainer: { 
    flexDirection: 'row', 
    gap: s(4), // Increased gap for better spacing
    height: vs(10), 
    alignItems: 'center', 
    justifyContent: 'center', // Center the dots under the number
    width: '100%',
  },
  dot: { 
    width: ms(6), // Slightly larger for visibility
    height: ms(6), 
    borderRadius: ms(3), 
  },
  priceText: { 
    fontSize: ms(8.5), 
    color: '#999', 
    fontWeight: '600' 
  },
  selectedPriceText: { 
    color: '#1A332C' 
  },
  selectionRing: { 
    position: 'absolute', 
    width: ms(40), 
    height: ms(40), 
    borderRadius: ms(20), 
    borderWidth: 1.5, 
    borderColor: '#1A332C', 
    top: vs(4),
    zIndex: 1,
  }
});

export default MultiChannelCalendar;