import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import SegmentedControl from '@/components/molecules/SegmentedControl/SegmentedControl';

const ReservationScreen: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(1); // Default to 'Reservation' as per screenshot

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.centerContainer}>
        <SegmentedControl
          options={['Calendar', 'Reservation']}
          selectedIndex={tabIndex}
          onChange={setTabIndex}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReservationScreen;