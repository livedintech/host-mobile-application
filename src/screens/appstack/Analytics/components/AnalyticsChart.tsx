import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';

const AnalyticsChart = ({ activeTab, data, total }: any) => {
  const isReservation = activeTab === 'reservation';

  return (
    <View style={styles.wrapper}>
      {/* Heading OUTSIDE the border */}
      <AppText
        text={isReservation ? "Reservations per Channel" : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} per Channel`}
        type="Bold"
        fontSize={18}
        color={Colors.BRUNSWICK_GREEN}
        mb={15}
      />

      <GradientBorder borderRadius={20} borderWidth={1.5}>
        <View style={styles.cardInner}>
          {isReservation ? (
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
                    <AppText text="Total Value" fontSize={12} color={Colors.DIM_GREY} type='Medium'/>
                    <AppText text={total.toString()} type="Bold" fontSize={22} color={Colors.BLACK} />
                  </View>
                )}
              />
            </View>
          ) : (
            <View style={styles.barList}>
              {data.map((item: any, index: number) => (
                <View key={index} style={styles.barRow}>
                  <AppText text={item.label} fontSize={12} color={item.color} style={{ width: 60 }} />
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
    flexDirection: 'column',
  },
  donutRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
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