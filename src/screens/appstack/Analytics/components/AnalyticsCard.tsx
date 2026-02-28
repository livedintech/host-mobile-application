import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Colors } from '@/theme/colors';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';

const AnalyticsCard = ({ item, variant = 'kpi' }: any) => {
  // console.log("analyticsanalyticsItem",item)

  const numericDelta = parseFloat(item?.delta_pct || item?.trend || 0);
  const isPositive = numericDelta > 0;
  const isZeroTrend = numericDelta === 0;
  /** -----------------------------
   * AI INSIGHT RENDERER
   * ----------------------------- */
  const renderAIInsight = () => {
    if (!item?.insight) return null;

    return (
      <View style={styles.aiInsightWrapper}>
        <View style={styles.aiIconContainer}>
          <Svgicons path="aiSuggestionIcon" size={20} />
        </View>

        <View style={styles.aiTextContainer}>
          <View style={styles.insightRow}>
            <AppText
              text="AI Insights: "
              type="Bold"
              fontSize={12}
              color={Colors.BRUNSWICK_GREEN}
            />
            {renderInsightText(item.insight)}
          </View>
        </View>
      </View>
    );
  };

  /** -----------------------------
   * LISTING CARD UI
   * ----------------------------- */
  if (variant === 'listing') {
    // ⭐ SAME ZERO LOGIC AS KPI
    // const isZeroTrend = item.trend === '0%' || item.trend === '-0%';
    const trendColor = isZeroTrend
      ? '#757575'
      : isPositive
      ? '#1FA67A'
      : '#E53935';

    return (
      <View style={styles.listingContainer}>
        <GradientBorder borderRadius={20} borderWidth={1}>
          <View style={styles.listingInner}>
            <View style={styles.listingTopRow}>
              <Image
                source={require('@/assets/img/appartment.png')}
                style={styles.unitImage}
              />

              <View style={styles.listingInfo}>
                <AppText
                  text={item.title}
                  type="Bold"
                  fontSize={18}
                  color={Colors.JET_BLACK}
                />

                <View style={styles.statsGrid}>
                  <Stat label="Revenue" value={item.revenue} />
                  <Stat label="Occupancy" value={item.occupancy} />
                  <Stat label="ADR" value={item.adr} />
                </View>
              </View>
            </View>

            <View style={styles.listingBottomRow}>
              <View
                style={[
                  styles.statusTag,
                  { backgroundColor: item.statusColor },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: item.statusTextColor },
                  ]}
                />
                <AppText
                  text={item.assessment}
                  fontSize={10}
                  color={item.statusTextColor}
                  type="Medium"
                />
              </View>

              {/* ⭐ UPDATED TREND LOGIC */}
              <View style={styles.trendRow}>
                {!isZeroTrend && (
                  <Svgicons
                    // path={item.isUp ? 'trendUpIcon' : 'trendDownIcon'}
                    path={true ? 'trendUpIcon' : 'trendDownIcon'}
                    width={12}
                    height={12}
                    mr={4}
                  />
                )}

                <AppText
                  // text={`${item.trend} vs previous period`}
                  text='15% vs previous period'
                  fontSize={10}
                  // color={trendColor}
                  color='#40B69C'
                  type="Medium"
                />
              </View>
            </View>
          </View>
        </GradientBorder>

        <View style={styles.aiInsightSpacing}>{renderAIInsight()}</View>
      </View>
    );
  }

  /** -----------------------------
   * KPI CARD UI
   * ----------------------------- */

  // const isZeroTrend = item.change === '0%' || item.change === '-0%';
const badgeBg = isZeroTrend ? '#E0E0E0' : isPositive ? '#E8F5F1' : '#FDEEEE';
  const textColor = isZeroTrend ? '#757575' : isPositive ? '#1FA67A' : '#E53935';

  return (
    <View style={styles.kpiWrapper}>
      <GradientBorder borderRadius={15}>
        <View style={styles.kpiInner}>
          <View style={styles.kpiHeader}>
            <Svgicons path={item.key} size={14} mr={5} />
            <AppText
              text={item.label}
              fontSize={11}
              color={Colors.SUPER_GREY}
            />
          </View>

          <AppText
            text={item.value}
            fontSize={20}
            type="Bold"
            color={Colors.BRUNSWICK_GREEN}
            mt={4}
          />

          <AppText
            // text={item.duration}
            text='vs last 30 days'
            fontSize={10}
            color={Colors.SUPER_GREY}
          />

          <View style={[styles.kpiBadge, { backgroundColor: badgeBg }]}>
            {!isZeroTrend && (
              <Svgicons
                path={isPositive ? 'trendUpIcon' : 'trendDownIcon'}
                width={10}
                height={10}
                mr={4}
              />
            )}
            <AppText
              text={item.delta_pct}
              fontSize={10}
              type="Medium"
              color={textColor}
            />
          </View>
        </View>
      </GradientBorder>
    </View>
  );
};

/** -------------------------------------
 * TEXT HIGHLIGHTER FOR AI INSIGHT
 * ------------------------------------*/
const renderInsightText = (text: string) => {
  const parts = text.split(
    /(\d+%|SAR \d+|\d+\.\d+|\brate\b|\boccupancy\b|\brevenue\b)/gi,
  );

  return parts.map((part, index) => {
    const isHighlight =
      /(\d+%|SAR \d+|\d+\.\d+|\brate\b|\boccupancy\b|\brevenue\b)/gi.test(part);

    return (
      <AppText
        key={index}
        text={part}
        fontSize={12}
        color={isHighlight ? '#1FA67A' : Colors.BRUNSWICK_GREEN}
        type={isHighlight ? 'Medium' : 'Regular'}
        style={isHighlight ? { fontStyle: 'italic' } : {}}
      />
    );
  });
};

const Stat = ({ label, value }: any) => (
  <View style={styles.statItem}>
    <AppText text={label} fontSize={11} color={Colors.JET_BLACK} opacity={0.6} />
    <AppText text={value} fontSize={11} type="Bold" color={Colors.JET_BLACK} />
  </View>
);

const styles = StyleSheet.create({
  kpiWrapper: { width: '48%', marginBottom: 12 },
  kpiInner: {
    padding: 12,
    backgroundColor: Colors.WHITE,
    height: 110,
    borderRadius: 15,
  },
  kpiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  kpiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  listingContainer: { marginBottom: 24 },
  listingInner: {
    padding: 16,
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
  },
  unitImage: { width: 64, height: 64, borderRadius: 12 },
  listingTopRow: { flexDirection: 'row' },
  listingInfo: { flex: 1, marginLeft: 12 },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: { flex: 1 },
  listingBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 50,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  trendRow: { flexDirection: 'row', alignItems: 'center' },
  aiInsightWrapper: {
    flexDirection: 'row',
    marginTop: 12,
    paddingHorizontal: 8,
  },
  aiIconContainer: { marginRight: 10, paddingTop: 2 },
  aiTextContainer: { flex: 1 },
  insightRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  aiInsightSpacing: {
    marginTop: 12,
    marginBottom: 8,
  },
});

export default AnalyticsCard;
