import React from 'react';
import { View, ScrollView } from 'react-native';
import { vs } from 'react-native-size-matters';
import DropdownField from '@/components/molecules/Input/DropdownField';
import CustomCalendar from '@/components/molecules/CustomCalendar/CustomCalendar';
import MultiChannelCalendar from '@/components/molecules/MultiChannelCalendar/MultiChannelCalendar';
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView';

interface Props {
  control: any;
  errors: any;
  listingOptions: any[];
  selectedListingId: string;
  markedDates: any;
  onDayPress: (day: any) => void;
  defaultPrice?: number,
   onRefresh?: () => Promise<any> | void;
     isLoading: boolean;
}
export const CalendarSection = ({ control, errors, listingOptions, selectedListingId, markedDates, onDayPress, defaultPrice, isLoading,onRefresh  }: Props) => (
  <RefreshableScrollView isLoading={isLoading} onRefresh={onRefresh} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}>
    <DropdownField name="listing_selection" control={control} errors={errors} label="Property" data={listingOptions} placeholder="All Listings" />
    <View style={{ marginTop: vs(20) }}>
      {selectedListingId ? (
        <CustomCalendar markedDates={markedDates} onDayPress={onDayPress} defaultPrice={defaultPrice} />
      ) : (
        <MultiChannelCalendar markedDates={markedDates} onDayPress={onDayPress} />
      )}
    </View>
  </RefreshableScrollView>
);