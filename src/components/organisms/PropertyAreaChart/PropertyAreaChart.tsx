import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-wagmi-charts';
import Metrics from '@/utility/Metrics';
import { Colors } from '@/theme/colors';

interface Props {
  chartPoints: { timestamp: number; value: number }[];
  roundedMax: number;
  yAxisLabels: string[];
  xAxisLabels: string[];
}

const chartHeight = 180;

const PropertyAreaChart: React.FC<Props> = ({ chartPoints, roundedMax, yAxisLabels, xAxisLabels }) => {
  if (!chartPoints || chartPoints.length === 0) {
    return <Text style={{ textAlign: 'center', marginVertical: 20 }}>No chart data available</Text>;
  }

  return (
    <View style={{ marginTop: 20, width: '100%', marginBottom: 14 }}>
      <View style={{ flexDirection: 'row' }}>
        {/* Y-axis labels */}
        <View style={{ justifyContent: 'space-between', paddingRight: 10, width: Metrics.scale(60), height: chartHeight }}>
          {yAxisLabels.map((label, index) => (
            <Text key={index} style={{ fontSize: 10, color: '#707070', fontFamily: 'Medium' }}>{label}</Text>
          ))}
        </View>

        {/* Chart */}
        <View style={{ flex: 1, borderLeftWidth: 1, borderLeftColor: '#E0E0E0', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' }}>
          <LineChart.Provider data={chartPoints}>
            <LineChart height={chartHeight} width={Metrics.screenWidth - 120}>
              {/* Horizontal lines */}
              {yAxisLabels.map((_, index) => (
                <LineChart.HorizontalLine key={index} at={{ value: (roundedMax / 5) * index }} color="#E0E0E0" />
              ))}

              {/* Path + Gradient */}
              <LineChart.Path color={Colors.BRUNSWICK_GREEN} width={2}>
                <LineChart.Gradient color={Colors.BRUNSWICK_GREEN + '30'} />
              </LineChart.Path>

              {/* Cursor tooltip */}
              <LineChart.CursorCrosshair color={Colors.PINE_FOREST}>
                <LineChart.Tooltip />
              </LineChart.CursorCrosshair>
            </LineChart>
          </LineChart.Provider>
        </View>
      </View>

      {/* X-axis labels */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 60, marginTop: 10, paddingHorizontal: 10 }}>
        {xAxisLabels.map((month, index) => (
          <Text key={index} style={{ fontSize: 10, color: '#707070', fontFamily: 'Medium' }}>{month}</Text>
        ))}
      </View>
    </View>
  );
};

export default PropertyAreaChart;
