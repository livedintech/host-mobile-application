import { useTranslation } from 'react-i18next';
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { Colors } from '@/theme/colors';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';

const PerformanceCard = ({ data, formatNumber }: any) => {
  const { t } = useTranslation();
  const getAssessmentStyle = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'top performer':
        return { color: '#2D9171', bg: '#D9D9D933' };
      case 'average':
        return { color: '#D4A017', bg: '#D9D9D933' };
      default:
        return { color: '#E57373', bg: '#D9D9D933' };
    }
  };

  const style = getAssessmentStyle(data.assessment);

  return (
    <GlassCard width="100%" style={styles.cardContainer}>
      <View style={styles.topRow}>
        <GlassCard width={75} style={styles.imageGlassWrapper}>
          <Image
            source={require('@/assets/img/appartment.png')}
            style={styles.listingImage}
            resizeMode="cover"
          />
        </GlassCard>

        <View style={styles.headerInfo}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <AppText
                text={data.title}
                fontSize={14}
                type="Bold"
                numberOfLines={2}
                mb={12}
              />
            </View>
            {/* Explicitly passing custom width to match your original UI scaling */}
            <GlassCard width={28} style={styles.sparkleGlass}>
              <Svgicons path="sparkleRewardIcon" size={16} />
            </GlassCard>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <View style={styles.labelGroup}>
                <Svgicons path="walletIcon" size={12} mr={4} />
                <AppText
                  text={t('app.analytics.revenue')}
                  fontSize={10}
                  color={Colors.DIM_GREY}
                />
              </View>
              <AppText
                text={`SAR ${formatNumber(data.revenue)}`}
                fontSize={11}
                type="Bold"
              />
            </View>

            <View style={styles.metricItem}>
              <View style={styles.labelGroup}>
                <Svgicons path="occupancy" size={12} mr={4} />
                <AppText
                  text={t('app.analytics.occupancy')}
                  fontSize={10}
                  color={Colors.DIM_GREY}
                />
              </View>
              <AppText text={`${data.occupancy}%`} fontSize={11} type="Bold" />
            </View>

            <View style={styles.metricItem}>
              <View style={styles.labelGroup}>
                <Svgicons path="adr" size={12} mr={4} />
                <AppText
                  text={t('app.analytics.adr')}
                  fontSize={10}
                  color={Colors.DIM_GREY}
                />
              </View>
              <AppText text={`SAR ${data.adr}`} fontSize={11} type="Bold" />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <GlassCard
          width="auto"
          style={[styles.assessmentGlass, { backgroundColor: style.bg }]}
        >
          <View style={styles.badgeContent}>
            <View style={[styles.dot, { backgroundColor: style.color }]} />
            <AppText
              text={data.assessment}
              fontSize={11}
              color={style.color}
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
    borderRadius: 32,
    marginBottom: 16,
    backgroundColor: '#D9D9D900',
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  imageGlassWrapper: {
    padding: 5,
    borderRadius: 18,
    marginRight: 12,
    marginBottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  listingImage: {
    width: 65,
    height: 65,
    borderRadius: 14,
  },
  headerInfo: {
    flex: 1,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricItem: {
    alignItems: 'flex-start',
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  sparkleGlass: {
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginLeft: 8,
    padding: 0,          
    marginBottom: 0,     
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start', 
    justifyContent: 'space-between',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  assessmentGlass: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 0,   
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
});

export default PerformanceCard;