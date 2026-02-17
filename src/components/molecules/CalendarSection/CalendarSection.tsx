import React from 'react';
import { View, ScrollView } from 'react-native';
import { vs } from 'react-native-size-matters';
import DropdownField from '@/components/molecules/Input/DropdownField';
import CustomCalendar from '@/components/molecules/CustomCalendar/CustomCalendar';
import MultiChannelCalendar from '@/components/molecules/MultiChannelCalendar/MultiChannelCalendar';

interface Props {
  control: any;
  errors: any;
  listingOptions: any[];
  selectedListingId: string;
  markedDates: any;
  onDayPress: (day: any) => void;
  defaultPrice?: number
}
export const CalendarSection = ({ control, errors, listingOptions, selectedListingId, markedDates, onDayPress, defaultPrice }: Props) => (
  <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}>
    <DropdownField name="listing_selection" control={control} errors={errors} label="Property" data={listingOptions} placeholder="All Listings" />
    <View style={{ marginTop: vs(20) }}>
      {selectedListingId ? (
        <CustomCalendar markedDates={markedDates} onDayPress={onDayPress} defaultPrice={defaultPrice} />
      ) : (
        <MultiChannelCalendar markedDates={markedDates} onDayPress={onDayPress} />
      )}
    </View>
  </ScrollView>
);