import React from 'react';
import { View, ScrollView } from 'react-native';
import { vs } from 'react-native-size-matters';
import DropdownField from '@/components/molecules/Input/DropdownField';
import CustomCalendar from '@/components/molecules/CustomCalendar/CustomCalendar';
import MultiChannelCalendar from '@/components/molecules/MultiChannelCalendar/MultiChannelCalendar';
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView';
import { RawBookingData } from '@/types/api/bookingTypes';
import Metrics from '@/utility/Metrics';
import { useTranslation } from 'react-i18next';

interface Props {
  control: any;
  errors: any;
  listingOptions: any[];
  selectedListingId: string;
  markedDates: any;
  onDayPress: (day: any) => void;
  defaultPrice?: number;
  onRefresh?: () => Promise<any> | void;
  isLoading: boolean;
  bookings: RawBookingData[];
  onListingPress?: (id: string | number) => void;
}
export const CalendarSection = ({
  onListingPress,
  control,
  errors,
  listingOptions,
  bookings,
  selectedListingId,
  markedDates,
  onDayPress,
  defaultPrice,
  isLoading,
  onRefresh,
}: Props) => {
    const { t , i18n} = useTranslation();
    const isArabic = i18n.language === 'ar'
  
  console.log("markedDates",markedDates);
  console.log("bookingsTest",bookings)
  return (
    <RefreshableScrollView
      isLoading={isLoading}
      onRefresh={onRefresh}
      contentContainerStyle={{ paddingHorizontal: Metrics.baseMargin, paddingBottom: Metrics.scale(100) , paddingTop: Metrics.scale(20)}}
    >
      <DropdownField
        name="listing_selection"
        control={control}
        errors={errors}
        label={t('app.listing_screen.select_listing')}
        data={listingOptions}
        placeholder={t('app.listing_screen.all_listings')}
      />
      <View style={{marginTop:30}}>
        {selectedListingId ? (
          <CustomCalendar
            markedDates={markedDates}
            onDayPress={onDayPress}
            defaultPrice={defaultPrice}
            t={t}
            isArabic = {isArabic}
          />
        ) : (
          <MultiChannelCalendar
            markedDates={markedDates}
            onDayPress={onDayPress}
            bookings={bookings}
            onListingPress={onListingPress}
          />
        )}
      </View>
    </RefreshableScrollView>
  );
};
