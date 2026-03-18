// import React from 'react';
// import { StyleSheet, View, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
// import AppText from '@/components/molecules/AppText/AppText';
// import AppButton from '@/components/molecules/AppButton/AppButton';
// import Pagination from '@/components/molecules/Pagination/Pagination';
// import { navigate } from '@/services/navigationService';
// import NavigationRoutes from '@/navigation/NavigationRoutes';
// import BGImage from '@/components/molecules/BGImage/BGImage';
// import { vs } from 'react-native-size-matters';
// import { goBack } from '@/services/navigationService';

// const ConnectCalendarsIntroScreen = () => {
//   return (
//     <BGImage source={require('@/assets/img/background/linearBG.png')}>
//       <KeyboardAvoidingView
//         style={[styles.container, { backgroundColor: 'transparent' }]} 
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
//       >
//         <ScrollView 
//           style={{ flex: 1, backgroundColor: 'transparent' }}
//           contentContainerStyle={styles.scrollContent} 
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Calendar Card Area */}
//           <View style={styles.cardContainer}>
//               <Image 
//                 source={require('@/assets/img/calendar_view.png')} 
//                 style={styles.img} 
//                 resizeMode="contain" 
//               />
//           </View>

//           <View style={styles.titleSection}>
//             <AppText 
//               text="Airbnb. Gathern." 
//               fontSize={32} 
//               type="Medium" 
//               textAlign="center"
//               color="#1A332C" 
//             />
//             <AppText 
//               text="Booking.com. Or just" 
//               fontSize={32} 
//               type="Medium" 
//               textAlign="center"
//               color="#1A332C" 
//               mt={-5}
//             />
//             <AppText 
//               text="getting started." 
//               fontSize={32} 
//               type="Bold" 
//               color="#21AA8F" 
//               textAlign="center"
//               mt={-5}
//             />
            
//             <AppText 
//               text="Connect your calendars in 1 click. Prevent double bookings and sync your rates instantly."
//               textAlign="center"
//               color="#5A716A" 
//               mt={25} 
//               fontSize={15}
//               lineHeight={22}
//             />
//           </View>

//           {/* Button - Using the color prop fix */}
//           <AppButton 
//             title="Connect Account" 
//             onPress={() => console.log("Navigate to Sync logic")}
//             style={styles.connectBtn}
//             color="#FFFFFF" 
//             type="Bold"
//           />
//         </ScrollView>

//         <Pagination activeIndex={1} />
//       </KeyboardAvoidingView>
//     </BGImage>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   scrollContent: { 
//     paddingHorizontal: 25, 
//     // Reduced paddingBottom so button stays within viewable area
//     paddingBottom: vs(60), 
//     paddingTop: vs(20),
//     alignItems: 'center', // Centers children globally
//   },
//   cardContainer: { 
//     marginTop: vs(10), 
//     alignItems: 'center',
//     // FIX: Set a specific height for the image area
//     height: vs(250), 
//     width: '100%',
//   },
//   img: { 
//     width: '100%', 
//     height: '100%' 
//   },
//   titleSection: { 
//     marginTop: vs(30), 
//     alignItems: 'center',
//     width: '100%',
//   },
//   connectBtn: {
//     backgroundColor: '#21AA8F',
//     borderRadius: 100,
//     height: vs(52),
//     width: '100%',
//     marginTop: vs(40), 
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 0,
//   },
// });

// export default ConnectCalendarsIntroScreen;

import React, { useCallback } from 'react';
import { StyleSheet, View, ScrollView, Image, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Pagination from '@/components/molecules/Pagination/Pagination';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { s, vs } from 'react-native-size-matters';
import { goBack } from '@/services/navigationService';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { Colors } from '@/theme/colors';

const ConnectCalendarsIntroScreen = () => {
  const getStarted = useCallback(() => {
    navigate(NavigationRoutes.AUTH_STACK.AGENT_INTRO)
  }, []);
  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={[styles.container, { backgroundColor: 'transparent' }]}>
        <ScrollView 
          style={{ flex: 1, backgroundColor: 'transparent' }}
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* --- ADDED BACK BUTTON --- */}
          <View style={styles.headerRow}>
            <GradientBorder borderRadius={16} borderWidth={1} style={styles.arrowCircleInner} >
              <Pressable style={styles.arrowCircleInner} onPress={() => goBack()}>
                <Svgicons path='arrowLeftIcon' size={24} />
              </Pressable>
            </GradientBorder>
          </View>
          {/* ------------------------ */}

          {/* Calendar Card Area */}
          <View style={styles.cardContainer}>
              <Image 
                source={require('@/assets/img/calendar_view.png')} 
                style={styles.img} 
                resizeMode="contain" 
              />
          </View>

          <View style={styles.titleSection}>
            <AppText 
              text="Airbnb. Gathern." 
              fontSize={32} 
              type="Medium" 
              textAlign="center"
              color="#1A332C" 
            />
            <AppText 
              text="Booking.com. Or just" 
              fontSize={32} 
              type="Medium" 
              textAlign="center"
              color="#1A332C" 
              mt={-5}
            />
            <AppText 
              text="getting started." 
              fontSize={32} 
              type="Bold" 
              color="#21AA8F" 
              textAlign="center"
              mt={-5}
            />
            
            <AppText 
              text="Connect your calendars in 1 click. Prevent double bookings and sync your rates instantly."
              textAlign="center"
              color="#5A716A" 
              mt={25} 
              fontSize={15}
              lineHeight={22}
            />
          </View>

          {/* Button - Using the color prop fix */}
          <AppButton 
            title="Connect Account" 
            onPress={getStarted}
            style={styles.connectBtn}
            color="#FFFFFF" 
            type="Bold"
          />
        </ScrollView>
        <Pagination activeIndex={1} />
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { 
    paddingHorizontal: 25, 
    paddingBottom: vs(60), 
    alignItems: 'center', 
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: vs(10),
  },
  arrowCircleInner: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: Colors.WHITE, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  cardContainer: { 
    marginTop: vs(10), 
    alignItems: 'center',
    height: vs(250), 
    width: '100%',
  },
  img: { 
    width: '100%', 
    height: '100%' 
  },
  titleSection: { 
    marginTop: vs(30), 
    alignItems: 'center',
    width: '100%',
  },
  connectBtn: {
    backgroundColor: '#21AA8F',
    borderRadius: 100,
    width: s(240),
    marginTop: vs(40), 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
});

export default ConnectCalendarsIntroScreen;