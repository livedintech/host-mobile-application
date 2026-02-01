import React from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, Text } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import CustomCalendar from '@/components/molecules/CustomCalendar/CustomCalendar';

const CalendarScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar View</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* The Calendar Component */}
        <CustomCalendar />

        {/* Legend / Info Section */}
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Quick Legend</Text>
          <View style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: '#D32F2F' }]} />
            <Text style={styles.legendText}>Airbnb Booking (Occupied)</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: '#B39DDB' }]} />
            <Text style={styles.legendText}>Gathern Booking (Occupied)</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#DDD' }]} />
            <Text style={styles.legendText}>Available (with daily rate)</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Light grey background to make the white calendar card pop
  },
  header: {
    paddingHorizontal: s(20),
    paddingVertical: vs(15),
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: ms(24),
    fontWeight: '800',
    color: '#1A332C',
    letterSpacing: -0.5,
  },
  scrollContainer: {
    paddingVertical: vs(20),
    alignItems: 'center',
  },
  legendContainer: {
    width: '90%',
    backgroundColor: '#FFF',
    marginTop: vs(20),
    padding: s(20),
    borderRadius: ms(20),
    // Match the elevation of the calendar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  legendTitle: {
    fontSize: ms(16),
    fontWeight: '700',
    color: '#1A332C',
    marginBottom: vs(12),
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  dot: {
    width: ms(12),
    height: ms(12),
    borderRadius: ms(6),
    marginRight: s(10),
  },
  legendText: {
    fontSize: ms(13),
    color: '#666',
    fontWeight: '500',
  },
});

export default CalendarScreen;