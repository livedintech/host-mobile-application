import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { s, vs, ms } from 'react-native-size-matters';

// 1. Define the interface for a single option
export interface FilterOption {
  id: string;
  label: string;
}

// 2. Define the props interface for the component
interface FilterChipBarProps {
  options: FilterOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const FilterChipBar: React.FC<FilterChipBarProps> = ({
  options,
  selectedId,
  onSelect,
}) => {
  const renderItem = ({ item }: { item: FilterOption }) => {
    const isActive = selectedId === item.id;

    if (isActive) {
      return (
        <Pressable
          onPress={() => onSelect(item.id)}
          style={[styles.chip, styles.activeChip]}
        >
          <Text style={styles.activeText}>{item.label}</Text>
        </Pressable>
      );
    }

    return (
      <Pressable 
        onPress={() => onSelect(item.id)} 
        style={styles.chipContainer}
      >
        <LinearGradient
          colors={['#FFFFFF', '#F9F9F9', '#F2F2F2']}
          style={styles.inactiveChip}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          {/* Subtle top light highlight for the "glass" look */}
          <View style={styles.topHighlight} />
          <Text style={styles.inactiveText}>{item.label}</Text>
        </LinearGradient>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={options}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: vs(10),
    width: '100%',
  },
  listContent: {
    paddingHorizontal: s(16),
    gap: s(12), 
    alignItems: 'center',
    flexDirection: 'row',
  },
  chipContainer: {
    borderRadius: ms(25),
    // Soft outer shadow for inactive chips
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  chip: {
    height: vs(38),
    paddingHorizontal: s(22),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: ms(25),
  },
  activeChip: {
    backgroundColor: '#2D4A41', // Dark Green
  },
  inactiveChip: {
    height: vs(38),
    paddingHorizontal: s(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: ms(25),
    borderWidth: 1,
    borderColor: '#EAEAEA',
    overflow: 'hidden',
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#FFFFFF',
    opacity: 0.8,
  },
  activeText: {
    color: '#FFFFFF',
    fontSize: ms(14),
    fontWeight: '600',
  },
  inactiveText: {
    color: '#2D4A41',
    fontSize: ms(14),
    fontWeight: '500',
  },
});

export default FilterChipBar;