import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import Metrics from '@/utility/Metrics';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppText from '@/components/molecules/AppText/AppText';
import GlassCard from '../components/GlassCard';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import AnalyticContainers from '../containers/AnalyticContainers';
import FilterModal from '../components/FilterModal';
import { Colors } from '@/theme/colors';
import PerformanceCard from '../components/PerformanceCard';

const ListingPerformanceScreen = () => {
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
  } = AnalyticContainers();

  const performanceData = Array.isArray(AnalyticsPerformance?.data) 
    ? AnalyticsPerformance.data 
    : [];

  return (
    <ImageBackground
      source={require('@/assets/img/background/statsBG.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header Navigation */}
        <View style={styles.navBar}>
          <ButtonView onPress={() => {}}>
             <GlassCard width={44} style={styles.iconCircle}>
                <Svgicons path="backArrow" size={20} />
             </GlassCard>
          </ButtonView>
          
          <ButtonView onPress={() => setIsFilterVisible(true)}>
            <GlassCard width={44} style={styles.iconCircle}>
               <Svgicons path="filterIcon" size={20} />
            </GlassCard>
          </ButtonView>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          <AppText 
            text="Listing Performance" 
            type="Medium" 
            fontSize={32} 
            textAlign='center' 
            mt={10} 
            mb={30} 
            color="#000" 
          />

          {isLoadingAnalyticsPerformance ? (
            <ActivityIndicator size="large" color={Colors.PINE_FOREST} style={{ marginTop: 50 }} />
          ) : (
            performanceData.map((item: any, index: number) => (
              <PerformanceCard key={item.listing_internal_id || index} data={item} />
            ))
          )}
        </ScrollView>
      </SafeAreaView>

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
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  iconCircle: {
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginBottom: 0,
    padding: 0,
  },
  scrollContent: { 
    paddingHorizontal: 16, 
    paddingBottom: 40 
  },
});

export default ListingPerformanceScreen;