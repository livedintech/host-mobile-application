// import React, { useRef, useMemo, useCallback, useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Calendar } from 'react-native-calendars';
// import { s, vs, ms } from 'react-native-size-matters';

// import AppText from '@/components/molecules/AppText/AppText';
// import AppButton from '@/components/molecules/AppButton/AppButton';
// import BGImage from '@/components/molecules/BGImage/BGImage';
// import { Colors } from '@/theme/colors';
// import useHubspotCalendarContainer from './HubspotCalendarContainer';
// import { MeetingDetailsFormValues } from '@/validation/hubspot/hubspotSchemas';
// import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
// import Svgicons from '@/components/atoms/Svgicons/Svgicons';

// const FIGMA_TEAL = '#21AA8F';

// interface Props {
//   route?: {
//     params?: {
//       userInfo: MeetingDetailsFormValues;
//     };
//   };
// }

// const CalendarScreen = ({ route }: Props) => {
//   const userInfo = route?.params?.userInfo!;
//   const bottomSheetRef = useRef<BottomSheet>(null);
//   const [localError, setLocalError] = useState<string | null>(null);

//   const snapPoints = useMemo(() => ['1%', '60%'], []);

//   const {
//     currentMonth,
//     loadingDates,
//     agentWithSlots,
//     loadingSlots,
//     selectedSlot,
//     isBooking,
//     selectedDateLabel,
//     setSelectedSlot,
//     handleDateSelect,
//     handleMonthChange,
//     handleConfirmBooking,
//     buildMarkedDates,
//     formatTime,
//   } = useHubspotCalendarContainer(userInfo);

//   const onDatePress = useCallback((dateString: string) => {
//     setLocalError(null);
//     handleDateSelect(dateString);
//     bottomSheetRef.current?.snapToIndex(1); 
//   }, [handleDateSelect]);

//   const onConfirm = async () => {
//     try {
//       setLocalError(null);
//       await handleConfirmBooking();
//     } catch (err: any) {
//       if (err?.message?.includes('email') || err?.response?.data?.message?.includes('email')) {
//         setLocalError("Invalid email address. Please go back.");
//       } else {
//         setLocalError("Booking failed. Try another slot.");
//       }
//     }
//   };

//   return (
//     <BGImage source={require('@/assets/img/background/linearBG.png')}>
//       <SafeAreaView style={styles.container}>
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//         >
//           <View style={styles.headerSection}>
//             <AppText type="Bold" fontSize={32} color={Colors.BLACK} lineHeight={40}>
//               Please select a{' '}
//               <AppText type="Bold" fontSize={32} color={FIGMA_TEAL}>
//                 date
//               </AppText>{' '}
//               so our agent can schedule a meeting with you
//             </AppText>
//           </View>

//           {loadingDates && (
//             <ActivityIndicator size="small" color={FIGMA_TEAL} style={{ marginBottom: 10 }} />
//           )}

//           <View style={styles.calendarWrapper}>
//             <Calendar
//               current={`${currentMonth.year}-${String(currentMonth.month).padStart(2, '0')}-01`}
//               markedDates={buildMarkedDates()}
//               onDayPress={(day: { dateString: string }) => onDatePress(day.dateString)}
//               onMonthChange={handleMonthChange}
//               minDate={new Date().toISOString().split('T')[0]}
//               theme={{
//                 calendarBackground: 'transparent',
//                 selectedDayBackgroundColor: FIGMA_TEAL,
//                 selectedDayTextColor: '#fff',
//                 todayTextColor: FIGMA_TEAL,
//                 dayTextColor: '#1A332C',
//                 textMonthFontWeight: '700',
//                 textDayFontSize: 16,
//                 textMonthFontSize: 18,
//               }}
//               style={styles.calendar}
//             />
//           </View>
//         </ScrollView>

//         <BottomSheet 
//           ref={bottomSheetRef}
//           index={-1} 
//           snapPoints={snapPoints}
//           enablePanDownToClose={true}
//           handleIndicatorStyle={{ backgroundColor: '#E0E0E0' }}
//         >
//           {/* Main Content Area */}
//           <View style={styles.sheetContent}>
//             <View style={styles.sheetHeader}>
//                <AppText text="Select Available Time Slot" type="Bold" fontSize={17} />
//                <TouchableOpacity onPress={() => bottomSheetRef.current?.close()}>
//                   <Svgicons path="closeIcon" size={18} />
//                </TouchableOpacity>
//             </View>


