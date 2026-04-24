import { useTranslation } from 'react-i18next';
import React, { useState, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Colors } from '@/theme/colors';
import AnalyticsHeader from '../components/AnalyticsHeader';
import AnalyticsTabBar from '../components/AnalyticsTabBar';
import AnalyticsChart from '../components/AnalyticsChart';
import AnalyticsCard from '../components/AnalyticsCard';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppText from '@/components/molecules/AppText/AppText';
import AnalyticContainers from '../containers/AnalyticContainers';
import { KPIItem, ListingPerformanceItem } from '@/types/api/AnalyticsTypes';
import SpinnerLoader from '@/components/molecules/SmallLoader';

type TabType = 'reservation' | 'revenue' | 'nights';
interface ChannelData { 
  channel: string; 
  nights: number; 
  revenue: number; 
}

const AnalyticsScreen = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('reservation');
  
  const {
    listingOptions,
    AnalyticChannelChartData,
    isLoadingAnalyticsChannelChart,
    chartListingIds,
    handleChartListingChange,
    AnalyticsSummary,
    isLoadingAnalytics,
    AnalyticsPerformance,
    isLoadingAnalyticsPerformance,
    applyFilters,
    resetFilters,
    filters,
    channelOptions,
    dateOptions,
  } = AnalyticContainers();

  /**
   * Data Processing for Chart Module
   * Handles empty states and specific platform coloring
   */
  const current = useMemo(() => {
    const rawData: ChannelData[] = AnalyticChannelChartData?.data || [];
    
    // Fallback for No Data
    if (rawData.length === 0) {
      return { 
        total: activeTab === 'revenue' ? "SAR 0" : 0, 
        chart: [], 
        hasData: false 
      };
    }

    const colors: Record<string, string> = {
      airbnb: '#ED0509',
      gathern: '#8C05ED',
      direct: '#1B4F44',
      almosafer: '#1B284F',
      aqar: '#08873D',
      whatsapp: '#5C5C5C',
      ltr_host: '#000000',
      host_lead: '#D9BB20',
      ltr_direct_with_ejar: '#40B69C',
    };

    const totalNights = rawData.reduce((acc, curr) => acc + curr.nights, 0);
    const totalRev = rawData.reduce((acc, curr) => acc + curr.revenue, 0);
    const formatLabel = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    if (activeTab === 'reservation') {
      return {
        hasData: true,
        total: totalNights,
        chart: rawData.map((item: ChannelData) => ({
          label: formatLabel(item.channel),
          value: item.nights,
          count: item.nights,
          percentage: totalNights > 0 ? `${((item.nights / totalNights) * 100).toFixed(0)}%` : '0%',
          color: colors[item.channel] || '#CCC',
        })),
      };
    }

    // Revenue and Nights Bar Logic
    const maxVal = Math.max(...rawData.map(o => activeTab === 'revenue' ? o.revenue : o.nights), 1);
    
    return {
      hasData: true,
      total: activeTab === 'revenue' ? `SAR ${totalRev.toLocaleString()}` : totalNights,
      chart: rawData.map((item: ChannelData) => ({
        label: formatLabel(item.channel),
        value: activeTab === 'revenue' ? `SAR ${item.revenue.toLocaleString()}` : `${item.nights} nights`,
        percentage: `${((activeTab === 'revenue' ? item.revenue : item.nights) / maxVal) * 100}%`,
        color: colors[item.channel] || '#CCC',
      }))
    };
  }, [AnalyticChannelChartData, activeTab]);

  return (
    <View style={styles.root}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* GLOBAL HEADER: Controls Modal Filters */}
        <AnalyticsHeader 
          listingOptions={listingOptions} 
          applyFilters={applyFilters}
          resetFilters={resetFilters} 
          filters={filters}
          channelOptions={channelOptions} 
          dateOptions={dateOptions}
        />
        
        {/* MODULE 1: KPI Summary (Linked to Modal Filters) */}
        <View style={styles.grid}>
          {isLoadingAnalytics ? (
            <View style={styles.loaderFullWidth}><SpinnerLoader /></View>
          ) : (
            AnalyticsSummary?.data
              ?.filter((i: KPIItem) => i.key !== 'rental_revenue' && i.key !== 'nights_booked')
              ?.map((i: KPIItem, idx: number) => (
                <AnalyticsCard key={idx} item={i} variant="kpi" />
              ))
          )}
        </View>

        {/* TAB BAR: Controls Chart-Specific Listings Selection */}
        <AnalyticsTabBar
          activeTab={activeTab}
          onChange={setActiveTab}
          ListingOptions={listingOptions}
          initialListings={chartListingIds}
          onListingChange={handleChartListingChange}
        />

        {/* MODULE 2: Analytics Chart (Linked to TabBar Selection) */}
        <View style={styles.chartSection}>
          {isLoadingAnalyticsChannelChart ? (
            <SpinnerLoader containerStyles={{ height: 200 }} />
          ) : (
            <AnalyticsChart 
              activeTab={activeTab} 
              data={current.chart} 
              total={current.total} 
            />
          )}
        </View>

        {/* LISTING PERFORMANCE HEADER */}
        <View style={styles.listingHeaderRow}>
          <AppText 
            text={t('app.analytics.listing_performance')}
            type="Bold" 
            fontSize={20} 
            color={Colors.BRUNSWICK_GREEN} 
          />
          <Svgicons path="graphBarIncreaseIcon" ml={8} size={20} />
        </View>

        {/* MODULE 3: Listing Performance List */}
        <View style={styles.performanceSection}>
          {isLoadingAnalyticsPerformance ? (
            <SpinnerLoader />
          ) : (
            AnalyticsPerformance?.data?.map((l: ListingPerformanceItem, idx: number) => (
              <AnalyticsCard key={idx} item={l} variant="listing" />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: Colors.WHITE 
  },
  container: { 
    flex: 1, 
    padding: 16 
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    minHeight: 120,
    marginTop: 10
  },
  loaderFullWidth: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20
  },
  chartSection: { 
    minHeight: 250,
    marginVertical: 10
  },
  performanceSection: {
    minHeight: 150
  },
  listingHeaderRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 20, 
    marginBottom: 26 
  },
});