import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  StatusBar,
} from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import AnalyticContainers from '../containers/AnalyticContainers';
import FilterModal from '../components/FilterModal';
import PerformanceCard from '../components/PerformanceCard';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import { useAuthStore } from '@/store/useAuthStore';
import NoListingScreen from '../../NoListingScreen/NoListingScreen';
import { AnalyticsPerformanceSkeleton } from '@/components/Skeletons/AnalyticsScreenSkeleton';

const ListingPerformanceScreen = () => {
  const { t } = useTranslation();
          const { user } = useAuthStore();
  if (!user?.has_listing) {
    return <NoListingScreen/>;
  }

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const {
    AnalyticsPerformance,
    isLoadingAnalyticsPerformance,
    listingOptions,
    channelOptions,
    dateOptions,
    applyFilters,
    resetFilters,
    filters,
    refetchPerformance,
    formatNumber
  } = AnalyticContainers();

  // Ensure we have an array
  const performanceData = Array.isArray(AnalyticsPerformance?.data) 
    ? AnalyticsPerformance.data 
    : [];

  // Header component for the FlatList
  const ListHeader = () => (
    <AppText 
      text={t('app.analytics.listing_performance')} 
      type="Medium" 
      fontSize={26} 
      textAlign='left' 
      mt={50} 
      mb={36} 
      color="#000" 
    />
  );

  return (
    <ImageBackground
      source={require('@/assets/img/background/linearBG.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar barStyle="dark-content" />
      
      <View style={{ flex: 1 }}>
        <FlatListSimpleHandler
          data={performanceData}
          isLoading={isLoadingAnalyticsPerformance}
          renderSkeleton={() => <AnalyticsPerformanceSkeleton />}
          listEmptyText="No performance data found."
          contentContainerStyle={styles.listContent}
          HeaderComponent={ListHeader}
          keyExtractor={(item) => item.listing_internal_id?.toString()}
          renderItem={({ item }) => (
            <PerformanceCard data={item} formatNumber={formatNumber} />
          )}
          onRefresh={async () => await refetchPerformance()} 
        />
      </View>

      <FilterModal
        isVisible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        listingOptions={listingOptions}
        channelOptions={channelOptions}
        dateOptions={dateOptions}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
        filters={filters}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  listContent: { 
    paddingHorizontal: 16, 
    paddingBottom: 40 
  },
});

export default ListingPerformanceScreen;