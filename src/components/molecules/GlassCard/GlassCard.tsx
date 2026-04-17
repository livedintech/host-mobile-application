import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Platform,
  ViewStyle,
  DimensionValue,
  StyleProp,
} from 'react-native';
import Metrics from '@/utility/Metrics';

interface GlassCardProps {
  children: React.ReactNode;
  width?: DimensionValue;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const GlassCard = ({
  children,
  width = '48%',
  style,
  onPress,
}: GlassCardProps) => {
  const Container = onPress ? Pressable : View;

  return (
    <Container style={[styles.card, { width }, style]} onPress={onPress}>
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Metrics.verticalScale(16),
    borderRadius: 28,
    padding: Metrics.scale(16),
    backgroundColor: 'rgba(217, 217, 217, 0.2)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.7)',

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
      },
      android: {
        borderBottomWidth: 2,
        borderRightWidth: 1.5,
        borderBottomColor: 'rgba(0, 0, 0, 0.05)',
      },
    }),
  },
});

export default GlassCard;