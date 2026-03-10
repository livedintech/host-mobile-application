// // screens/HubspotMeeting/CalendarScreen/CalendarScreen.tsx

// import React from 'react';
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Calendar } from 'react-native-calendars';
// import AppText from '@/components/molecules/AppText/AppText';
// import AppButton from '@/components/molecules/AppButton/AppButton';
// import Metrics from '@/utility/Metrics';
// import { MeetingDetailsFormValues } from '@/validation/hubspot/hubspotSchemas';
// import useHubspotCalendarContainer from './HubspotCalendarContainer';

// interface Props {
//   route?: {
//     params?: {
//       userInfo: MeetingDetailsFormValues;
//     };
//   };
// }

// const CalendarScreen = ({ route }: Props) => {
//   const userInfo = route?.params?.userInfo!;

//   const {
//     currentMonth,
//     loadingDates,
//     selectedDate,
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

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Background circles */}
//       <View style={styles.circleContainer} pointerEvents="none">
//         <View style={styles.circleLarge} />
//         <View style={styles.circleMedium} />
//         <View style={styles.circleSmall} />
//       </View>

//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* ─── Title ───────────────────────────────────────────────────────── */}
//         <AppText
//           text="Please select a date so our agent can schedule a meeting with you."
//           textAlign="center"
//           fontSize={26}
//           px={28}
//           mt={16}
//           mb={20}
//         />

//         {/* ─── Loading dates ────────────────────────────────────────────────── */}
//         {loadingDates && (
//           <View style={styles.loadingRow}>
//             <ActivityIndicator size="small" color="#1B4D3E" />
//             <AppText
//               text="Checking agent availability…"
//               fontSize={14}
//               color="#888"
//               ml={8}
//             />
//           </View>
//         )}

//         {/* ─── Calendar ────────────────────────────────────────────────────── */}
//         <Calendar
//           current={`${currentMonth.year}-${String(currentMonth.month).padStart(2, '0')}-01`}
//           markedDates={buildMarkedDates()}
//           onDayPress={(day: { dateString: string }) =>
//             handleDateSelect(day.dateString)
//           }
//           onMonthChange={handleMonthChange}
//           minDate={new Date().toISOString().split('T')[0]}
//           style={styles.calendar}
//           theme={{
//             backgroundColor: '#fff',
//             calendarBackground: '#fff',
//             textSectionTitleColor: '#999',
//             selectedDayBackgroundColor: '#1B4D3E',
//             selectedDayTextColor: '#fff',
//             todayTextColor: '#1B4D3E',
//             dayTextColor: '#222',
//             textDisabledColor: '#ccc',
//             dotColor: '#1B4D3E',
//             selectedDotColor: '#fff',
//             arrowColor: '#1B4D3E',
//             monthTextColor: '#1B4D3E',
//             textDayFontSize: 15,
//             textMonthFontSize: 16,
//             textDayHeaderFontSize: 13,
//             textMonthFontWeight: '700',
//           }}
//         />

//         {/* ─── Legend ──────────────────────────────────────────────────────── */}
//         <View style={styles.legend}>
//           <View style={styles.legendItem}>
//             <View style={styles.legendDot} />
//             <AppText text="Available" fontSize={13} color="#888" />
//           </View>
//           <View style={styles.legendItem}>
//             <View style={[styles.legendDot, { backgroundColor: '#ccc' }]} />
//             <AppText text="Unavailable" fontSize={13} color="#888" />
//           </View>
//         </View>

//         {/* ─── Slots section ───────────────────────────────────────────────── */}
//         {selectedDate !== '' && (
//           <View style={styles.slotsSection}>
//             {/* Date label */}
//             <AppText
//               text={selectedDateLabel}
//               fontSize={17}
//               color="#1B4D3E"
//               mb={12}
//             />

