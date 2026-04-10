import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import CalendarListingCard from '../CalendarListingCard/CalendarListingCard';
import { RawBookingData } from '@/types/api/bookingTypes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MultiChannelCalendarProps {
  markedDates: any;
  onDayPress: (day: any) => void;
  currentDate?: string;
  bookings: RawBookingData[];
  onListingPress?: (id: string | number) => void;
}

const MultiChannelCalendar = ({ bookings, onListingPress }: MultiChannelCalendarProps) => {
  console.log("bookingTestt",bookings)
  return (
    <View style={styles.mainWrapper}>
      {bookings.map((item) => (
        <View key={item.listing_id} style={styles.overflowShield}>
          <CalendarListingCard 
            item={item}
            onPress={onListingPress}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)', 
    borderRadius: ms(24), 
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)', 
    padding: s(12),
    width: '100%',
    alignSelf: 'center',
  },
  mainWrapper: {
    width: '100%',
  },
  overflowShield: {
    borderRadius: ms(24),
    overflow: 'hidden',  
    marginBottom: vs(12),
  },
  legendHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: s(15), 
    marginBottom: vs(12),
    paddingBottom: vs(12),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
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
    width: (SCREEN_WIDTH - s(56)) / 7,
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
    color: '#21AA8F',
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

