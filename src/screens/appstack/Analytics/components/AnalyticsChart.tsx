import { useTranslation } from 'react-i18next';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';

const AnalyticsChart = ({ activeTab, data, total }: any) => {
  const { t } = useTranslation();
  const isReservation = activeTab === 'reservation';
  console.log('data::', data);

  const renderHeader = (title: string) => (
    <View style={styles.cardHeader}>
      <View>
        <AppText text={title} type="Bold" fontSize={18} color={Colors.BLACK} />
        {isReservation && <AppText text={t('app.shared.total_reservations', { count: total })} fontSize={13} color={Colors.DARK_CHARCOAL} mt={2} />}
      </View>
      <GlassCard width={48} style={styles.iconGlass}>
        <Svgicons path="moneyBagIcon" size={30} />
      </GlassCard>
    </View>
  );

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <GlassCard width="100%" style={styles.mainGlass}>
        {isReservation ? (
          <View>
            {renderHeader(t('app.analytics.reservations_per_channel'))}
            <View style={styles.contentRow}>
              <View style={styles.legendWrapper}>
                {data.map((item: any, index: number) => (
                  <GlassCard
                    key={index}
                    width="100%"
                    style={styles.subGlassCard}
                  >
                    <View style={styles.legendRowItem}>
                      <Svgicons path={item.svgPath.toLowerCase()} size={22} />
                      <View style={styles.legendText}>
                        <AppText text={`${item.label} (${item.percentage.toFixed(0)}%)`} fontSize={12} color={Colors.BLACK} />
                        <AppText text={t('app.analytics.reservations_count', { count: item.count })} fontSize={13} type="Bold" color={item.color} />
                      </View>
                    </View>
                  </GlassCard>
                ))}
              </View>
              <PieChart
                data={data.map((d: any) => ({
                  value: d.value,
                  color: d.color,
                }))}
                donut
                radius={55}
                innerRadius={42}
                centerLabelComponent={() => (
                  <View style={{ alignItems: 'center' }}>
                    <AppText
                      text={t('app.analytics.total')}
                      fontSize={11}
                      color={Colors.DIM_GREY}
                    />
                    <AppText
                      text={total.toString()}
                      type="Bold"
                      fontSize={18}
                      color={Colors.BLACK}
                    />
                  </View>
                )}
              />
            </View>
          </View>
        ) : (
          <View>
            {renderHeader(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ${t('app.analytics.per_channel_suffix')}`)}
            <View style={styles.barList}>
              {data.map((item: any, index: number) => (
                <View key={index} style={styles.barRow}>
                  <AppText
                    text={item.label}
                    fontSize={14}
                    color={item.color}
                    style={styles.barLabel}
                    numberOfLines={1}
                  />
                  <View style={styles.barBackground}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        },
                      ]}
                    />
                  </View>
                  <AppText text={activeTab === 'revenue' ? t('app.analytics.sar_value', { value: item.value }) : t('app.analytics.nights_count', { count: item.value })} fontSize={13} ml={10} type="Bold" />
                </View>
              ))}
            </View>
          </View>
        )}
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  mainGlass: {
    backgroundColor: 'transparent',
    borderRadius: 32,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  iconGlass: {
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    marginBottom: 0,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendWrapper: { flex: 1, marginRight: 15 },
  subGlassCard: {
    backgroundColor: 'rgba(203, 206, 205, 0.15)',
    padding: 10,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fff',
  },
  legendRowItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  legendText: { flex: 1 },
  barList: { marginTop: 10 },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 ,gap:10},
  barBackground: {
    flex: 1,
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 10 },
  barLabel: { width: 90 },
});

export default AnalyticsChart;
