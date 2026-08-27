
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Dimensions } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { resetToRoutes } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import {
  HubSpotSlot,
  AgentWithSlots,
  fetchAllAgentsAvailableDates,
  fetchFirstAvailableAgentForDate,
  submitLeadAndBookMeeting,
} from '@/services/hubspotApi';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const today = new Date().toISOString().split('T')[0];

export default function useHubspotCalendarContainer(userInfo: any) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [SCREEN_HEIGHT * 0.85], []);
  const latestDateRef = useRef<string>('');
  const pendingNavRef = useRef<(() => void) | null>(null);
  // Ref mirrors selectedDate state for synchronous reads inside event handlers
  const selectedDateRef = useRef('');

  const [currentMonth, setCurrentMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  const [availableDates, setAvailableDates] = useState<Record<string, boolean>>({});
  const [loadingDates, setLoadingDates] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [agentWithSlots, setAgentWithSlots] = useState<AgentWithSlots | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<HubSpotSlot | null>(null);

  const loadMonthDates = useCallback(async (year: number, month: number) => {
    setLoadingDates(true);
    const dates = await fetchAllAgentsAvailableDates(year, month);
    setAvailableDates(dates);
    setLoadingDates(false);
  }, []);

  useEffect(() => {
    loadMonthDates(currentMonth.year, currentMonth.month);
  }, [currentMonth, loadMonthDates]);

  const handleDateSelect = useCallback(async (dateStr: string) => {
    if (!availableDates[dateStr]) return;
    latestDateRef.current = dateStr;
    selectedDateRef.current = dateStr;
    setSelectedDate(dateStr);
    setSelectedSlot(null);
    setAgentWithSlots(null);
    setLoadingSlots(true);
    const result = await fetchFirstAvailableAgentForDate(dateStr);
    if (latestDateRef.current !== dateStr) return;
    setAgentWithSlots(result);
    setLoadingSlots(false);
  }, [availableDates]);

  const handleMonthChange = useCallback((month: { year: number; month: number }) => {
    // Synchronously clear the ref so openSheet guard fires before React re-renders
    selectedDateRef.current = '';
    bottomSheetRef.current?.dismiss();
    setCurrentMonth(prev => {
      if (prev.year === month.year && prev.month === month.month) return prev;
      return { year: month.year, month: month.month };
    });
    setSelectedDate('');
    setAgentWithSlots(null);
    setSelectedSlot(null);
  }, []);

  // openSheet lives here so it can read selectedDateRef synchronously
  const openSheet = useCallback(() => {
    if (!selectedDateRef.current) return;
    bottomSheetRef.current?.present();
  }, []);

  const markedDates = useMemo(() => {
    const marked: Record<string, any> = {};
    const daysInMonth = new Date(currentMonth.year, currentMonth.month, 0).getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentMonth.year}-${String(currentMonth.month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

      if (dateStr < today) {
        marked[dateStr] = { disabled: true, disableTouchEvent: true };
      } else if (availableDates[dateStr]) {
        marked[dateStr] = { disabled: false, disableTouchEvent: false };
      } else {
        marked[dateStr] = { disabled: true, disableTouchEvent: true };
      }
    }

    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: '#09A389',
        selectedTextColor: '#fff',
      };
    }

    return marked;
  }, [currentMonth, availableDates, selectedDate]);

  const { mutate: confirmBooking, isPending: isBooking } = useMutation({
    mutationFn: () => {
      const fullPhone = `+${userInfo.phone_with_code}${userInfo.phone_number}`;
      return submitLeadAndBookMeeting(
        {
          fullName: userInfo.fullName,
          phone: fullPhone,
          email: userInfo.email || '',
          country: userInfo.country,
          city: userInfo.city,
          language: 'English',
          potentialUnits: userInfo.listing_count === 2 ? 4 : 31,
          meetingDate: new Date(selectedSlot!.startTime).toISOString(),
        },
        selectedSlot!,
        agentWithSlots!.agent
      );
    },
    onSuccess: (result) => {
      if (result.success) {
        pendingNavRef.current = () => resetToRoutes([
          { name: NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE },
          { name: NavigationRoutes.AUTH_STACK.HUB_SPOT_THANK_YOU },
        ] as any);
        bottomSheetRef.current?.dismiss();
      } else {
        bottomSheetRef.current?.dismiss();
        Toast.show({ type: 'error', text1: result.error });
      }
    },
    onError: (error) => {
      console.error('[confirmBooking] Mutation error:', error);
      Toast.show({ type: 'error', text1: 'Something went wrong. Please try again.' });
      bottomSheetRef.current?.dismiss();
    },
  });

  const handleSheetDismiss = useCallback(() => {
    if (pendingNavRef.current) {
      const nav = pendingNavRef.current;
      pendingNavRef.current = null;
      setTimeout(nav, 0);
    }
  }, []);

  const handleConfirmBooking = useCallback(() => {
    if (!selectedSlot || !agentWithSlots) return;
    confirmBooking();
  }, [selectedSlot, agentWithSlots, confirmBooking]);

  const formatTime = useCallback((ms: number) => {
    const d = new Date(ms);
    let h = d.getHours();
    const m = d.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${String(m).padStart(2, '0')} ${ampm}`;
  }, []);

  const refreshDates = useCallback(() => {
    loadMonthDates(currentMonth.year, currentMonth.month);
  }, [currentMonth, loadMonthDates]);

  return {
    today,
    currentMonth,
    loadingDates,
    selectedDate,
    agentWithSlots,
    loadingSlots,
    selectedSlot,
    isBooking,
    markedDates,
    setSelectedSlot,
    handleDateSelect,
    handleMonthChange,
    handleConfirmBooking,
    handleSheetDismiss,
    openSheet,
    formatTime,
    refreshDates,
    bottomSheetRef,
    snapPoints,
  };
}
