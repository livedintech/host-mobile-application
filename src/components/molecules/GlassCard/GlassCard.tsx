import React from 'react';
import { View, StyleSheet, Platform, ViewStyle, DimensionValue } from 'react-native';
import Metrics from '@/utility/Metrics';

interface GlassCardProps {
  children: React.ReactNode;
  width?: DimensionValue;
  style?: ViewStyle;
}

const GlassCard = ({ children, width = '48%', style }: GlassCardProps) => {
  return (
    <View style={[styles.card, { width }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Metrics.verticalScale(16),
    borderRadius: 28,
    padding: Metrics.scale(16),
    backgroundColor: 'rgba(217, 217, 217, 0.2)', // Light glass base
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.7)', // The "Rim Light"

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
      },
      android: {
        // Subtle dark borders simulate depth without the "white box" elevation bug
        borderBottomWidth: 2,
        borderRightWidth: 1.5,
        borderBottomColor: 'rgba(0, 0, 0, 0.05)',
      },
    }),
  },
});

export default GlassCard;