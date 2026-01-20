import React from 'react';
import { StyleSheet, View, Image, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '@/theme/colors';
import ButtonView from '../AppButton/ButtonView';
import Metrics from '@/utility/Metrics';

const BottomTab = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;

        const onPress = () => {
          navigation.navigate(route.name);
        };

        const getIcon = () => {
          switch (route.name) {
            case 'HOME_SCREEN': return require('@/assets/img/home_icon.png');
            case 'LISTING_SCREEN': return require('@/assets/img/calendar_icon.png');
            case 'CHAT_SCREEN': return require('@/assets/img/inbox_icon.png');
            case 'TASK_SCREEN': return require('@/assets/img/task_icon.png');
            case 'MORE_SCREEN': return require('@/assets/img/more_icon.png');
            default: return require('@/assets/img/home_icon.png');
          }
        };

        // Tab content (background changes if focused)
        const TabContent = (
          <Pressable
            onPress={onPress}
            style={[
              styles.tabItem,
              { backgroundColor: isFocused ? Colors.BRUNSWICK_GREEN : Colors.WHITE }
            ]}
          >
            <Image 
              source={getIcon()} 
              style={[
                styles.icon, 
                { tintColor: isFocused ? Colors.WHITE : Colors.PINE_FOREST }
              ]} 
            />
          </Pressable>
        );

        // Wrap all tabs in LinearGradient to show border
        return (
          <LinearGradient
            key={index}
            colors={[
              'rgba(128,128,128,0.52)',
              'rgba(255,255,255,0.52)',
              'rgba(128,128,128,0.52)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }} // horizontal gradient
            style={{ 
              borderRadius: 28, 
              padding: 1,  // border thickness
              marginHorizontal: 5
            }}
          >
            <View style={{ borderRadius: 27, overflow: 'hidden', flex: 1 }}>
              {TabContent}
            </View>
          </LinearGradient>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    height: Metrics.scale(54),
    borderRadius: 100,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabItem: {
    width: Metrics.scale(54),
    height: Metrics.scale(54),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  }
});

export default BottomTab;
