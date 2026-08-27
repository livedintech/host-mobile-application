import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

interface PaginationProps {
  activeIndex: number;
  onDotPress?: (index: number) => void;
}

const Pagination = ({ activeIndex, onDotPress }: PaginationProps) => {

  const handlePress = (index: number) => {
    if (onDotPress) {
      onDotPress(index);
      return;
    }
    if (index === 0) {
      navigate(NavigationRoutes.AUTH_STACK.PROPERTY_CAN_EARN);
    } else if (index === 1) {
      navigate(NavigationRoutes.AUTH_STACK.CONNECT_CALENDARS_INTRO);
    } else if (index === 2) {
      navigate(NavigationRoutes.AUTH_STACK.AGENT_INTRO);
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: 3 }).map((_, index) => {
        const isActive = index === activeIndex;

        return (
          <TouchableOpacity
            key={index}
            activeOpacity={isActive ? 1 : 0.7}
            onPress={() => {
              if (!isActive) {
                handlePress(index);
              }
            }}
            style={[
              styles.dot,
              isActive ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        );
      })}
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Metrics.verticalScale(35),
    // backgroundColor: Colors.BRUNSWICK_GREEN_16, 
    width: '100%',
    backgroundColor:Colors.WHITE
  },
  dot: {
    height: Metrics.verticalScale(8),
    borderRadius: 100,
    marginHorizontal: 4,
  },
  activeDot: {
    width: Metrics.scale(53), // Long pill shape for active
    backgroundColor: '#21AA8F',
  },
  inactiveDot: {
    width: Metrics.scale(10), // Small dot for inactive
    backgroundColor: Colors.NATURAL_WASH,
  },
});