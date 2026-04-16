import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

interface CheckboxProps {
  isChecked: boolean;
  onPress: () => void;
  disabled?: boolean;
}

const Checkbox = ({ isChecked, onPress, disabled = false }: CheckboxProps) => (
  <TouchableOpacity
    onPress={() => {
      if (!disabled) onPress();
    }}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    style={[
      styles.container,
      isChecked && styles.checkedContainer,
      disabled && styles.disabled, 
    ]}
    activeOpacity={disabled ? 1 : 1} 
  >
    <Svgicons
      path={isChecked ? 'checkedCheckbox' : 'checkboxTick'}
      size={20}
      color={disabled ? '#A0A0A0' : undefined} 
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
  },
  checkedContainer: {
  },
  disabled: {
    opacity: 1, 
  },
});

export default Checkbox;
