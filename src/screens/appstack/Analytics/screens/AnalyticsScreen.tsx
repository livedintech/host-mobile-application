import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Colors } from '@/theme/colors';
import AnalyticsHeader from '../components/AnalyticsHeader';
import AnalyticsTabBar from '../components/AnalyticsTabBar';
import AnalyticsChart from '../components/AnalyticsChart';
import AnalyticsCard from '../components/AnalyticsCard';
import { useReservationAnalytics } from '../containers/useReservationAnalytics';
import { useRevenueAnalytics } from '../containers/useRevenueAnalytics';
import { useNightsAnalytics } from '../containers/useNightsAnalytics';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Toast from 'react-native-toast-message';

type TabType = 'reservation' | 'revenue' | 'nights';

const AnalyticsScreen = () => {
  const [activeTab, setActiveTab] = useState<TabType>('reservation');

  const reservation = useReservationAnalytics();
  const revenue = useRevenueAnalytics();
  const nights = useNightsAnalytics();

  const dataMap = { reservation, revenue, nights };
  const current = dataMap[activeTab];

  // Handler for the download report button
  const handleDownloadReport = () => {
    // Simulated result object
    const result = { message: 'Report downloaded successfully' };

    Toast.show({
      type: 'success',
      text1: result?.message || 'Uploaded successfully',
    });
  };
  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <AnalyticsHeader />

        {/* KPI Grid */}
        <View style={styles.grid}>
          {current.summary.map((item, index) => (
            <AnalyticsCard key={index} item={item} variant="kpi" />
          ))}
        </View>

        <AnalyticsTabBar
          activeTab={activeTab}
          onChange={(tab: TabType) => setActiveTab(tab)}
        />

        <AnalyticsChart
          activeTab={activeTab}
          data={current.chart}
          total={current.total}
        />

        {/* Listing Performance Heading - OUTSIDE the cards */}
        <View style={styles.listingHeaderRow}>
          <AppText
            text="Listing Performance"
            type="Bold"
            fontSize={20}
            color={Colors.BRUNSWICK_GREEN}
          />
          <Svgicons path="graphBarIncreaseIcon" ml={8} size={20} />
        </View>

        {/* Listing Performance Cards */}
        {current.listings.map((listing, index) => (
          <AnalyticsCard key={index} item={listing} variant="listing" />
        ))}

        <AppButton
          title="Download Report"
          onPress={handleDownloadReport}
          mt={24}
          backgroundColor={Colors.WHITE}
          borderColor={Colors.SMOOTH_GREY}
          color={Colors.BRUNSWICK_GREEN}
        />
      </ScrollView>
    </View>
  );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.WHITE },
  container: { flex: 1, padding: 16 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  listingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 26,
  },
});
