import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  ImageBackground, 
  StatusBar, 
  Platform, 
  ActivityIndicator 
} from 'react-native';
import Metrics from '@/utility/Metrics';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppText from '@/components/molecules/AppText/AppText';
import StatCard from '../components/StatCard';
import GlassCard from '../components/GlassCard';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import AnalyticContainers from '../containers/AnalyticContainers';
import FilterModal from '../components/FilterModal';
import { Colors } from '@/theme/colors';

const StatisticsScreen = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  
  const { 
    AnalyticsSummary, 
    isLoadingAnalytics, 
    listingOptions, 
    channelOptions, 
    dateOptions, 
    applyFilters, 
    resetFilters, 
    filters 
  } = AnalyticContainers();

  // Safe helper to extract data from the API array by key
  const getStatData = (key: string) => {
    return AnalyticsSummary?.data?.find((item: any) => item.key === key) || { 
      value: 0, 
      delta_pct: 0, 
      label: '' 
    };
  };

  const revenue = getStatData('rental_revenue');
  const occupancy = getStatData('occupancy');
  const avgStay = getStatData('avg_stay_revenue');
  const stayLength = getStatData('avg_length_of_stay');

  return (
    <ImageBackground 
      source={require('@/assets/img/background/statsBG.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1 }}>
        <View style={styles.navBar}>
          <ButtonView onPress={() => setIsFilterVisible(true)}>
            <GlassCard width="auto" style={styles.filterGlass}>
               <Svgicons path="filterIcon" size={20} />
            </GlassCard>
          </ButtonView>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <AppText text="Statistics" type="Medium" fontSize={32} textAlign='center' mt={10} mb={47} color="#000" />

          {isLoadingAnalytics ? (
            <View style={styles.loaderContainer}>
               <ActivityIndicator size="large" color={Colors.BRUNSWICK_GREEN} />
            </View>
          ) : (
            <View style={styles.grid}>
              <StatCard 
                title="Rental Revenue" 
                value={`SAR ${revenue.value}`} 
                subText="vs last month" 
                trend={revenue.delta_pct} 
                icon="walletIcon" 
              />
              <StatCard 
                title="Occupancy" 
                value={`${occupancy.value}%`} 
                subText="vs last 30 days" 
                trend={occupancy.delta_pct} 
                icon="occupancy" 
              />
              <StatCard 
                title="Avg Stay Revenue" 
                value={`SAR ${avgStay.value}`} 
                subText="vs last 30 days" 
                trend={avgStay.delta_pct} 
                icon="avg_stay_revenue" 
              />
              <StatCard 
                title="Avg Length of Stay" 
                value={`${stayLength.value} Nights`} 
                subText="vs last 30 days" 
                trend={stayLength.delta_pct} 
                icon="avg_length_of_stay" 
              />
            </View>
          )}
        </ScrollView>
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
  container: { flex: 1 },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Metrics.scale(20),
    paddingTop: Metrics.verticalScale(10),
  },
  filterGlass: {
    width: Metrics.scale(44),
    height: Metrics.scale(44),
    borderRadius: Metrics.scale(22),
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    backgroundColor:'#f8f5f5ff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.13, 
        shadowRadius: 4,
      },
      android: { elevation: 3 }, 
    }),
  },
  scrollContent: { paddingHorizontal: Metrics.scale(16), paddingBottom: Metrics.verticalScale(40) },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  loaderContainer: { marginTop: 100, alignItems: 'center' }
});

export default StatisticsScreen;