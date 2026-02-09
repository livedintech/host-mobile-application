import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { Colors } from '@/theme/colors';
import FilterModal from './FilterModal'; // Assuming modal logic is here
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

const AnalyticsHeader = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.row}>
      <View style={styles.titleGroup}>
        <AppText text="Analytics" fontSize={28} type="Bold" color={Colors.BRUNSWICK_GREEN} />
        <Svgicons path="analyticsIcon" ml={8} size={30} />
      </View>

      <ButtonView style={styles.filterBtn} onPress={() => setModalVisible(true)}>
        <AppText text="Filter" fontSize={14} type="Medium" color={Colors.BRUNSWICK_GREEN} mr={6} />
        <Svgicons path="taskManagementFilterIcon" width={16} height={16} />
      </ButtonView>
      
      {/* Implementation of your filter screen using your DropdownField */}
      <FilterModal isVisible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
};

export default AnalyticsHeader;

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  titleGroup: { flexDirection: 'row', alignItems: 'center' },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.ARGENT,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});