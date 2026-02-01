import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Pressable,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { s, vs, ms } from 'react-native-size-matters';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BottomSheetComponent: React.FC<BottomSheetProps> = ({ isVisible, onClose, children }) => {
  const translateY = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 100 });
    } else {
      translateY.value = withSpring(SCREEN_HEIGHT, { damping: 20, stiffness: 100 });
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [SCREEN_HEIGHT, 0], [0, 1], Extrapolate.CLAMP),
  }));

  return (
    <Modal transparent visible={isVisible} onRequestClose={onClose} animationType="none">
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[styles.backdrop, backdropStyle]} />
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.sheet, animatedStyle]}>
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
  container: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    backgroundColor: 'white',
    width: '100%',
    height: SCREEN_HEIGHT * 0.85,
    borderTopLeftRadius: ms(40),
    borderTopRightRadius: ms(40),
    paddingHorizontal: s(24),
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: vs(12),
  },
  handle: {
    width: s(40),
    height: vs(4),
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  content: { flex: 1 },
});

export default BottomSheetComponent;