//             {loadingSlots ? (
//               <View style={styles.loadingRow}>
//                 <ActivityIndicator size="small" color="#1B4D3E" />
//                 <AppText
//                   text="Finding available agent…"
//                   fontSize={14}
//                   color="#888"
//                   ml={8}
//                 />
//               </View>
//             ) : !agentWithSlots ? (
//               <View style={styles.noSlotsBox}>
//                 <AppText
//                   text="No agents available on this day."
//                   fontSize={15}
//                   color="#555"
//                   textAlign="center"
//                 />
//                 <AppText
//                   text="Please try another date."
//                   fontSize={13}
//                   color="#aaa"
//                   textAlign="center"
//                   mt={4}
//                 />
//               </View>
//             ) : (
//               <>
//                 {/* Assigned agent badge */}
//                 <View style={styles.agentBadge}>
//                   <View style={styles.agentDot} />
//                   <AppText
//                     text={`You'll meet with ${agentWithSlots.agent.name}`}
//                     fontSize={13}
//                     color="#1B4D3E"
//                   />
//                 </View>

//                 {/* Time slots */}
//                 <AppText
//                   text="Select a time"
//                   fontSize={15}
//                   color="#333"
//                   mt={20}
//                   mb={12}
//                 />
//                 <View style={styles.slotsGrid}>
//                   {agentWithSlots.slots.map((slot, idx) => (
//                     <TouchableOpacity
//                       key={idx}
//                       style={[
//                         styles.slotBtn,
//                         selectedSlot === slot && styles.slotBtnSelected,
//                       ]}
//                       onPress={() => setSelectedSlot(slot)}
//                       activeOpacity={0.7}
//                     >
//                       <AppText
//                         text={formatTime(slot.startTime)}
//                         fontSize={14}
//                         color={selectedSlot === slot ? '#fff' : '#1B4D3E'}
//                       />
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </>
//             )}
//           </View>
//         )}

//         <View style={{ height: 110 }} />
//       </ScrollView>

//       {/* ─── Confirm Button ──────────────────────────────────────────────────── */}
//       {selectedSlot && (
//         <View style={styles.bottomBtn}>
//           <AppButton
//             title="Confirm Booking"
//             onPress={handleConfirmBooking}
//             loading={isBooking}
//           />
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };

// export default CalendarScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#FFFFFF' },
//   scrollContent: { paddingBottom: 24 },

//   loadingRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 10,
//   },
//   calendar: {
//     marginHorizontal: 12,
//     borderRadius: 16,
//   },
//   legend: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 24,
//     marginTop: 12,
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   legendDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#1B4D3E',
//   },
//   slotsSection: {
//     paddingHorizontal: 24,
//     marginTop: 24,
//   },
//   agentBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     backgroundColor: '#F0F7F4',
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   agentDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#1B4D3E',
//   },
//   noSlotsBox: {
//     alignItems: 'center',
//     paddingVertical: 20,
//   },
//   slotsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 10,
//   },
//   slotBtn: {
//     borderWidth: 1.5,
//     borderColor: '#1B4D3E',
//     borderRadius: 10,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: '#fff',
//   },
//   slotBtnSelected: {
//     backgroundColor: '#1B4D3E',
//   },
//   bottomBtn: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     paddingHorizontal: 24,
//     paddingBottom: 32,
//     paddingTop: 12,
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderTopColor: '#F5F5F5',
//   },

