import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, GestureResponderEvent, I18nManager } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import ButtonView from '../AppButton/ButtonView';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';


interface CustomSwitchProps {
  value?: boolean;
  onToggle?: (value: boolean) => void;
  disabled?: boolean;
  isLoading?: boolean;
  [key: string]: any;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  value,
  onToggle,
  disabled = false,
  isLoading = false,
  ...props
}) => {
  const isRTL = I18nManager.isRTL;

const getPosition = (isOn: boolean) => {
  if (isRTL) {
    return isOn ? -Metrics.scale(3) : -Metrics.scale(28);
  }
  return isOn ? Metrics.scale(28) : Metrics.scale(3);
};

  
  const [localValue, setLocalValue] = useState(false);
  const sharedValue = value !== undefined ? value : localValue;
  const switchX = useSharedValue(getPosition(sharedValue));

  useEffect(() => {
    switchX.value = withSpring(getPosition(sharedValue), {
      damping: 10,
      stiffness: 200,
      mass: 1,
      overshootClamping: true,
    });
  }, [sharedValue, switchX]);

  const handleToggle = (event: GestureResponderEvent) => {
    if (disabled || isLoading) return;

    if (value === undefined) {
      setLocalValue((prev) => {
        const newValue = !prev;
        onToggle?.(newValue);
        return newValue;
      });
    } else {
      onToggle?.(!value);
    }
  };

  const animatedCircleStyle = useAnimatedStyle(() => ({
    backgroundColor: sharedValue ? Colors.WHITE : Colors.WHITE,
    transform: [{ translateX: switchX.value }],
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    backgroundColor: sharedValue ? Colors.TEAL_PRIMARY_ALT : Colors.DRAVIT_GREY,
    borderColor: sharedValue ? Colors.TEAL_PRIMARY_ALT : Colors.DRAVIT_GREY,
  }));

  return (
    <ButtonView
      onPress={handleToggle}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...props}
    >
      <Animated.View style={[styles.switch, animatedContainerStyle]}>
        <Animated.View style={[styles.circle, animatedCircleStyle]}>
          {isLoading && <ActivityIndicator size={20} color={Colors.TEAL_PRIMARY_ALT} />}
        </Animated.View>
      </Animated.View>
    </ButtonView>
  );
};

const styles = StyleSheet.create({
  switch: {
    width: Metrics.scale(59),
    height: Metrics.verticalScale(31),
    borderRadius: 42,
    justifyContent: 'center',
    paddingHorizontal: Metrics.scale(0),
    paddingVertical: 2,
    borderWidth: 2,
  },
  circle: {
    width: Metrics.scale(25),
    height: Metrics.scale(25),
    borderRadius: 15,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
});

export default CustomSwitch;
