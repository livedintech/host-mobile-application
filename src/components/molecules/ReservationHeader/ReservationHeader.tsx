import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { Search, Filter as FilterIcon } from 'lucide-react-native';
import FilterChipBar from '@/components/molecules/FilterChipBar/FilterChipBar';
import { FILTER_OPTIONS } from '@/constants/dropdownOptions';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';

interface Props {
  searchQuery: string;
  setSearchQuery: (text: string) => void;
  onFilterPress: () => void;
  activeFilter: string;
  setActiveFilter: (id: string) => void;
}

export const ReservationHeader = ({ searchQuery, setSearchQuery, onFilterPress, activeFilter, setActiveFilter }: Props) => (
  <View style={styles.reservationHeader}>
    <View style={styles.searchRow}>
      <View style={styles.searchContainer}>
        <TextInput 
          placeholder="Search Guest" 
          placeholderTextColor="#A0A0A0" 
          style={styles.searchInput} 
          value={searchQuery} 
          onChangeText={setSearchQuery} 
        />
        <Search size={ms(18)} color="#A0A0A0" />
      </View>
      <TouchableOpacity style={styles.filterIconButton} onPress={onFilterPress}>
        <Svgicons path="reservationfilter" size={ms(70)} />
      </TouchableOpacity>
    </View>
    <FilterChipBar options={FILTER_OPTIONS} selectedId={activeFilter} onSelect={setActiveFilter} />
  </View>
);

const styles = StyleSheet.create({
  reservationHeader: { marginBottom: vs(10) },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: s(10), marginBottom: vs(12) },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: ms(25), paddingHorizontal: s(15), height: vs(45), borderWidth: 1, borderColor: '#D0D0D0' },
  searchInput: { flex: 1, fontSize: ms(14), color: '#333' },
  filterIconButton: { width: s(40), height: s(40), justifyContent: 'center', alignItems: 'center' },
});