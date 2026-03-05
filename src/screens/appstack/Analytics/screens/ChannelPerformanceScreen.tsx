import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import AnalyticContainers from '../containers/AnalyticContainers';
import { useForm, useWatch } from 'react-hook-form'; // Added useWatch
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

    return {
      value: displayValue,
      count: item?.reservations || 0,
      label: item?.channel ? item.channel.charAt(0).toUpperCase() + item.channel.slice(1) : 'Unknown',
      percentage: (displayValue / safeMaxVal) * 100,
      color: item?.channel === 'airbnb' ? '#DF3B3E' : item?.channel === 'gathern' ? '#A85CDA' : '#00A78E',
    };
  });

  const totalValue = rawList.reduce((acc: number, curr: any) => {
    const val = activeTab === 'revenue' ? curr?.revenue : activeTab === 'nights' ? curr?.nights : curr?.reservations;
    return acc + (Number(val) || 0);
  }, 0);

  return (
    <ImageBackground source={BG_IMAGE} style={styles.backgroundImage} resizeMode="cover">
      <SafeAreaView style={styles.safe}>
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
      </SafeAreaView>
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