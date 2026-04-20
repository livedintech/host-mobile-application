import React from 'react';
import { View, StyleSheet } from 'react-native';
import Metrics from '@/utility/Metrics';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';

interface StatCardProps {
  title: string;
  value: string | number;
  subText: string;
  trend: number;
  icon: string;
}

const StatCard = ({ title, value, subText, trend, icon }: StatCardProps) => {
  const isPositive = trend > 0;
  const trendColor = isPositive ? '#2D9171' : '#E57373';
  const trendIcon = isPositive
    ? 'graphBarIncreaseIcon'
    : 'graphBarDecreaseIcon';

  return (
    <GlassCard>
      {/* Header Section */}
      <View style={styles.headerRow}>
        <Svgicons path={icon} size={18} mr={6} />
        <AppText text={title} fontSize={13} color="#4A4A4A" type="Medium" />
      </View>

      {/* Value Section */}
      <View style={styles.valueContainer}>
        <AppText
          text={String(value)}
          fontSize={20}
          type="Bold"
          color={Colors.DARK_CHARCOAL}
        />
      </View>

      {/* Subtext Section */}
      <View style={styles.subTextContainer}>
        <AppText text={subText} fontSize={11} color={Colors.BLACK} />
      </View>

      {/* Trend Badge - Now wrapped in GlassCard for the layered effect */}
      <GlassCard width="auto" style={styles.badgeGlassContainer}>
        <View style={styles.badgeContent}>
          <Svgicons
            path={isPositive ? 'trendUp' : 'trendDown'}
            size={12}
            mr={4}
            color={trendColor}
          />

          <AppText
            /* Logic: Adds + if positive, - if negative, then shows absolute value */
            text={`${isPositive ? '+' : '-'}${Math.abs(trend)}%`}
            fontSize={11}
            type="Bold"
            color={trendColor}
          />
        </View>
      </GlassCard>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Metrics.verticalScale(18),
  },
  valueContainer: {
    // marginTop: Metrics.verticalScale(10),
  },
  subTextContainer: {
    marginTop: Metrics.verticalScale(2),
  },
  badgeGlassContainer: {
    alignSelf: 'flex-end',
    marginTop: Metrics.verticalScale(20),
    padding: Metrics.scale(2),
    paddingHorizontal: Metrics.scale(12),
    borderRadius: 7,
    marginBottom: 0,
    minWidth: 62,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default StatCard;
