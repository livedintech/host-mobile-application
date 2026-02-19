import { Colors } from '@/theme/colors';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import AppText from '../AppText/AppText';

const CircularProgress = ({ 
  percentage = 10, 
  size = 100, 
  strokeWidth = 5, 
  progressColor = Colors.BRUNSWICK_GREEN, // Dark green color from image
  backgroundColor = Colors.LIGHT_GRAY
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Circle (Light) */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Circle (Dark) */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round" // Gives rounded edges
          rotation="-90" // Starts from the top
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {/* Percentage Text */}
      <View style={StyleSheet.absoluteFillObject}>
        <View style={styles.textContainer}>
          <AppText text={`${percentage}%`} fontSize={17} color={Colors.BRUNSWICK_GREEN}/>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
  },
});

export default CircularProgress;