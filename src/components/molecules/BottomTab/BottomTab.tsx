import React from 'react';
import { StyleSheet, View, Image, Pressable, Text } from 'react-native';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import GlassCard from '../GlassCard/GlassCard';

const BottomTab = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={styles.outerWrapper}>
      <GlassCard
        width="100%" 
        style={styles.glassContainer}
      >
        <View style={styles.tabContent}>
          {state.routes.map((route: any, index: number) => {
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const getIcon = () => {
              switch (route.name) {
                case 'HOME_SCREEN': return require('@/assets/img/home_icon.png');
                case 'LISTING_SCREEN': return require('@/assets/img/calendar_icon.png');
                case 'CHAT_SCREEN': return require('@/assets/img/inbox_icon.png');
                case 'TASK_SCREEN': return require('@/assets/img/taskBottomTabIcon.png');
                case 'MORE_SCREEN': return require('@/assets/img/more_icon.png');
                default: return require('@/assets/img/home_icon.png');
              }
            };

            const getLabel = () => {
              switch (route.name) {
                case 'HOME_SCREEN': return 'Home';
                case 'LISTING_SCREEN': return 'Calendar';
                case 'CHAT_SCREEN': return 'Inbox';
                case 'TASK_SCREEN': return 'Task';
                case 'MORE_SCREEN': return 'More';
                default: return '';
              }
            };

            // Image colors: Teal for active (#41B597), Black/Grey for inactive
            const activeColor = '#41B597'; 
            const inactiveColor = '#000000';

            return (
              <Pressable
                key={index}
                onPress={onPress}
                style={styles.tabItem}
              >
                <Image 
                  source={getIcon()} 
                  style={[
                    styles.icon, 
                    { tintColor: isFocused ? activeColor : inactiveColor }
                  ]} 
                />
                <Text style={[
                  styles.label, 
                  { color: isFocused ? activeColor : inactiveColor }
                ]}>
                  {getLabel()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    backgroundColor: 'transparent', // Ensures the screen background shows through
    paddingHorizontal: Metrics.scale(20),
    paddingBottom: Metrics.verticalScale(20), // Adds space at bottom without absolute
  },
  glassContainer: {
    // Overriding GlassCard defaults to match the thin pill shape in figma
    padding: 0, 
    borderRadius: 40,
    height: Metrics.scale(80),
    justifyContent: 'center',
    marginBottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)', // Lighter glass as seen in image
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '100%',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  }
});

export default BottomTab;



// import React from 'react';
// import { StyleSheet, View, Image, Pressable } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { Colors } from '@/theme/colors';
// import Metrics from '@/utility/Metrics';

// const BottomTab = ({ state, descriptors, navigation }: any) => {
//   return (
//     <View style={styles.tabContainer}>
//       {state.routes.map((route: any, index: number) => {
//         const isFocused = state.index === index;

//         const onPress = () => {
//           navigation.navigate(route.name);
//         };

//         const getIcon = () => {
//           switch (route.name) {
//             case 'HOME_SCREEN': return require('@/assets/img/home_icon.png');
//             case 'LISTING_SCREEN': return require('@/assets/img/calendar_icon.png');
//             case 'CHAT_SCREEN': return require('@/assets/img/inbox_icon.png');
//             case 'TASK_SCREEN': return require('@/assets/img/task_icon.png');
//             case 'MORE_SCREEN': return require('@/assets/img/more_icon.png');
//             default: return require('@/assets/img/home_icon.png');
//           }
//         };

//         // Tab content (background changes if focused)
//         const TabContent = (
//           <Pressable
//             onPress={onPress}
//             style={[
//               styles.tabItem,
//               { backgroundColor: isFocused ? Colors.BRUNSWICK_GREEN : Colors.WHITE }
//             ]}
//           >
//             <Image 
//               source={getIcon()} 
//               style={[
//                 styles.icon, 
//                 { tintColor: isFocused ? Colors.WHITE : Colors.PINE_FOREST }
//               ]} 
//             />
//           </Pressable>
//         );

//         // Wrap all tabs in LinearGradient to show border
//         return (
//           <LinearGradient
//             key={index}
//             colors={[
//               'rgba(128,128,128,0.52)',
//               'rgba(255,255,255,0.52)',
//               'rgba(128,128,128,0.52)',
//             ]}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }} // horizontal gradient
//             style={{ 
//               borderRadius: 28, 
//               padding: 1,  // border thickness
//               marginHorizontal: 5
//             }}
//           >
//             <View style={{ borderRadius: 27, overflow: 'hidden', flex: 1 }}>
//               {TabContent}
//             </View>
//           </LinearGradient>
//         );
//       })}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   tabContainer: {
//     flexDirection: 'row',
//     backgroundColor: Colors.WHITE,
//     height: Metrics.scale(54),
//     borderRadius: 100,
//     marginHorizontal: 40,
//     paddingHorizontal: 10,
//     alignItems: 'center',
//     justifyContent: 'center',  
//     marginBottom: 30,       
//     marginTop: 10,
//   },
//   tabItem: {
//     width: Metrics.scale(54),
//     height: Metrics.scale(54),
//     borderRadius: 100,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   icon: {
//     width: 20,
//     height: 20,
//     resizeMode: 'contain',
//   }
// });

// export default BottomTab;



