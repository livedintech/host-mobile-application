import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface GradientBorderProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  borderWidth?: number;
  colors?: string[];
  locations?: number[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

const GradientBorder = ({
  children,
  style,
  borderRadius = 20,
  borderWidth = 1,
  colors = ['#808080', '#FFFFFF', '#808080'],
  locations = [0, 0.49, 1],
  start = { x: 0, y: 0 },
  end = { x: 0, y: 1 },
}: GradientBorderProps) => {
  return (
    <LinearGradient
      colors={colors}
      locations={locations}
      start={start}
      end={end}
      style={[{ borderRadius, padding: borderWidth }, style]}
    >
      <View style={{ borderRadius: borderRadius - borderWidth, overflow: 'hidden', flex: 1 }}>
        {children}
      </View>
    </LinearGradient>
  );
};

export default GradientBorder;
