import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { ChevronDown } from 'lucide-react-native';
import ModalComponent from '@/components/molecules/ModalComponent/ModalComponent';
import AppText from '@/components/molecules/AppText/AppText';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (val: boolean) => void;
  selectedPropertyValues: string[];
  actualProperties: any[];
  toggleProperty: (val: any) => void;
}

export const FilterModalView = ({
  isVisible,
  onClose,
  onApply,
  onReset,
  isDropdownOpen,
  setIsDropdownOpen,
  selectedPropertyValues,
  actualProperties,
  toggleProperty,
}: Props) => (
  <ModalComponent
    isVisible={isVisible}
    onClose={onClose}
    title="Apply Filter"
    onApply={onApply}
    onReset={onReset}
  >
    <AppText text="Property Listing" type="Bold" fontSize={16} color="#1A332C" mb={8} />
    
    <View style={[styles.dropdownBox, isDropdownOpen && { borderColor: '#2D4A41' }]}>
      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <View style={styles.row}>
          <View
            style={[
              styles.checkboxBox,
              selectedPropertyValues.length > 0 && styles.checkboxActive,
            ]}
          />
          <AppText
            text={
              selectedPropertyValues.length > 0
                ? `${selectedPropertyValues.length} Selected`
                : 'Select Properties'
            }
            color="#1A332C"
            fontSize={14}
          />
        </View>
        <ChevronDown size={ms(18)} color="#000" />
      </TouchableOpacity>

      {isDropdownOpen && (
        <ScrollView style={{ maxHeight: vs(200) }} nestedScrollEnabled>
          {actualProperties.map((item: any) => (
            <TouchableOpacity
              key={item.value}
              style={styles.propertyItem}
              onPress={() => toggleProperty(item.value)}
            >
              <View
                style={[
                  styles.checkboxBox,
                  selectedPropertyValues.includes(String(item.value)) &&
                    styles.checkboxActive,
                ]}
              />
              <AppText text={item.label} fontSize={13} color="#444" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  </ModalComponent>
);

const styles = StyleSheet.create({
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: s(10) 
  },
  checkboxBox: { 
    width: ms(20), 
    height: ms(20), 
    borderWidth: 1.5, 
    borderColor: '#2D4A41', 
    borderRadius: ms(5), 
    backgroundColor: '#FFF' 
  },
  checkboxActive: { 
    backgroundColor: '#2D4A41' 
  },
  dropdownBox: { 
    borderWidth: 1, 
    borderColor: '#DDD', 
    borderRadius: 8, 
    marginTop: vs(10),
    overflow: 'hidden'
  },
  dropdownHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: s(12) 
  },
  propertyItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: s(12), 
    borderTopWidth: 1, 
    borderTopColor: '#EEE', 
    gap: 10 
  },
});