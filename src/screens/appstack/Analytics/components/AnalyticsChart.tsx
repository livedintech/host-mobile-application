import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';

const AnalyticsChart = ({ activeTab, data, total }: any) => {
  const isReservation = activeTab === 'reservation';
  const hasData = data && data.length > 0;

  return (
    <View style={styles.wrapper}>
      <AppText
        text={isReservation ? "Reservations per Channel" : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} per Channel`}
        type="Bold"
        fontSize={18}
        color={Colors.BRUNSWICK_GREEN}
        mb={15}
      />

      <GradientBorder borderRadius={20} borderWidth={1.5}>
        <View style={styles.cardInner}>
          {!hasData ? (
            /* EMPTY STATE MODULE */
            <View style={styles.emptyContainer}>
              <Svgicons path="analyticsIcon" size={40} opacity={0.2} />
              <AppText 
                text="No data found for the selected listing" 
                fontSize={14} 
                color={Colors.DIM_GREY} 
                mt={10} 
                type="Medium"
              />
            </View>
          ) : isReservation ? (
            <View style={styles.donutRow}>
              <View style={styles.legendContainer}>
                <AppText text={`Total: ${total} reservations`} fontSize={14} color={Colors.PINE_FOREST} mb={18} opacity={0.7} />
                {data.map((item: any, index: number) => (
                  <View key={index} style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: item.color }]} />
                    <AppText 
                      text={`${item.label} - ${item.percentage} (${item.count})`} 
                      fontSize={14} 
                      type="Bold"
                      color={item.color} 
                    />
                  </View>
                ))}
              </View>

              <PieChart
                data={data}
                donut
                radius={65}
                innerRadius={50}
                centerLabelComponent={() => (
                  <View style={styles.centerLabel}>
                    <AppText text="Total" fontSize={10} color={Colors.DIM_GREY} type='Medium'/>
                    <AppText text={total.toString()} type="Bold" fontSize={18} color={Colors.BLACK} />
                  </View>
                )}
              />
            </View>
          ) : (
            <View style={styles.barList}>
              {data.map((item: any, index: number) => (
                <View key={index} style={styles.barRow}>
                  <AppText text={item.label} fontSize={11} color={item.color} style={{ width: 70 }} />
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: item.percentage, backgroundColor: item.color }]} />
                  </View>
                  <AppText text={item.value} fontSize={12} ml={10} type="Bold" />
                </View>
              ))}
            </View>
          )}
        </View>
      </GradientBorder>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 20 },
  cardInner: { 
    padding: 20, 
    backgroundColor: Colors.WHITE, 
    borderRadius: 20,
    minHeight: 180, // Ensures consistency when empty
    justifyContent: 'center'
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  donutRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  legendContainer: { flex: 1 },
  centerLabel: { alignItems: 'center', justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  barList: { paddingVertical: 5 },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  barBg: { flex: 1, height: 8, backgroundColor: '#F0F0F0', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4 },
});

export default AnalyticsChart;