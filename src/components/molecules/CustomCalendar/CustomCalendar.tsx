import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { s, vs, ms } from 'react-native-size-matters';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { AirbnbIcon, GathernIcon } from './CustomIcons'; 

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const OTAs = {
  AIRBNB: { label: 'Airbnb', color: '#FF5A5F' },
  GATHERN: { label: 'Gathern', color: '#A855F7' },
  BOOKING: { label: 'Direct', color: '#3B82F6' },
};

const CustomDay = ({ date, state, marking, onPress }: any) => {
  const isActive = !!marking?.type; 
  const { type, color, textColor, guest, ota, price, showLabel } = marking || {};
  
  return (
    <View style={styles.dayCell}>
      {/* 1. SELECTION BACKGROUND (Move outside/before Touchable and disable pointers) */}
      {isActive && (
        <View
          pointerEvents="none" // <--- CRITICAL: Allows touch to pass through to the button
          style={[
            styles.selectionBg,
            { backgroundColor: color || '#E0E0E0' },
            type === 'single' && styles.circleBg,
            // Use 'starting' instead of 'start' to match your ListingScreen logic
            (type === 'start' || type === 'starting') && styles.startEdge, 
            type === 'middle' && styles.middleEdge,
            (type === 'end' || type === 'ending') && styles.endEdge,
          ]}
        />
      )}

      <TouchableOpacity
        style={styles.dayContainer}
        onPress={() => onPress(date)}
        activeOpacity={0.8}
      >
        <View style={styles.numberContainer}>
          <Text
            style={[
              styles.dayNumber,
              state === 'disabled' ? styles.disabledText : { color: textColor || '#1A332C' },
            ]}
          >
            {date.day}
          </Text>
        </View>

        {!isActive && state !== 'disabled' && (
          <Text style={styles.priceText}>
            SAR {price || '500'}
          </Text>
        )}
      </TouchableOpacity>

      {/* GUEST LABEL */}
      {showLabel && (
        <View style={styles.labelWrapper} pointerEvents="none">
          <View style={styles.otaBadge}>
            {/* Logic for icons */}
            <Text style={styles.guestText} numberOfLines={1}>{guest}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const LegendItem = ({ config }: { config: { label: string, color: string } }) => (
  <View style={styles.legendItem}>
    <View style={[styles.lDot, { backgroundColor: config.color }]} />
    <Text style={[styles.lText, { color: config.color }]}>{config.label}</Text>
  </View>
);

const CustomCalendar = ({ markedDates, onDayPress, currentDate }: any) => {
  return (
    <View style={styles.card}>
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
        } as any}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFF', width: '100%', paddingTop: vs(10) },
  dayCell: {
    width: (SCREEN_WIDTH - s(32)) / 7,
    height: vs(60),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionBg: {
    position: 'absolute',
    height: vs(40),
    width: '100%',
    zIndex: 1,
  },
  circleBg: { width: vs(40), borderRadius: vs(20) },
  startEdge: { borderTopLeftRadius: ms(20), borderBottomLeftRadius: ms(20), width: '110%', left: '10%' },
  middleEdge: { width: '120%' },
  endEdge: { borderTopRightRadius: ms(20), borderBottomRightRadius: ms(20), width: '110%', right: '10%' },
  
  labelWrapper: {
    position: 'absolute',
    top: vs(4),
    left: s(12),
    zIndex: 100, // Highest priority
    width: s(120), // Wide enough to span across the next day
    flexDirection: 'row',
  },
  otaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: s(4),
    paddingVertical: vs(1),
    borderRadius: ms(8),
  },
  guestText: {
    fontSize: ms(8.5),
    fontWeight: '800',
    color: '#333',
    marginLeft: s(2),
  },
  numberContainer: {
    zIndex: 10,
    marginTop: vs(12),
  },
  dayNumber: { fontSize: ms(16), fontWeight: '600' },
  disabledText: { color: '#E0E0E0' },
  priceText: { position: 'absolute', bottom: vs(2), fontSize: ms(8), color: '#9E9E9E', fontWeight: '600' },
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
});

export default CustomCalendar;