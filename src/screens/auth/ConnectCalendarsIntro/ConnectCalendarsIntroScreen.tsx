import AppPressable from '@/components/atoms/AppPressable/AppPressable';
// // import React from 'react';
// // import { StyleSheet, View, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
// // import AppText from '@/components/molecules/AppText/AppText';
// // import AppButton from '@/components/molecules/AppButton/AppButton';
// // import Pagination from '@/components/molecules/Pagination/Pagination';
// // import { navigate } from '@/services/navigationService';
// // import NavigationRoutes from '@/navigation/NavigationRoutes';
// // import BGImage from '@/components/molecules/BGImage/BGImage';
// // import { vs } from 'react-native-size-matters';
// // import { goBack } from '@/services/navigationService';

// // const ConnectCalendarsIntroScreen = () => {
// //   return (
// //     <BGImage source={require('@/assets/img/background/linearBG.png')}>
// //       <KeyboardAvoidingView
// //         style={[styles.container, { backgroundColor: 'transparent' }]} 
// //         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// //         keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
// //       >
// //         <ScrollView 
// //           style={{ flex: 1, backgroundColor: 'transparent' }}
// //           contentContainerStyle={styles.scrollContent} 
// //           showsVerticalScrollIndicator={false}
// //         >
// //           {/* Calendar Card Area */}
// //           <View style={styles.cardContainer}>
// //               <Image 
// //                 source={require('@/assets/img/calendar_view.png')} 
// //                 style={styles.img} 
// //                 resizeMode="contain" 
// //               />
// //           </View>

// //           <View style={styles.titleSection}>
// //             <AppText 
// //               text="Airbnb. Gathern." 
// //               fontSize={32} 
// //               type="Medium" 
// //               textAlign="center"
// //               color="#1A332C" 
// //             />
// //             <AppText 
// //               text="Booking.com. Or just" 
// //               fontSize={32} 
// //               type="Medium" 
// //               textAlign="center"
// //               color="#1A332C" 
// //               mt={-5}
// //             />
// //             <AppText 
// //               text="getting started." 
// //               fontSize={32} 
// //               type="Bold" 
// //               color="#21AA8F" 
// //               textAlign="center"
// //               mt={-5}
// //             />
            
// //             <AppText 
// //               text="Connect your calendars in 1 click. Prevent double bookings and sync your rates instantly."
// //               textAlign="center"
// //               color="#5A716A" 
// //               mt={25} 
// //               fontSize={15}
// //               lineHeight={22}
// //             />
// //           </View>

// //           {/* Button - Using the color prop fix */}
// //           <AppButton 
// //             title="Connect Account" 
// //             onPress={() => console.log("Navigate to Sync logic")}
// //             style={styles.connectBtn}
// //             color="#FFFFFF" 
// //             type="Bold"
// //           />
// //         </ScrollView>

// //         <Pagination activeIndex={1} />
// //       </KeyboardAvoidingView>
// //     </BGImage>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: { flex: 1 },
// //   scrollContent: { 
// //     paddingHorizontal: 25, 
// //     // Reduced paddingBottom so button stays within viewable area
// //     paddingBottom: vs(60), 
// //     paddingTop: vs(20),
// //     alignItems: 'center', // Centers children globally
// //   },
// //   cardContainer: { 
// //     marginTop: vs(10), 
// //     alignItems: 'center',
// //     // FIX: Set a specific height for the image area
// //     height: vs(250), 
// //     width: '100%',
// //   },
// //   img: { 
// //     width: '100%', 
// //     height: '100%' 
// //   },
// //   titleSection: { 
// //     marginTop: vs(30), 
// //     alignItems: 'center',
// //     width: '100%',
// //   },
// //   connectBtn: {
// //     backgroundColor: '#21AA8F',
// //     borderRadius: 100,
// //     height: vs(52),
// //     width: '100%',
// //     marginTop: vs(40), 
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 0,
// //   },
// // });

// // export default ConnectCalendarsIntroScreen;

// import React, { useCallback } from 'react';
// import { StyleSheet, View, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
// import AppText from '@/components/molecules/AppText/AppText';
// import AppButton from '@/components/molecules/AppButton/AppButton';
// import Pagination from '@/components/molecules/Pagination/Pagination';
// import { navigate } from '@/services/navigationService';
// import NavigationRoutes from '@/navigation/NavigationRoutes';
// import BGImage from '@/components/molecules/BGImage/BGImage';
// import { s, vs } from 'react-native-size-matters';
// import { goBack } from '@/services/navigationService';
// import Svgicons from '@/components/atoms/Svgicons/Svgicons';
// import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
// import { Colors } from '@/theme/colors';

