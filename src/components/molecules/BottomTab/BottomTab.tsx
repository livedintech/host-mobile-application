import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Colors } from '@/theme/colors';
import ButtonView from '../AppButton/ButtonView';

const BottomTab = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;

        const onPress = () => {
          navigation.navigate(route.name);
        };

        // Icons mapping based on images
        const getIcon = () => {
          switch (route.name) {
            case 'Home': return require('@/assets/img/home_icon.png');
            case 'Calendar': return require('@/assets/img/calendar_icon.png');
            case 'Inbox': return require('@/assets/img/inbox_icon.png');
            case 'Task': return require('@/assets/img/task_icon.png');
            case 'More': return require('@/assets/img/more_icon.png');
            default: return require('@/assets/img/home_icon.png');
          }
        };

        return (
          <ButtonView
            key={index}
            onPress={onPress}
            style={[
              styles.tabItem,
              isFocused && styles.activeTab // Active circle effect
            ]}
          >
            <Image 
              source={getIcon()} 
              style={[
                styles.icon, 
                { tintColor: isFocused ? Colors.WHITE : Colors.PINE_FOREST }
              ]} 
            />
          </ButtonView>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9', // Light background
    height: 80,
    borderRadius: 40,
    marginHorizontal: 20,
    marginBottom: 30,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    // Shadow for pixel perfect elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.BRUNSWICK_GREEN, // Dark green active state
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  }
});

export default BottomTab;