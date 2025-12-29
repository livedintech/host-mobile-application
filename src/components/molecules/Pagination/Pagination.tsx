import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import { navigate } from '@/services/navigationService'; // Apna navigation service import karein
import NavigationRoutes from '@/navigation/NavigationRoutes'; // Apne routes import karein

interface PaginationProps {
  activeIndex: number;
}

const Pagination = ({ activeIndex }: PaginationProps) => {
  
  const handlePress = (index: number) => {
    // Index ke mutabiq screens link karein
    if (index === 0) {
      // Home screen 1 (Property Earn)
      navigate(NavigationRoutes.AUTH_STACK.PROPERTY_CAN_EARN); 
    } else if (index === 1) {
      // Home screen 2 (Calendar Sync)
      navigate(NavigationRoutes.AUTH_STACK.CONNECT_CALENDARS_INTRO); 
    } else if (index === 2) {
      // Sign Up screen
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
    backgroundColor: Colors.BRUNSWICK_GREEN_16, // Light background
    width: '100%',
  },
  dot: {
    height: Metrics.verticalScale(8),
    borderRadius: 100,
    marginHorizontal: 4,
  },
  activeDot: {
    width: Metrics.scale(53), // Long pill shape for active
    backgroundColor: Colors.BRUNSWICK_GREEN,
  },
  inactiveDot: {
    width: Metrics.scale(10), // Small dot for inactive
    backgroundColor: Colors.NATURAL_WASH,
  },
});