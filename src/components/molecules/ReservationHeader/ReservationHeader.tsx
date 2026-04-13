import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { Search, Filter as FilterIcon } from 'lucide-react-native';
import FilterChipBar from '@/components/molecules/FilterChipBar/FilterChipBar';
import { FILTER_OPTIONS } from '@/constants/dropdownOptions';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import ButtonView from '../AppButton/ButtonView';
import GlassCard from '../GlassCard/GlassCard';
import Metrics from '@/utility/Metrics';

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
        <Search size={ms(18)} color="#555" style={styles.searchIcon} />
        <TextInput
          placeholder="Search Guest"
          placeholderTextColor="#A0A0A0"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ButtonView style={styles.filterIconButton} onPress={onFilterPress}>
        <GlassCard width={40} style={styles.iconCircle}>
          <Svgicons path="filterIcon"  />
        </GlassCard>
      </ButtonView>
    </View>
    <FilterChipBar options={FILTER_OPTIONS} selectedId={activeFilter} onSelect={setActiveFilter} />
  </View>
);

const styles = StyleSheet.create({
  reservationHeader: { marginBottom: vs(10) },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: s(10), marginBottom: vs(12) },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: ms(20),
    paddingHorizontal: s(18),
    height: vs(48),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  searchIcon: {
    marginRight: s(12),
  },
  searchInput: { flex: 1, fontSize: ms(14), color: '#333' },
  filterIconButton: {
    width: Metrics.verticalScale(50),
    height: Metrics.verticalScale(50),
    borderRadius: Metrics.verticalScale(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    height: 40,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    padding: 0,
    backgroundColor: '#D9D9D900',
  },
});