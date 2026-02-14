import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { ChevronDown } from 'lucide-react-native';
import ModalComponent from '@/components/molecules/ModalComponent/ModalComponent';
import AppText from '@/components/molecules/AppText/AppText';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onApply: (selected: string[]) => void;
  onReset: () => void;
  actualProperties: any[];
  initialSelectedValues: string[];
}

export const FilterModalView = ({
  isVisible,
  onClose,
  onApply,
  onReset,
  actualProperties,
  initialSelectedValues,
}: Props) => {
  // Local state manages changes inside the modal without triggering parent re-renders
  const [localSelected, setLocalSelected] = useState<string[]>(initialSelectedValues);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Sync local state when modal opens
  useEffect(() => {
    if (isVisible) {
      setLocalSelected(initialSelectedValues);
    }
  }, [isVisible, initialSelectedValues]);

  const toggleLocalProperty = (val: any) => {
    const valStr = String(val);
    setLocalSelected((prev) =>
      prev.includes(valStr) ? prev.filter((v) => v !== valStr) : [...prev, valStr]
    );
  };

  const handleApply = () => {
    onApply(localSelected);
  };

  const handleReset = () => {
    setLocalSelected([]);
    onReset();
  };

  return (
    <ModalComponent
      isVisible={isVisible}
      onClose={onClose}
      title="Apply Filter"
      onApply={handleApply}
      onReset={handleReset}
    >
      <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
        <View style={styles.contentContainer}>
          <AppText
            text="Property Listing"
            type="Bold"
            fontSize={16}
            color="#1A332C"
            mb={8}
          />

          <View style={[styles.dropdownBox, isDropdownOpen && styles.dropdownBoxActive]}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.dropdownHeader}
              onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <View style={styles.row}>
                <View
                  style={[
                    styles.checkboxBox,
                    localSelected.length > 0 && styles.checkboxActive,
                  ]}
                />
                <AppText
                  text={
                    localSelected.length > 0
                      ? `${localSelected.length} Selected`
                      : 'Select Multiple Options'
                  }
                  color="#1A332C"
                  fontSize={14}
                />
              </View>
              <ChevronDown
                size={ms(18)}
                color="#000"
                style={{ transform: [{ rotate: isDropdownOpen ? '180deg' : '0deg' }] }}
              />
            </TouchableOpacity>

            {isDropdownOpen && (
              <View style={styles.listContainer}>
                <ScrollView
                  style={{ maxHeight: vs(200) }}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={true}
                >
                  {actualProperties.map((item: any) => (
                    <TouchableOpacity
                      key={item.value}
                      activeOpacity={0.6}
                      style={styles.propertyItem}
                      onPress={() => toggleLocalProperty(item.value)}
                    >
                      <View
                        style={[
                          styles.checkboxBox,
                          localSelected.includes(String(item.value)) &&
                            styles.checkboxActive,
                        ]}
                      />
                      <AppText text={item.label} fontSize={13} color="#444" />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ModalComponent>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  checkboxBox: {
    width: ms(20),
    height: ms(20),
    borderWidth: 1.5,
    borderColor: '#2D4A41',
    borderRadius: ms(5),
    backgroundColor: '#FFF',
  },
  checkboxActive: {
    backgroundColor: '#2D4A41',
  },
  dropdownBox: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    marginTop: vs(10),
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  dropdownBoxActive: {
    borderColor: '#2D4A41',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s(12),
  },
  listContainer: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  propertyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: s(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
    gap: 10,
  },
});