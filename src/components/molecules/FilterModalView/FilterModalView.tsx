import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { ChevronDown, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Import this
import BottomSheetComponent from '@/components/molecules/BottomSheetComponent/BottomSheetComponent';
import AppText from '@/components/molecules/AppText/AppText';
import LinearGradient from 'react-native-linear-gradient';
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
  const insets = useSafeAreaInsets(); // Get bottom bar height
  const [localSelected, setLocalSelected] = useState<string[]>(initialSelectedValues);
  const [isPropertyOpen, setIsPropertyOpen] = useState(true);
  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);

  useEffect(() => {
    if (isVisible) setLocalSelected(initialSelectedValues);
  }, [isVisible, initialSelectedValues]);

  const toggleLocalProperty = (val: any) => {
    const valStr = String(val);
    setLocalSelected((prev) =>
      prev.includes(valStr) ? prev.filter((v) => v !== valStr) : [...prev, valStr]
    );
  };

  return (
    <BottomSheetComponent isVisible={isVisible} onClose={onClose}>
      {/* Add bottom padding matching the device's safe area */}
      <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, vs(20)) }]}>
        
        {/* Fixed Header */}
        <View style={styles.header}>
          <View style={styles.titleBadge}>
            <AppText text="Apply Filter" type="Bold" fontSize={ms(20)} color="#000" />
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeCircle}>
            <X size={ms(18)} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          {/* Section 1: Property */}
          <AppText text="Select Property" type="Medium" fontSize={ms(16)} mb={vs(12)} color="#000" />
          <View style={[styles.dropdownBox, isPropertyOpen && styles.activeBorder]}>
            <TouchableOpacity 
              style={styles.dropdownHeader} 
              onPress={() => setIsPropertyOpen(!isPropertyOpen)}
            >
              <AppText 
                text={localSelected.length > 0 ? `${localSelected.length} Selected` : "Select Property"} 
                color="#888" 
                style={{ flex: 1 }}
              />
              {/* Wrap the icon in a View to handle the transform safely */}
              <View style={{ 
                transform: [{ rotate: isPropertyOpen ? '180deg' : '0deg' }],
                justifyContent: 'center',
                alignItems: 'center',
                width: ms(24), // Ensure there is enough space for the rotation
                height: ms(24)
              }}>
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
                        {isChecked && <View style={styles.checkInner} />}
                      </View>
                      <AppText text={item.label} color={isChecked ? "#000" : "#444"} fontSize={ms(14)} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* Section 2: Assignee */}
          <AppText text="Select Task Assignee" type="Medium" fontSize={ms(16)} mt={vs(20)} mb={vs(12)} color="#000" />
          <View style={[styles.dropdownBox, isAssigneeOpen && styles.activeBorder]}>
            <TouchableOpacity 
              style={styles.dropdownHeader} 
              onPress={() => setIsAssigneeOpen(!isAssigneeOpen)}
            >
              <AppText text="Select Multiple Options" color="#888" style={{ flex: 1 }} />
              
              {/* Wrapper View prevents the icon from disappearing during rotation */}
              <View style={{ 
                transform: [{ rotate: isAssigneeOpen ? '180deg' : '0deg' }],
                width: ms(24), 
                height: ms(24),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <ChevronDown size={ms(20)} color="#000" />
              </View>
            </TouchableOpacity>
            {isAssigneeOpen && (
               <View style={styles.listArea}>
                  <AppText text="No assignees found" color="#888" style={{ paddingVertical: 10 }} />
               </View>
            )}
          </View>

          {/* Footer Action */}
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, vs(36)) }]}>
            <AppButton 
              title="Apply"
              variant="primary"
              onPress={() => onApply(localSelected)}
              fontSize={18}
              type="Regular"
              style={{ width: '100%' }}
            />
          </View>
        </ScrollView>
      </View>
    </BottomSheetComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(24),
    paddingBottom: vs(15),
  },
  titleBadge: {
    paddingHorizontal: s(8),
    borderRadius: 4,
  },
  closeCircle: {
    backgroundColor: '#E0E0E0',
    borderRadius: 100,
    padding: ms(6),
  },
  scrollContent: {
    paddingHorizontal: s(24),
    paddingBottom: vs(52), 
  },
  dropdownBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: '#EAEAEA',
    overflow: 'hidden',
  },
  activeBorder: {
    borderColor: '#CCC',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: ms(16),
    alignItems: 'center',
  },
  listArea: {
    paddingHorizontal: ms(16),
    paddingBottom: ms(10),
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(12),
    gap: s(12),
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  checkbox: {
    width: ms(20),
    height: ms(20),
    borderRadius: 6,
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
  checkInner: {
    width: ms(8),
    height: ms(8),
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  footer: {
    marginTop: vs(30),
    alignItems: 'center',
    gap: vs(15),
  },
  applyBtnContainer: {
    width: '100%',
  },
  applyBtn: {
    height: vs(36),
    borderRadius: ms(26),
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetBtn: {
    padding: 10,
  },
  underline: {
    textDecorationLine: 'underline',
  },
});