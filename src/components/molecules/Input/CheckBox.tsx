import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

interface CheckboxProps {
  isChecked: boolean;
  onPress: () => void;
}

const Checkbox = ({ isChecked, onPress }: CheckboxProps) => (
  <TouchableOpacity 
    onPress={onPress} 
    style={[styles.container, isChecked && styles.checkedContainer]}
  >
    {/* {isChecked && <Icon name="check" size={14} color="#FFF" />} */}
    <Svgicons path={isChecked ? 'CheckboxCheckedIcon' : 'CheckboxUncheckedIcon'} size={38} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    // width: 22,
    // height: 22,
    // borderRadius: 6,
    // borderWidth: 1.5,
    // borderColor: '#A0A0A0',
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: 'transparent',
  },
  checkedContainer: {
    // backgroundColor: '#004D40', 
    // borderColor: '#004D40',
  },
});

export default Checkbox;