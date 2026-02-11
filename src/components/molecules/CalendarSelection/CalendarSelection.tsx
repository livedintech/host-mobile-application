import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { s, vs } from 'react-native-size-matters';
import DropdownField from '@/components/molecules/Input/DropdownField';
import CustomCalendar from '@/components/molecules/CustomCalendar/CustomCalendar';
import MultiChannelCalendar from '@/components/molecules/MultiChannelCalendar/MultiChannelCalendar';

export const CalendarSection = ({ control, errors, listingOptions, selectedListingId, markedDates, onDayPress }: any) => (
  <ScrollView contentContainerStyle={styles.scrollContainer}>
    <DropdownField 
      name="listing_selection" 
      control={control} 
      errors={errors} 
      label="Property" 
      data={listingOptions} 
      placeholder="All Listings" 
    />
    <View style={{ marginTop: vs(20) }}>
      {selectedListingId ? (
        <CustomCalendar markedDates={markedDates} onDayPress={onDayPress} />
      ) : (
        <MultiChannelCalendar markedDates={markedDates} onDayPress={onDayPress} />
      )}
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  scrollContainer: { paddingHorizontal: s(16), paddingBottom: 20 },
});