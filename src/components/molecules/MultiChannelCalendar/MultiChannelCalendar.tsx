import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { s, vs, ms } from 'react-native-size-matters';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const OTAs = {
  AIRBNB: { label: 'Airbnb', color: '#FF5A5F' },
  GATHERN: { label: 'Gathern', color: '#A855F7' },
  BOOKING: { label: 'Direct', color: '#3B82F6' },
};

interface MultiChannelCalendarProps {
  markedDates: any;
  onDayPress: (day: any) => void;
  currentDate?: string;
}

const CustomDay = ({ date, state, marking, onPress }: any) => {
  // Extract channels/sources from the marking object
  const dots = marking?.channels || [];
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

      {/* DOTS CONTAINER - Represents different booking channels */}
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
          textMonthFontSize: ms(18),
          textSectionTitleColor: '#7B8D88',
          textDayHeaderFontSize: ms(13),
          textDayHeaderFontWeight: '600',
        } as any}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: ms(20),
    padding: s(12),
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  legendHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: s(15), 
    marginBottom: vs(12),
    paddingBottom: vs(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
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
    fontWeight: '600' 
  },
  dayContainer: { 
    height: vs(50), // Tightened height for price-less view
    width: (SCREEN_WIDTH - s(80)) / 7, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  selectedDayContainer: {},
  dayText: { 
    fontSize: ms(15), 
    fontWeight: '500', 
    color: '#333', 
    marginBottom: vs(2),
    zIndex: 10,
  },
  selectedDayText: { 
    color: '#1A332C', 
    fontWeight: '700' 
  },
  disabledText: { 
    color: '#D1D1D1' 
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
    width: ms(5), 
    height: ms(5), 
    borderRadius: ms(2.5), 
  },
  selectionRing: { 
    position: 'absolute', 
    width: ms(34), 
    height: ms(34), 
    borderRadius: ms(17), 
    borderWidth: 1.5, 
    borderColor: '#1A332C', 
    top: vs(2),
    zIndex: 1,
  }
});

export default MultiChannelCalendar;