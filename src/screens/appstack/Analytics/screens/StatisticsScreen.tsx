import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Platform,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import Metrics from '@/utility/Metrics';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppText from '@/components/molecules/AppText/AppText';
import StatCard from '../components/StatCard';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import AnalyticContainers from '../containers/AnalyticContainers';
import FilterModal from '../components/FilterModal';
import { Colors } from '@/theme/colors';
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import { goBack } from '@/services/navigationService';

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
    filters,
  } = AnalyticContainers();

  const getStatData = (key: string) => {
    return (
      AnalyticsSummary?.data?.find((item: any) => item.key === key) || {
        value: 0,
        delta_pct: 0,
        label: '',
      }
    );
  };

  const revenue = getStatData('rental_revenue');
  const occupancy = getStatData('occupancy');
  const avgStay = getStatData('avg_stay_revenue');
  const stayLength = getStatData('avg_length_of_stay');

  // Logic for pull-to-refresh
  const [isRefreshing, setIsRefreshing] = useState(false);
  const onHandleRefresh = async () => {
    setIsRefreshing(true);
    // Trigger any refetch logic here if available in your container
    // await refetchAnalytics();
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <ImageBackground
      source={require('@/assets/img/background/linearBG.png')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* <StatusBar barStyle="dark-content" /> */}
      <View style={{ flex: 1 }}>
        <View style={styles.navBar}>
          <View style={styles.arrowCircleInner}>
            <Pressable style={styles.arrowCircleInner} onPress={() => goBack()}>
              <Svgicons path="arrowLeftIcon" size={24} />
            </Pressable>
          </View>

          <ButtonView onPress={() => setIsFilterVisible(true)}>
            <GlassCard width="auto" style={styles.filterGlass}>
              <Svgicons path="filterIcon" size={20} />
            </GlassCard>
          </ButtonView>
        </View>

        <RefreshableScrollView
          contentContainerStyle={styles.scrollContent}
          isLoading={isLoadingAnalytics}
          refreshing={isRefreshing}
          onRefresh={onHandleRefresh}
          skeletonComponent={
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={Colors.BRUNSWICK_GREEN} />
            </View>
          }
        >
          <AppText
            text="Statistics"
            type="Medium"
            fontSize={26}
            textAlign="left"
            mt={10}
            mb={47}
            color="#000"
          />

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
        </RefreshableScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: Metrics.scale(20),
    paddingTop: Metrics.verticalScale(30),
    paddingBottom: Metrics.verticalScale(30),
  },
  filterGlass: {
    width: Metrics.scale(44),
    height: Metrics.scale(44),
    borderRadius: Metrics.scale(22),
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    backgroundColor: '#f8f5f5ff',
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
  scrollContent: {
    paddingHorizontal: Metrics.scale(16),
    paddingBottom: Metrics.verticalScale(40),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loaderContainer: {
    flex: 1,
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowCircleInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});

export default StatisticsScreen;
