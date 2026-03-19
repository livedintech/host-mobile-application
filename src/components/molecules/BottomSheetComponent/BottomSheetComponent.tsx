import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Dimensions, TouchableWithoutFeedback } from 'react-native';
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
  
  // NEW: State to handle physical unmounting from the DOM
  const [shouldRender, setShouldRender] = useState(isVisible);

  const panGesture = useMemo(() => 
    Gesture.Pan()
      .onStart(() => {
        context.value = translateY.value;
      })
      .onUpdate((event) => {
        translateY.value = Math.max(topOffset, context.value + event.translationY);
      })
      .onEnd((event) => {
        if (event.translationY > 120 || event.velocityY > 600) {
          translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 }, (finished) => {
            if (finished) {
              runOnJS(onClose)();
            }
          });
        } else {
          translateY.value = withTiming(topOffset, { duration: 250 });
        }
      }),
    [onClose, topOffset]
  );

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true); // Mount immediately when visible is true
      translateY.value = withTiming(topOffset, {
        duration: 350,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      // Animate down first
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 }, (finished) => {
        if (finished) {
          // Unmount from DOM after animation finishes
          runOnJS(setShouldRender)(false);
        }
      });
    }
  }, [isVisible, topOffset]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [SCREEN_HEIGHT, topOffset], [0, 1]),
  }));

  // Only render if we are in the "visible" state or currently animating
  if (!shouldRender) return null;

  return (
    <View style={styles.absoluteOverlay} pointerEvents="box-none">
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, backdropStyle]} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.sheet, animatedStyle, { height: finalHeight }]}>
        <GestureDetector gesture={panGesture}>
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>
        </GestureDetector>
        
        <View style={styles.content}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  absoluteOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    justifyContent: 'flex-end',
  },
  backdrop: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: '#F2F2F2', // Grayish Figma Color
    width: '100%',
    borderTopLeftRadius: ms(40),
    borderTopRightRadius: ms(40),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    display: 'flex',
    overflow: 'visible',
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