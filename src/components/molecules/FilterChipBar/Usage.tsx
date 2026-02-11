import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import FilterChipBar from '@/components/molecules/FilterChipBar/FilterChipBar';

const FILTER_DATA = [
  { id: '1', label: 'Today' },
  { id: '2', label: 'Pending Request' },
  { id: '3', label: 'Pending Reviews' },
  { id: '4', label: 'Checkout' },
];

const App: React.FC = () => {
  const [selectedId, setSelectedId] = useState('1');

  return (
    <SafeAreaView style={styles.safe}>
      <FilterChipBar
        options={FILTER_DATA}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
});

export default App;