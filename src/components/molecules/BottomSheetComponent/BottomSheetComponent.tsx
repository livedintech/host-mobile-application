import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Dimensions, TouchableWithoutFeedback, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { s, vs, ms } from 'react-native-size-matters';
import Metrics from '@/utility/Metrics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DEFAULT_SHEET_HEIGHT = SCREEN_HEIGHT * 0.85;

interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  customHeight?: number;
}

const BottomSheetComponent: React.FC<BottomSheetProps> = ({
  isVisible,
  onClose,
  children,
  customHeight
}) => {
  const finalHeight = customHeight || DEFAULT_SHEET_HEIGHT;
  const topOffset = SCREEN_HEIGHT - finalHeight;

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const context = useSharedValue(0);

  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      translateY.value = withTiming(topOffset, {
        duration: 350,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 }, (finished) => {
        if (finished) runOnJS(setShouldRender)(false);
      });
    }
  }, [isVisible, topOffset]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [SCREEN_HEIGHT, topOffset], [0, 1]),
  }));

  if (!shouldRender) return null;

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.absoluteOverlay}>
        
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[styles.backdrop, backdropStyle]} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.sheet,
            animatedStyle,
            { height: finalHeight }
          ]}
        >
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          <View style={styles.content}>
            {children}
          </View>
        </Animated.View>

      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  absoluteOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: 'flex-end',
    flex:1
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    width: '100%',
    borderTopLeftRadius: ms(40),
    borderTopRightRadius: ms(40),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    overflow: 'visible',
    flex:1,
    paddingBottom: Metrics.verticalScale(100)
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: vs(16),
    width: '100%',
    backgroundColor: 'transparent',
  },
  handle: {
    width: s(40),
    height: vs(5),
    backgroundColor: '#D1D1D1',
    borderRadius: 10,
  },
  content: {
    flex: 1,
  },
});

export default BottomSheetComponent;