//             {/* Scrollable Slots Grid */}
//             <BottomSheetScrollView 
//               showsVerticalScrollIndicator={false} 
//               contentContainerStyle={styles.scrollContainerStyle}
//             >
//               {loadingSlots ? (
//                 <ActivityIndicator size="large" color={FIGMA_TEAL} />
//               ) : (
//                 <View style={styles.slotsGrid}>
//                   {agentWithSlots?.slots.map((slot, idx) => (
//                     <TouchableOpacity
//                       key={idx}
//                       style={[
//                         styles.slotBtn,
//                         selectedSlot === slot && styles.slotBtnSelected,
//                       ]}
//                       onPress={() => setSelectedSlot(slot)}
//                     >
//                       <AppText
//                         text={formatTime(slot.startTime)}
//                         fontSize={14}
//                         type="Medium"
//                         color={selectedSlot === slot ? Colors.WHITE : '#1A332C'}
//                       />
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               )}
//             </BottomSheetScrollView>

//             {/* Absolute Footer - Always pinned to the bottom of the sheet */}
//             <View style={styles.absoluteFooter}>
//               {localError && (
//                 <AppText text={localError} color="red" fontSize={12} textAlign="center" mb={10} />
//               )}
//               <AppButton
//                 title="Confirm"
//                 onPress={onConfirm}
//                 loading={isBooking}
//                 disabled={!selectedSlot}
//                 style={[styles.confirmBtn, { opacity: selectedSlot ? 1 : 0.6 }]}
//                 color="#FFFFFF"
//               />
//             </View>
//           </View>
//         </BottomSheet>
//       </SafeAreaView>
//     </BGImage>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   scrollContent: { paddingHorizontal: s(24), paddingBottom: vs(20) },
//   headerSection: { marginTop: vs(30), marginBottom: vs(20) },
//   calendarWrapper: { marginBottom: vs(10) },
//   calendar: { backgroundColor: 'transparent' },

//   sheetContent: {
//     flex: 1, 
//     paddingHorizontal: s(20),
//   },
//   sheetHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: vs(10),
//     marginBottom: vs(10),
//   },
//   scrollContainerStyle: {
//     paddingBottom: vs(120), // Crucial: extra space so last items aren't hidden by button
//   },
//   slotsGrid: { 
//     flexDirection: 'row', 
//     flexWrap: 'wrap', 
//     gap: s(8) 
//   },
//   slotBtn: {
//     width: '22%', 
//     aspectRatio: 2.2,
//     borderRadius: ms(8),
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: vs(5),
//   },
//   slotBtnSelected: { backgroundColor: FIGMA_TEAL, borderColor: FIGMA_TEAL },
//   absoluteFooter: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: s(20),
//     paddingBottom: vs(40), // Space from bottom edge
//     paddingTop: vs(15),
//     borderTopWidth: 1,
//     borderTopColor: '#F2F2F2'
//   },
//   confirmBtn: {
//     backgroundColor: FIGMA_TEAL,
//     borderRadius: 100,
//     height: vs(52),
//     width: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default CalendarScreen;

import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Animated,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { s, vs, ms } from 'react-native-size-matters';

import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { Colors } from '@/theme/colors';
import useHubspotCalendarContainer from './HubspotCalendarContainer';

const FIGMA_TEAL = '#20957B';

