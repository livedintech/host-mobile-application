// import React, { useEffect } from 'react';
// import {
//   StyleSheet,
//   View,
//   Modal,
//   Dimensions,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
//   interpolate,
//   Easing,
// } from 'react-native-reanimated';
// import { s, vs, ms } from 'react-native-size-matters';

// const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// interface BottomSheetProps {
//   isVisible: boolean;
//   onClose: () => void;
//   children: React.ReactNode;
// }

// const BottomSheetComponent: React.FC<BottomSheetProps> = ({ isVisible, onClose, children }) => {
//   const translateY = useSharedValue(SCREEN_HEIGHT);

//   useEffect(() => {
//     // Using withTiming with a 'Cubic' easing creates a very premium, smooth slide
//     if (isVisible) {
//       translateY.value = withTiming(0, {
//         duration: 350,
//         easing: Easing.out(Easing.cubic),
//       });
//     } else {
//       translateY.value = withTiming(SCREEN_HEIGHT, {
//         duration: 300,
//         easing: Easing.in(Easing.cubic),
//       });
//     }
//   }, [isVisible]);

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ translateY: translateY.value }],
//   }));

//   const backdropStyle = useAnimatedStyle(() => ({
//     opacity: interpolate(
//       translateY.value,
//       [SCREEN_HEIGHT, 0],
//       [0, 1]
//     ),
//   }));

//   return (
//     <Modal transparent visible={isVisible} onRequestClose={onClose} animationType="none">
//       <View style={styles.container}>
//         <TouchableWithoutFeedback onPress={onClose}>
//           <Animated.View style={[styles.backdrop, backdropStyle]} />
//         </TouchableWithoutFeedback>

//         <Animated.View style={[styles.sheet, animatedStyle]}>
//           <View style={styles.handleContainer}>
//             <View style={styles.handle} />
//           </View>
//           <View style={styles.content}>
//             {children}
//           </View>
//         </Animated.View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'flex-end' },
//   backdrop: { 
//     ...StyleSheet.absoluteFill, 
//     backgroundColor: 'rgba(0,0,0,0.4)' 
//   },
//   sheet: {
//     backgroundColor: 'white',
//     width: '100%',
//     height: SCREEN_HEIGHT * 0.85,
//     borderTopLeftRadius: ms(40),
//     borderTopRightRadius: ms(40),
//     paddingHorizontal: s(24),
//   },
//   handleContainer: {
//     alignItems: 'center',
//     paddingVertical: vs(12),
//   },
//   handle: {
//     width: s(40),
//     height: vs(4),
//     backgroundColor: '#E0E0E0',
//     borderRadius: 2,
//   },
//   content: { flex: 1 },
// });

// export default BottomSheetComponent;

import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Dimensions, TouchableWithoutFeedback, Platform } from 'react-native';
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
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.85; 
const TOP_OFFSET = SCREEN_HEIGHT * 0.12; 

interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BottomSheetComponent: React.FC<BottomSheetProps> = ({ isVisible, onClose, children }) => {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const context = useSharedValue(0);

  // 1. Define the Gesture
  const panGesture = useMemo(() => 
    Gesture.Pan()
      .onStart(() => {
        context.value = translateY.value;
      })
      .onUpdate((event) => {
        translateY.value = Math.max(TOP_OFFSET, context.value + event.translationY);
      })
      .onEnd((event) => {
        if (event.translationY > 120 || event.velocityY > 600) {
          translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 }, (finished) => {
            if (finished) runOnJS(onClose)();
          });
        } else {
          translateY.value = withTiming(TOP_OFFSET, { duration: 250 });
        }
      }),
    [onClose]
  );

  useEffect(() => {
    if (isVisible) {
      translateY.value = withTiming(TOP_OFFSET, {
        duration: 350,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 });
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [SCREEN_HEIGHT, TOP_OFFSET], [0, 1]),
  }));

  if (!isVisible && translateY.value === SCREEN_HEIGHT) return null;

  return (
    <View style={styles.absoluteOverlay} pointerEvents="box-none">
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, backdropStyle]} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.sheet, animatedStyle]}>
        {/* 2. ONLY the handle is wrapped in GestureDetector */}
        <GestureDetector gesture={panGesture}>
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>
        </GestureDetector>
        
        {/* 3. The content is now standard and won't be blocked */}
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
    backgroundColor: 'white',
    width: '100%',
    height: SHEET_HEIGHT, 
    borderTopLeftRadius: ms(40),
    borderTopRightRadius: ms(40),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    overflow: 'hidden',
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: vs(20), // Increased for easier grabbing
    width: '100%',
    backgroundColor: 'white',
  },
  handle: {
    width: s(40),
    height: vs(5),
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
  },
  content: { 
    flex: 1, 
  },
});

export default BottomSheetComponent;