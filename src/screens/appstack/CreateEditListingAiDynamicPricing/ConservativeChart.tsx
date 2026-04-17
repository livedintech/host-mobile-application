import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AreaChart, YAxis, XAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { Colors } from '@/theme/colors';

const ConservativeChart = () => {
  // Sample data points for the curve (April to June)
  const data = [100, 150, 200, 280, 350, 420];
  const xAxisLabels = ['April', '', 'May', '', 'June', ''];

  // Custom Line component to draw the solid green line on top
  const Line = ({ line }: any) => (
    <Path
      key={'line'}
      d={line}
      stroke={'#00A684'} // Main Green Color
      strokeWidth={2}
      fill={'none'}
    />
  );

  // Custom Gradient component for the area fill
  const Gradient = () => (
    <Defs key={'defs'}>
      <LinearGradient id={'gradient'} x1={'0%'} y1={'0%'} x2={'0%'} y2={'100%'}>
        <Stop offset={'0%'} stopColor={'#00A684'} stopOpacity={0.2} /> {/* Top transparent green */}
        <Stop offset={'100%'} stopColor={'#E8FAF6'} stopOpacity={0.1} /> {/* Bottom light green */}
      </LinearGradient>
    </Defs>
  );

  return (
    <View style={styles.chartWrapper}>
      <AppText text="Result:" fontSize={14} color="#6B6B6B" mb={15} />

      <View style={styles.chartAreaRow}>
        {/* Chart */}
        <View style={{ flex: 1, height: 160 }}>
          <AreaChart
            style={{ flex: 1 }}
            data={data}
            contentInset={{ top: 10, bottom: 10 }}
            curve={shape.curveNatural} // Smooth curve like the screenshot
            svg={{ fill: 'url(#gradient)' }} // Apply gradient fill
          >
            <Gradient />
            <Line />
          </AreaChart>
          
          {/* X-Axis Labels */}
          <XAxis
            style={{ marginTop: 10, height: 20 }}
            data={data}
            formatLabel={(value, index) => xAxisLabels[index]}
            contentInset={{ left: 10, right: 10 }}
            svg={{ fontSize: 12, fill: '#6B6B6B' }}
          />
        </View>
      </View>

      {/* Pricing Breakdown Row (Exact same as screenshot) */}
      <View style={styles.pricingBreakdown}>
        <View style={styles.priceRow}>
          <AppText text="SAR500" fontSize={20} type="Bold" color={Colors.BLACK} />
          <AppText text="-1.5%" fontSize={14} color="#6B6B6B" ml={8} />
          <View style={styles.infoIconWrapper}>
             <Svgicons path="infoCircleIcon" size={16} color="#00A684" />
          </View>
        </View>

        <View style={styles.propertyLegend}>
          <View style={styles.legendDot} />
          <AppText text="Property" fontSize={14} color={Colors.BLACK} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartWrapper: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 15,
  },
  chartAreaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pricingBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIconWrapper: {
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  propertyLegend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00A684', // Green legend dot
    marginRight: 8,
  },
});

export default ConservativeChart;