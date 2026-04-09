import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { ChevronDown, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheetComponent from '@/components/molecules/BottomSheetComponent/BottomSheetComponent';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '../AppButton/AppButton';

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
  const insets = useSafeAreaInsets();
  const [localSelected, setLocalSelected] = useState<string[]>(initialSelectedValues);
  const [isPropertyOpen, setIsPropertyOpen] = useState(true);

  useEffect(() => {
    if (isVisible) setLocalSelected(initialSelectedValues);
  }, [isVisible, initialSelectedValues]);

  const toggleLocalProperty = (val: any) => {
    const valStr = String(val);
    setLocalSelected((prev) =>
      prev.includes(valStr) ? prev.filter((v) => v !== valStr) : [...prev, valStr]
    );
  };

  const handleSelectAll = () => {
    if (localSelected.length === actualProperties.length) {
      setLocalSelected([]);
    } else {
      setLocalSelected(actualProperties.map((p) => String(p.value)));
    }
  };

  const isAnySelected = localSelected.length > 0;

  // Custom Tick Component
  const RenderTick = () => (
    <View style={styles.tickContainer}>
      <View style={styles.tickStem} />
      <View style={styles.tickKick} />
    </View>
  );

  return (
    <BottomSheetComponent isVisible={isVisible} onClose={onClose}>
      <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, vs(20)) }]}>
        
        <View style={styles.header}>
          <AppText text="Apply Filter" type="Bold" fontSize={ms(20)} color="#000" />
          <TouchableOpacity onPress={onClose} style={styles.closeCircle}>
            <X size={ms(18)} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          <AppText text="Select Property" type="Medium" fontSize={ms(16)} mb={vs(12)} color="#000" />
          
          <View style={[styles.dropdownBox, isPropertyOpen && styles.activeBorder]}>
            <TouchableOpacity 
              activeOpacity={0.8}
              style={styles.dropdownHeader} 
              onPress={() => setIsPropertyOpen(!isPropertyOpen)}
            >
              <View style={styles.headerLeft}>
                <TouchableOpacity 
                  onPress={handleSelectAll}
                  style={[styles.checkbox, isAnySelected && styles.checkboxSelected]}
                >
                  {isAnySelected && <RenderTick />}
                </TouchableOpacity>

                <AppText 
                  text={isAnySelected ? `${localSelected.length} Selected` : "Select Multiple Options"} 
                  color={isAnySelected ? "#000" : "#888"} 
                  fontSize={ms(14)}
                  style={styles.labelMargin}
                />
              </View>

              <View style={{ transform: [{ rotate: isPropertyOpen ? '180deg' : '0deg' }] }}>
                <ChevronDown size={ms(20)} color="#000" />
              </View>
            </TouchableOpacity>

            {isPropertyOpen && (
              <View style={styles.listArea}>
                {actualProperties.map((item) => {
                  const isChecked = localSelected.includes(String(item.value));
                  return (
                    <TouchableOpacity 
                      key={item.value} 
                      style={styles.itemRow} 
                      onPress={() => toggleLocalProperty(item.value)}
                    >
                      <View style={[styles.checkbox, isChecked && styles.checkboxSelected]}>
                        {isChecked && <RenderTick />}
                      </View>
                      <AppText 
                        text={item.label} 
                        color={isChecked ? "#000" : "#444"} 
                        fontSize={ms(14)} 
                        style={styles.labelMargin}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <AppButton 
              title="Apply"
              onPress={() => onApply(localSelected)}
              fontSize={18}
              type="Bold"
              backgroundColor="#479682"
              style={{ width: '100%', borderRadius: ms(25) }}
            />
          </View>
        </ScrollView>
      </View>
    </BottomSheetComponent>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: s(24),
    paddingBottom: vs(15),
  },
  closeCircle: {
    backgroundColor: '#F0F0F0',
    borderRadius: 100,
    padding: ms(6),
  },
  scrollContent: {
    paddingHorizontal: s(24),
    paddingBottom: vs(20), 
  },
  dropdownBox: {
    backgroundColor: '#F9F9F9',
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: '#EAEAEA',
    overflow: 'hidden',
  },
  activeBorder: { borderColor: '#DDD' },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: ms(16),
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listArea: {
    paddingHorizontal: ms(16),
    backgroundColor: '#FFF',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(14),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  labelMargin: { marginLeft: s(12) },
  checkbox: {
    width: ms(20),
    height: ms(20),
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#CCC',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#479682',
    borderColor: '#479682',
  },
  tickContainer: {
    width: ms(10),
    height: ms(6),
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#FFF',
    transform: [{ rotate: '-45deg' }],
    marginTop: -vs(2),
  },
  tickStem: {},
  tickKick: {},
  footer: {
    marginTop: vs(40),
    width: '100%',
  },
});