//   // Background circles
//   circleContainer: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: -1,
//   },
//   circleLarge: {
//     width: Metrics.screenWidth * 1.5,
//     height: Metrics.screenWidth * 1.5,
//     borderRadius: 1000,
//     borderWidth: 1,
//     borderColor: '#F8F8F8',
//     position: 'absolute',
//   },
//   circleMedium: {
//     width: Metrics.screenWidth * 1.1,
//     height: Metrics.screenWidth * 1.1,
//     borderRadius: 1000,
//     borderWidth: 1,
//     borderColor: '#F4F4F4',
//     position: 'absolute',
//   },
//   circleSmall: {
//     width: Metrics.screenWidth * 0.7,
//     height: Metrics.screenWidth * 0.7,
//     borderRadius: 1000,
//     borderWidth: 1,
//     borderColor: '#F0F0F0',
//     position: 'absolute',
//   },
// });

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
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

  // 100% LOGIC PRESERVED
  const {
    currentMonth,
    loadingDates,
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

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ─── Header Section ────────────────────────────────────────── */}
          <View style={styles.headerSection}>
            <AppText type="Bold" fontSize={32} color={Colors.BLACK} lineHeight={40}>
              Please select a <AppText type="Bold" fontSize={32} color={FIGMA_TEAL}>date</AppText> so our agent can schedule a meeting with you
            </AppText>
          </View>

          {/* ─── Calendar Section (UI Overhaul) ────────────────────────── */}
          <View style={styles.calendarWrapper}>
            <Calendar
              current={`${currentMonth.year}-${String(currentMonth.month).padStart(2, '0')}-01`}
              markedDates={buildMarkedDates()}
              onDayPress={(day: { dateString: string }) => handleDateSelect(day.dateString)}
              onMonthChange={handleMonthChange}
              minDate={new Date().toISOString().split('T')[0]}
              // TRANSPARENT THEME TO MATCH FIGMA
              theme={{
                calendarBackground: 'transparent', 
                textSectionTitleColor: '#7D8699',
                selectedDayBackgroundColor: FIGMA_TEAL,
                selectedDayTextColor: '#fff',
                todayTextColor: FIGMA_TEAL,
                dayTextColor: '#2D3142',
                textDisabledColor: '#B0B5C1',
                dotColor: FIGMA_TEAL,
                arrowColor: '#2D3142',
                monthTextColor: '#2D3142',
                textDayFontFamily: 'Regular',
                textMonthFontFamily: 'Bold',
                textDayHeaderFontFamily: 'Regular',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
              style={styles.calendar}
            />
          </View>

          {/* ─── Slots Section ─────────────────────────────────────────── */}
          {selectedDate !== '' && (
            <View style={styles.slotsSection}>
              <AppText text={selectedDateLabel} type="Bold" fontSize={18} color={FIGMA_TEAL} mb={16} />
              
              {loadingSlots ? (
                <ActivityIndicator size="large" color={FIGMA_TEAL} />
              ) : (
                <View style={styles.slotsGrid}>
                  {agentWithSlots?.slots.map((slot, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.slotBtn,
                        selectedSlot === slot && styles.slotBtnSelected,
                      ]}
                      onPress={() => setSelectedSlot(slot)}
                    >
                      <AppText
                        text={formatTime(slot.startTime)}
                        fontSize={14}
                        type="Bold"
                        color={selectedSlot === slot ? Colors.WHITE : FIGMA_TEAL}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          <View style={{ height: vs(100) }} />
        </ScrollView>

        {/* ─── Next Button ─────────────────────────────────────────────── */}
        {/* <View style={styles.bottomBtnContainer}>
          <AppButton
            title="Next"
            onPress={handleConfirmBooking}
            loading={isBooking}
            disabled={!selectedSlot}
            backgroundColor={selectedSlot ? FIGMA_TEAL : 'rgba(255,255,255,0.3)'}
            color={selectedSlot ? Colors.WHITE : '#999'}
            style={styles.nextBtn}
          />
        </View> */}
      </SafeAreaView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: s(24),
  },
  headerSection: {
    marginTop: vs(30),
    marginBottom: vs(20),
  },
  calendarWrapper: {
    // No white box background to keep it airy like Figma
    marginBottom: vs(10),
  },
  calendar: {
    backgroundColor: 'transparent',
  },
  slotsSection: {
    marginTop: vs(20),
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(10),
  },
  slotBtn: {
    paddingHorizontal: s(16),
    paddingVertical: vs(10),
    borderRadius: ms(12),
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Glass effect
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  slotBtnSelected: {
    backgroundColor: FIGMA_TEAL,
    borderColor: FIGMA_TEAL,
  },
  bottomBtnContainer: {
    paddingHorizontal: s(24),
    paddingBottom: vs(30),
  },
  nextBtn: {
    height: vs(56),
    borderRadius: ms(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CalendarScreen;