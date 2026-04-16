import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Animated,
  PanResponder,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { s, vs, ms } from 'react-native-size-matters';

import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { Colors } from '@/theme/colors';
import useHubspotCalendarContainer from './HubspotCalendarContainer';

const FIGMA_TEAL = '#09A389';

const CalendarScreen = ({ route }: any) => {
  const userInfo = route?.params?.userInfo!;
  const panY = useRef(new Animated.Value(vs(500))).current;

  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const {
    currentMonth,
    selectedDate,
    agentWithSlots,
    loadingSlots,
    selectedSlot,
    isBooking,
    loadingDates,
    setSelectedSlot,
    handleDateSelect,
    handleMonthChange,
    handleConfirmBooking,
    buildMarkedDates,
    formatTime,
    refreshDates,
  } = useHubspotCalendarContainer(userInfo);

  const openSheet = () => {
    if (!selectedDate) return;
    setIsSheetVisible(true);
    Animated.spring(panY, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(panY, {
      toValue: vs(500),
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setIsSheetVisible(false);
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

        {/* ── Main scrollable content ── */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={loadingDates}
              onRefresh={refreshDates}
              colors={[FIGMA_TEAL]}
              tintColor={FIGMA_TEAL}
            />
          }
        >
          {/* Header */}
          <View style={styles.headerSection}>
            <AppText type="Bold" fontSize={28} color={Colors.BLACK} lineHeight={34}>
              Please select a{' '}
              <AppText type="Bold" fontSize={28} color={FIGMA_TEAL}>
                date
              </AppText>
              {' '}so our agent can schedule a meeting with you
            </AppText>
          </View>

          {/* Calendar */}
          <View style={styles.calendarWrapper}>
            {loadingDates ? (
              <View style={styles.calendarLoader}>
                <ActivityIndicator size="large" color={FIGMA_TEAL} />
                <AppText
                  text="Loading available dates..."
                  fontSize={13}
                  color="#666"
                  style={{ marginTop: vs(8) }}
                />
              </View>
            ) : (
              <Calendar
                current={`${currentMonth.year}-${String(currentMonth.month).padStart(2, '0')}-01`}
                markedDates={buildMarkedDates()}
                onDayPress={(day: { dateString: string }) =>
                  handleDateSelect(day.dateString)
                }
                onMonthChange={handleMonthChange}
                minDate={new Date().toISOString().split('T')[0]}
                renderArrow={(direction: 'left' | 'right') => (
                  <View style={styles.arrowContainer}>
                    <Svgicons
                      path={direction === 'left' ? 'arrowLeftIcon' : 'arrowRightIcon'}
                      size={14}
                      color={Colors.BLACK}
                    />
                  </View>
                )}
                theme={{
                  calendarBackground: 'transparent',
                  selectedDayBackgroundColor: FIGMA_TEAL,
                  dotColor: 'transparent',
                  selectedDotColor: 'transparent',
                  todayTextColor: FIGMA_TEAL,
                  arrowColor: FIGMA_TEAL,
                  ...({
                    'stylesheet.day.basic': {
                      base: {
                        width: ms(32),
                        height: ms(32),
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: ms(8),
                      },
                      selected: {
                        backgroundColor: FIGMA_TEAL,
                        borderRadius: ms(8),
                      },
                      today: {
                        backgroundColor: 'transparent',
                        borderRadius: ms(8),
                      },
                      text: {
                        marginTop: 0,
                      },
                    },
                  } as any),
                }}
                style={styles.calendar}
              />
            )}
          </View>
        </ScrollView>

        {/* ── Next button — always visible at bottom ── */}
        <View style={styles.mainFooter}>
          <AppButton
            title="Next"
            onPress={openSheet}
            disabled={!selectedDate}
          />
        </View>

        {/* ── Time slot bottom sheet ── */}
        <Modal
          animationType="none"
          transparent={true}
          visible={isSheetVisible}
          onRequestClose={closeSheet}
        >
          <View style={styles.modalRoot}>
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={closeSheet}
            />

            <Animated.View
              style={[styles.sheetContent, { transform: [{ translateY: panY }] }]}
            >
              <View style={styles.handleWrapper} {...panResponder.panHandlers}>
                <View style={styles.sheetHandle} />
              </View>

              <View style={styles.sheetHeaderRow}>
                <View style={styles.headerLeft}>
                  <View style={styles.clockCircle}>
                    <Svgicons path="Clock" size={20} color={Colors.BLACK} />
                  </View>
                  <AppText
                    text="Select Any One Available Time Slot"
                    type="Bold"
                    fontSize={14}
                    color="#333"
                    ml={10}
                  />
                </View>
                <TouchableOpacity onPress={closeSheet} style={styles.closeCircle}>
                  <Svgicons path="closeIcon" size={14} color={Colors.BLACK} />
                </TouchableOpacity>
              </View>

              <View style={styles.innerContent}>
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
                        style={[
                          styles.slotBtn,
                          selectedSlot === slot && styles.slotBtnSelected,
                        ]}
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
                    <View style={{ height: vs(40) }} />
                  </ScrollView>
                )}
              </View>

              <View style={styles.sheetFooter}>
                <AppButton
                  title="Confirm"
                  onPress={handleConfirmBooking}
                  loading={isBooking}
                  disabled={!selectedSlot}
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
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: vs(20) },
  headerSection: {
    paddingHorizontal: s(24),
    marginTop: vs(15),
    marginBottom: vs(10),
  },
  calendarWrapper: {
    paddingHorizontal: s(10),
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: ms(16),
    paddingVertical: vs(10),
    marginHorizontal: s(10),
  },
  calendarLoader: {
    height: vs(320),
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendar: { backgroundColor: 'transparent' },
  mainFooter: {
    paddingHorizontal: s(24),
    paddingBottom: vs(30),
    paddingTop: vs(10),
  },
  arrowContainer: {
    width: ms(30),
    height: ms(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: ms(8),
  },
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheetContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: ms(30),
    borderTopRightRadius: ms(30),
    height: vs(480),
    width: '100%',
  },
  handleWrapper: { alignItems: 'center', paddingVertical: vs(12) },
  sheetHandle: {
    width: s(45),
    height: vs(5),
    backgroundColor: '#E5E5E5',
    borderRadius: 5,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(24),
    marginBottom: vs(15),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  clockCircle: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(17),
    borderWidth: 1,
    borderColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeCircle: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(15),
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContent: { flex: 1, paddingHorizontal: s(20) },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  slotBtn: {
    width: '23%',
    margin: '1%',
    height: vs(42),
    borderRadius: ms(10),
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  slotBtnSelected: {
    backgroundColor: FIGMA_TEAL,
    borderColor: FIGMA_TEAL,
    elevation: 0,
  },
  sheetFooter: {
    paddingHorizontal: s(24),
    paddingBottom: vs(30),
    paddingTop: vs(10),
    backgroundColor: '#FFF',
  },
});

export default CalendarScreen;