import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import GlassCard from './GlassCard';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { Colors } from '@/theme/colors';

const PerformanceCard = ({ data }: any) => {
  // Assessment styling logic
  const getAssessmentStyle = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'top performer':
        return { color: '#2D9171', bg: 'rgba(45, 145, 113, 0.1)' };
      case 'average':
        return { color: '#D4A017', bg: 'rgba(212, 160, 23, 0.1)' };
      default:
        return { color: '#E57373', bg: 'rgba(229, 115, 115, 0.1)' };
    }
  };

  const style = getAssessmentStyle(data.assessment);
  
  // Dynamic trend logic
  const isPositive = data.delta_pct >= 0 || !data.delta_pct; // Defaulting to positive if missing
  const trendColor = isPositive ? '#2D9171' : '#E57373';

  return (
    <GlassCard width="100%" style={styles.cardContainer}>
      <View style={styles.topRow}>
        
        {/* Image wrapped in GlassCard */}
        <GlassCard width={90} style={styles.imageGlassWrapper}>
          <Image 
            source={require('@/assets/img/appartment.png')} 
            style={styles.listingImage} 
            resizeMode="cover"
          />
        </GlassCard>
        
        <View style={styles.headerInfo}>
          <AppText text={data.title} fontSize={16} type="Bold" numberOfLines={1} mb={8} />
          
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <View style={styles.labelGroup}>
                <Svgicons path="revenue_mini" size={12} mr={4} />
                <AppText text="Revenue" fontSize={10} color={Colors.DIM_GREY} />
              </View>
              <AppText text={`SAR ${data.revenue}`} fontSize={13} type="Bold" />
            </View>

            <View style={styles.metricItem}>
              <View style={styles.labelGroup}>
                <Svgicons path="occupancy_mini" size={12} mr={4} />
                <AppText text="Occupancy" fontSize={10} color={Colors.DIM_GREY} />
              </View>
              <AppText text={`${data.occupancy}%`} fontSize={13} type="Bold" />
            </View>

            <View style={styles.metricItem}>
              <View style={styles.labelGroup}>
                <Svgicons path="adr_mini" size={12} mr={4} />
                <AppText text="ADR" fontSize={10} color={Colors.DIM_GREY} />
              </View>
              <AppText text={`SAR ${data.adr}`} fontSize={13} type="Bold" />
            </View>
          </View>
        </View>

        <View style={styles.starIcon}>
           <Svgicons path="sparkle_icon" size={20} />
        </View>
      </View>

      <View style={styles.bottomRow}>
        {/* Assessment Badge */}
        <View style={[styles.badge, { backgroundColor: style.bg }]}>
          <View style={[styles.dot, { backgroundColor: style.color }]} />
          <AppText text={data.assessment} fontSize={11} color={style.color} type="Medium" />
        </View>

        {/* Insight Badge - Dynamic based on performance */}
        <GlassCard width="auto" style={styles.insightBadge}>
          <View style={styles.insightContent}>
            <Svgicons 
              path={isPositive ? "trend_up_green" : "trend_down_red"} 
              size={14} 
              mr={4} 
            />
            <AppText 
              text={`${data.delta_pct || 0}% vs previous period`} 
              fontSize={11} 
              color={trendColor} 
              type="Medium"
            />
          </View>
        </GlassCard>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 15,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  imageGlassWrapper: {
    padding: 5, // Creates the border spacing for the glass effect
    borderRadius: 18,
    marginRight: 12,
    marginBottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  listingImage: {
    width: 80,
    height: 80,
    borderRadius: 14,
  },
  headerInfo: {
    flex: 1,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    flex: 1,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  starIcon: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  insightBadge: {
    marginBottom: 0,
    padding: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  insightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default PerformanceCard;