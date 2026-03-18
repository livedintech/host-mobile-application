import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
} from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';

export interface FilterOption {
  id: string;
  label: string;
}

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

    return (
      <Pressable 
        onPress={() => onSelect(item.id)} 
        style={[
          styles.chip, 
          isActive ? styles.activeChip : styles.inactiveChip
        ]}
      >
        <Text style={isActive ? styles.activeText : styles.inactiveText}>
          {item.label}
        </Text>
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
    width: '100%',
    paddingVertical: vs(10), 
  },
  listContent: {
    paddingHorizontal: s(16),
    gap: s(10), 
    alignItems: 'center',
  },
  chip: {
    height: vs(40),
    paddingHorizontal: s(18),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: ms(20),
  },
  activeChip: {
    backgroundColor: '#499F8A',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  inactiveChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  activeText: {
    color: '#FFFFFF',
    fontSize: ms(13),
    fontWeight: '600',
  },
  inactiveText: {
    color: '#333333',
    fontSize: ms(13),
  },
});

export default FilterChipBar;