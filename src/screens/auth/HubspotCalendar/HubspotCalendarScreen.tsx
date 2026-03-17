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
          animationType="none" 
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