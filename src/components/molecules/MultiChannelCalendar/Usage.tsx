import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Dimensions
} from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import MultiChannelCalendar from '@/components/molecules/MultiChannelCalendar/MultiChannelCalendar';

const { width } = Dimensions.get('window');

const ScheduleScreen = () => {
  const [currentMonth, setCurrentMonth] = useState('January 2026');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* App Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Manage Schedule</Text>
          <Text style={styles.subHeaderText}>View and manage all channel bookings</Text>
        </View>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>AR</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        {/* The Multi-Channel Calendar Component */}
        <View style={styles.calendarWrapper}>
          <MultiChannelCalendar />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB', // Subtle off-white to let the calendar card pop
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(20),
    paddingVertical: vs(20),
    backgroundColor: '#FFF',
  },
  welcomeText: {
    fontSize: ms(22),
    fontWeight: '800',
    color: '#1A332C',
    letterSpacing: -0.5,
  },
  subHeaderText: {
    fontSize: ms(13),
    color: '#666',
    marginTop: vs(2),
  },
  avatarCircle: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D1D1',
  },
  avatarText: {
    fontSize: ms(14),
    fontWeight: '600',
    color: '#333',
  },
  scrollBody: {
    paddingBottom: vs(40),
  },
  calendarWrapper: {
    marginTop: vs(10),
    alignItems: 'center',
  },
  statsCard: {
    width: width - s(30),
    alignSelf: 'center',
    backgroundColor: '#FFF',
    borderRadius: ms(20),
    marginTop: vs(20),
    padding: s(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  statsTitle: {
    fontSize: ms(16),
    fontWeight: '700',
    color: '#1A332C',
    marginBottom: vs(15),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: vs(15),
  },
  statValue: {
    fontSize: ms(18),
    fontWeight: '800',
  },
  statLabel: {
    fontSize: ms(11),
    color: '#999',
    fontWeight: '600',
    marginTop: vs(2),
    textTransform: 'uppercase',
  },
  tipBox: {
    paddingHorizontal: s(30),
    marginTop: vs(25),
  },
  tipText: {
    fontSize: ms(13),
    color: '#7B8D88',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: vs(18),
  },
});

export default ScheduleScreen;