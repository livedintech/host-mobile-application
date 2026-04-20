import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import AnalyticContainers from '../containers/AnalyticContainers';
import { useForm, useWatch } from 'react-hook-form'; 
import { Colors } from '@/theme/colors';
import AnalyticsTabBar from '../components/AnalyticsTabBar';
import AnalyticsChart from '../components/AnalyticsChart';

const BG_IMAGE = require('@/assets/img/background/channelPerformanceBG.png');



const ChannelPerformanceScreen = () => {
  const [activeTab, setActiveTab] = useState('reservation');

  const {
    listingOptions,
    AnalyticChannelChartData,
    isLoadingAnalyticsChannelChart,
    handleChartListingChange,
    chartListingIds,
  } = AnalyticContainers();

  const { control, setValue, formState: { errors } } = useForm({
    defaultValues: { listings: chartListingIds || [] },
  });

  // BRIDGE: Watch the 'listings' field in the form
  const watchedListings = useWatch({
    control,
    name: 'listings',
  });

  // TRIGGER: When dropdown changes, tell the container to refetch API
  useEffect(() => {
    if (watchedListings !== undefined) {
      handleChartListingChange(watchedListings);
    }
  }, [watchedListings, handleChartListingChange]);

  const rawList = Array.isArray(AnalyticChannelChartData?.data) ? AnalyticChannelChartData.data : [];

  // Calculate relative percentages for the bars
  const values = rawList.map((item: any) => {
    if (activeTab === 'revenue') return Number(item?.revenue || 0);
    if (activeTab === 'nights') return Number(item?.nights || 0);
    return Number(item?.reservations || 0);
  });
  const maxVal = values.length > 0 ? Math.max(...values) : 1;
  const safeMaxVal = maxVal <= 0 ? 1 : maxVal;

const chartData = rawList.map((item: any) => {
    let displayValue = 0;
    if (activeTab === 'reservation') displayValue = item?.reservations || 0;
    else if (activeTab === 'revenue') displayValue = item?.revenue || 0;
    else if (activeTab === 'nights') displayValue = item?.nights || 0;

    // 1. Handle the Label (BookingCom)
    const rawChannel = item?.channel?.toLowerCase() || '';
    const displayLabel = rawChannel === 'bookingcom' 
      ? 'BookingCom' 
      : rawChannel.charAt(0).toUpperCase() + rawChannel.slice(1);

    // 2. Handle the Color (#16AEDD for BookingCom)
    let barColor = '#00A78E'; // Default green
    if (rawChannel === 'airbnb') {
      barColor = '#FF0000';
    } else if (rawChannel === 'gathern') {
      barColor = '#CE92F3';
    } else if (rawChannel === 'bookingcom') {
      barColor = '#16AEDD'; // Your new blue color
    }

    console.log("displayValue,safeMaxVal",displayValue,safeMaxVal)

    return {
      value: displayValue,
      count: item?.reservations || 0,
      label: displayLabel,
      percentage: (displayValue / safeMaxVal) * 100,
      color: barColor,
    };
  });

  const totalValue = rawList.reduce((acc: number, curr: any) => {
    const val = activeTab === 'revenue' ? curr?.revenue : activeTab === 'nights' ? curr?.nights : curr?.reservations;
    return acc + (Number(val) || 0);
  }, 0);

  return (
    <ImageBackground source={BG_IMAGE} style={styles.backgroundImage} resizeMode="cover">
      <View style={styles.safe}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <AnalyticsTabBar
            activeTab={activeTab}
            onChange={setActiveTab}
            ListingOptions={listingOptions || []}
            control={control}
            errors={errors}
          />

          {isLoadingAnalyticsChannelChart ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={Colors.BRUNSWICK_GREEN} />
            </View>
          ) : (
            <AnalyticsChart activeTab={activeTab} data={chartData} total={totalValue} />
          )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  safe: { flex: 1 },
  container: { flex: 1 },
  loader: { marginTop: 50, alignItems: 'center' },
});

export default ChannelPerformanceScreen;