// const ConnectCalendarsIntroScreen = () => {
//   const getStarted = useCallback(() => {
//     navigate(NavigationRoutes.AUTH_STACK.AGENT_INTRO)
//   }, []);
//   return (
//     <BGImage source={require('@/assets/img/background/linearBG.png')}>
//       <View style={[styles.container, { backgroundColor: 'transparent' }]}>
//         <ScrollView 
//           style={{ flex: 1, backgroundColor: 'transparent' }}
//           contentContainerStyle={styles.scrollContent} 
//           showsVerticalScrollIndicator={false}
//         >
//           {/* --- ADDED BACK BUTTON --- */}
//           <View style={styles.headerRow}>
//             <GradientBorder borderRadius={16} borderWidth={1} style={styles.arrowCircleInner} >
//               <AppPressable style={styles.arrowCircleInner} onPress={() => goBack()}>
//                 <Svgicons path='arrowLeftIcon' size={24} />
//               </AppPressable>
//             </GradientBorder>
//           </View>
//           {/* ------------------------ */}

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
//             onPress={getStarted}
//             style={styles.connectBtn}
//             color="#FFFFFF" 
//             type="Bold"
//           />
//         </ScrollView>
//         <Pagination activeIndex={1} />
//       </View>
//     </BGImage>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   scrollContent: { 
//     paddingHorizontal: 25, 
//     paddingBottom: vs(60), 
//     alignItems: 'center', 
//   },
//   headerRow: {
//     width: '100%',
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     marginBottom: vs(10),
//   },
//   arrowCircleInner: { 
//     width: 32, 
//     height: 32, 
//     borderRadius: 16, 
//     backgroundColor: Colors.WHITE, 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   cardContainer: { 
//     marginTop: vs(10), 
//     alignItems: 'center',
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
//     width: s(240),
//     marginTop: vs(40), 
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 0,
//   },
// });

// export default ConnectCalendarsIntroScreen;

import React, { useCallback } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Pagination from '@/components/molecules/Pagination/Pagination';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { s, vs } from 'react-native-size-matters';
import { Colors } from '@/theme/colors';
import { useTranslation } from 'react-i18next';

const ConnectCalendarsIntroScreen = () => {
  const { t } = useTranslation();
  const getStarted = useCallback(() => {
    navigate(NavigationRoutes.AUTH_STACK.AGENT_INTRO);
  }, []);

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      {/* SafeAreaView ensures content doesn't hit the notch/status bar */}
      <SafeAreaView style={styles.container}>
        <View style={styles.mainContent}>

          {/* Calendar Card Area - Reduced height slightly to fit all screens */}
          <View style={styles.cardContainer}>
            <Image 
              source={require('@/assets/img/calendar_view.png')} 
              style={styles.img} 
              resizeMode="contain" 
            />
          </View>

          <View style={styles.titleSection}>
            <AppText
              text={t('auth.connect_calendars.title_1')}
              fontSize={26}
              type="Regular"
              textAlign="center"
              color="#000000"
            />
            <AppText
              text={t('auth.connect_calendars.title_2')}
              fontSize={26}
              type="Regular"
              textAlign="center"
              color="#000000"
              mt={-5}
            />
            <AppText
              text={t('auth.connect_calendars.title_3')}
              fontSize={26}
              type="SemiBold"
              color={Colors.PRIMARY_TEAL}
              textAlign="center"
              mt={-5}
            />

            <AppText
              text={t('auth.connect_calendars.description')}
              textAlign="center"
              color="#1c1c1c"
              mt={vs(20)}
              fontSize={15}
              lineHeight={17}
              type='Regular'
            />
          </View>

          {/* Footer Action Area */}
          <View style={styles.footer}>
            <AppButton
              title={t('auth.connect_calendars.connect_account')}
              onPress={getStarted}
              style={styles.connectBtn}
              color="#FFFFFF" 
              type="Bold"
            />
            <Pagination activeIndex={1} />
          </View>

        </View>
      </SafeAreaView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'space-around', // Distributes space between components
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: vs(5),
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
    alignItems: 'center',
    height: vs(210), // Reduced slightly to create more gap for text
    width: '100%',
    marginVertical: vs(10),
  },
  img: { 
    width: '100%', 
    height: '100%' 
  },
  titleSection: { 
    alignItems: 'center',
    width: '100%',
    marginVertical: vs(15),
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    marginTop: vs(10),
  },
  connectBtn: {
    backgroundColor: '#21AA8F',
    borderRadius: 100,
    width: s(240),
    height: vs(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    marginBottom: vs(20),
  },
});
export default ConnectCalendarsIntroScreen;