const CalendarScreen = ({ route }: any) => {
  const userInfo = route?.params?.userInfo!;
  // This value controls the slide-up/down
  const panY = useRef(new Animated.Value(vs(500))).current; 

  const {
    currentMonth,
    selectedDate,
    agentWithSlots,
    loadingSlots,
    selectedSlot,
    isBooking,
    selectedDateLabel,
    setSelectedSlot,
    handleDateSelect,
    handleMonthChange,
    handleConfirmBooking,
    buildMarkedDates,
    formatTime,
  } = useHubspotCalendarContainer(userInfo);

  // Trigger Slide Up when a date is selected
  useEffect(() => {
    if (selectedDate !== '') {
      Animated.spring(panY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
      }).start();
    }
  }, [selectedDate]);

  const closeSheet = () => {
    Animated.timing(panY, {
      toValue: vs(500),
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      handleMonthChange(currentMonth);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) panY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120) {
          closeSheet();
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerSection}>
          <AppText type="Bold" fontSize={28} color={Colors.BLACK} lineHeight={34}>
            Please select a <AppText type="Bold" fontSize={28} color={FIGMA_TEAL}>date</AppText>
          </AppText>
        </View>

        <View style={styles.calendarWrapper}>
          <Calendar
            current={`${currentMonth.year}-${String(currentMonth.month).padStart(2, '0')}-01`}
            markedDates={buildMarkedDates()}
            onDayPress={(day: { dateString: string }) => handleDateSelect(day.dateString)}
            onMonthChange={handleMonthChange}
            minDate={new Date().toISOString().split('T')[0]}
            theme={{
              calendarBackground: 'transparent',
              selectedDayBackgroundColor: FIGMA_TEAL,
              todayTextColor: FIGMA_TEAL,
              dotColor: FIGMA_TEAL,
              arrowColor: FIGMA_TEAL,
            }}
            style={styles.calendar}
          />
        </View>

        <Modal
          animationType="none" // ⚠️ Set to none to avoid the double-animation glitch
          transparent={true}
          visible={selectedDate !== ''}
          onRequestClose={closeSheet}
        >
          <View style={styles.modalRoot}>
            <TouchableOpacity 
              style={styles.modalOverlay} 
              activeOpacity={1} 
              onPress={closeSheet} 
            />
            
            <Animated.View 
              style={[
                styles.sheetContent, 
                { transform: [{ translateY: panY }] }
              ]}
            >
              <View style={styles.handleWrapper} {...panResponder.panHandlers}>
                <View style={styles.sheetHandle} />
              </View>

              <View style={styles.innerContent}>
                <AppText text={selectedDateLabel} type="Bold" fontSize={16} color={FIGMA_TEAL} mb={4} />
                <AppText text="Select Available Time Slot" type="Bold" fontSize={14} color="#333" mb={12} />

                {loadingSlots ? (
                  <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={FIGMA_TEAL} />
                  </View>
                ) : (
                  <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.slotsGrid}
                  >
                    {agentWithSlots?.slots.map((slot, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={[styles.slotBtn, selectedSlot === slot && styles.slotBtnSelected]}
                        onPress={() => setSelectedSlot(slot)}
                      >
                        <AppText
                          text={formatTime(slot.startTime)}
                          fontSize={12}
                          type="Bold"
                          color={selectedSlot === slot ? Colors.WHITE : FIGMA_TEAL}
                        />
                      </TouchableOpacity>
                    ))}
                    {/* Padding so last row isn't hidden by the footer */}
                    <View style={{ height: vs(100) }} />
                  </ScrollView>
                )}
              </View>

              <View style={styles.sheetFooter}>
                <AppButton
                  title="Confirm"
                  onPress={handleConfirmBooking}
                  loading={isBooking}
                  disabled={!selectedSlot}
                  backgroundColor={selectedSlot ? FIGMA_TEAL : '#A0D1C5'}
                  style={styles.confirmBtn}
                  color='#FFFFFF'
                />
              </View>
            </Animated.View>
          </View>
        </Modal>
      </SafeAreaView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerSection: { paddingHorizontal: s(24), marginTop: vs(15), marginBottom: vs(10) },
  calendarWrapper: { paddingHorizontal: s(10) },
  calendar: { backgroundColor: 'transparent' },
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  modalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  sheetContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: ms(30),
    borderTopRightRadius: ms(30),
    height: vs(450),
    width: '100%',
  },
  handleWrapper: { alignItems: 'center', paddingVertical: vs(15) },
  sheetHandle: { width: s(45), height: vs(5), backgroundColor: '#E5E5E5', borderRadius: 5 },
  innerContent: { flex: 1, paddingHorizontal: s(24) },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  slotBtn: {
    width: '23%', 
    margin: '1%',
    height: vs(35),
    borderRadius: ms(8),
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  slotBtnSelected: { backgroundColor: FIGMA_TEAL, borderColor: FIGMA_TEAL },
  sheetFooter: {
    paddingHorizontal: s(24),
    paddingBottom: vs(30),
    paddingTop: vs(10),
    backgroundColor: '#FFF',
    alignItems: 'center', 
    justifyContent: 'center',
  },
  confirmBtn: {
    height: vs(54),
    width: '100%',
    borderRadius: ms(27),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row', 
  },
});

export default CalendarScreen;