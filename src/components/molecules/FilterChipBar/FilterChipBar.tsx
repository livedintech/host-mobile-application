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

    if (isActive) {
      return (
        <View style={styles.shadowWrapper}>
           <Pressable
            onPress={() => onSelect(item.id)}
            style={[styles.chip, styles.activeChip]}
          >
            <Text style={styles.activeText}>{item.label}</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.shadowWrapper}>
        <Pressable 
          onPress={() => onSelect(item.id)} 
          style={styles.chipContainer}
        >
          <LinearGradient
            colors={['#FFFFFF', '#FDFDFD', '#F5F5F5']} // Slightly cleaner whites
            style={styles.inactiveChip}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <View style={styles.topHighlight} />
            <Text style={styles.inactiveText}>{item.label}</Text>
          </LinearGradient>
        </Pressable>
      </View>
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
        removeClippedSubviews={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // Increased vertical padding so shadows have room to breathe
    paddingVertical: vs(12), 
  },
  listContent: {
    paddingHorizontal: s(16),
    gap: s(12), 
    alignItems: 'center',
    flexDirection: 'row',
  },
  shadowWrapper: {
    // Extra padding around each item ensures elevation/shadow isn't cut off by the list
    paddingBottom: vs(4),
    paddingHorizontal: s(2),
  },
  chipContainer: {
    borderRadius: ms(25),
    backgroundColor: '#FFF',
    // Improved Shadow logic
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12, // Slightly higher for better definition
    shadowRadius: 4.5,
    elevation: 4, // Higher elevation to prevent "dull" look on Android
  },
  chip: {
    height: vs(38),
    paddingHorizontal: s(22),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: ms(25),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4.5,
    elevation: 4,
  },
  activeChip: {
    backgroundColor: '#2D4A41',
  },
  inactiveChip: {
    height: vs(38),
    paddingHorizontal: s(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: ms(25),
    borderWidth: 1,
    borderColor: '#ECECEC',
    // Removed overflow: 'hidden' as it can clip shadows on some RN versions
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: vs(1),
    backgroundColor: '#FFFFFF',
    opacity: 0.9,
  },
  activeText: {
    color: '#FFFFFF',
    fontSize: ms(13),
    fontWeight: '700',
  },
  inactiveText: {
    color: '#2D4A41',
    fontSize: ms(13),
    fontWeight: '600',
  },
});

export default FilterChipBar;