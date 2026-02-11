import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { s, vs, ms } from 'react-native-size-matters';

interface SegmentedControlProps {
  options: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selectedIndex,
  onChange,
}) => {
  const { width: windowWidth } = useWindowDimensions();

  // Responsive layout constants
  const CONTAINER_WIDTH = windowWidth * 0.9;
  const PADDING = s(4);
  const SEGMENT_WIDTH = (CONTAINER_WIDTH - PADDING * 2) / options.length;

  // Animation value for the sliding background
  const translateX = useSharedValue(selectedIndex * SEGMENT_WIDTH);

  // Sync animation with prop changes
  useEffect(() => {
    translateX.value = withSpring(selectedIndex * SEGMENT_WIDTH, {
      damping: 18,
      stiffness: 120,
    });
  }, [selectedIndex, SEGMENT_WIDTH, translateX]);

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[styles.container, { width: CONTAINER_WIDTH }]}>
      {/* Persistent Animated Background:
          This stays green and simply slides to the selected position.
      */}
      <Animated.View
        style={[
          styles.activeIndicator,
          { width: SEGMENT_WIDTH },
          animatedIndicatorStyle,
        ]}
      />

      {options.map((option, index) => {
        const isActive = selectedIndex === index;

        return (
          <Pressable
            key={`segment-${index}`}
            onPress={() => onChange(index)}
            style={styles.segment}
            android_ripple={{ color: 'rgba(255,255,255,0.1)', borderless: true }}
          >
            <Text
              style={[
                styles.text,
                isActive ? styles.textActive : styles.textInactive,
              ]}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: vs(54),
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: ms(27),
    padding: s(4),
    // Outer Border & Shadow
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    alignItems: 'center',
    overflow: 'hidden',
  },
  activeIndicator: {
    position: 'absolute',
    height: vs(46),
    backgroundColor: '#2D4A41', // Dark Green from screenshot
    borderRadius: ms(23),
    left: s(4),
  },
  segment: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Ensure text is always on top of the indicator
  },
  text: {
    fontSize: ms(16),
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  textActive: {
    color: '#FFFFFF',
  },
  textInactive: {
    color: '#2D4A41',
  },
});

export default SegmentedControl;