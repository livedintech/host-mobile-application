
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import {
  HubSpotSlot,
  AgentWithSlots,
  fetchAllAgentsAvailableDates,
  fetchFirstAvailableAgentForDate,
  submitLeadAndBookMeeting,
} from '@/services/hubspotApi';
import { MeetingDetailsFormValues } from '@/validation/hubspot/hubspotSchemas';

export default function useHubspotCalendarContainer(
  userInfo: MeetingDetailsFormValues
) {
  const today = new Date().toISOString().split('T')[0];

  // ─── Month ────────────────────────────────────────────────────────────────
  const [currentMonth, setCurrentMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  const [availableDates, setAvailableDates] = useState<Record<string, boolean>>({});
  const [loadingDates, setLoadingDates] = useState(false);

  // ─── Selection ────────────────────────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState('');
  const [agentWithSlots, setAgentWithSlots] = useState<AgentWithSlots | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<HubSpotSlot | null>(null);

  // ─── Load month dates ─────────────────────────────────────────────────────
  useEffect(() => {
    loadMonthDates(currentMonth.year, currentMonth.month);
  }, [currentMonth]);

  const loadMonthDates = async (year: number, month: number) => {
    setLoadingDates(true);
    // Checks all 4 agents in parallel via HubSpot (which reads Google Calendar)
    const dates = await fetchAllAgentsAvailableDates(year, month);
    console.log('Dates received by Container:', dates); // Check your debugger!
    setAvailableDates(dates);
    setLoadingDates(false);
  };

  // ─── Date tap ─────────────────────────────────────────────────────────────
  const handleDateSelect = async (dateStr: string) => {
    if (!availableDates[dateStr]) return;
    setSelectedDate(dateStr);
    setSelectedSlot(null);
    setAgentWithSlots(null);
    setLoadingSlots(true);
    // Auto-picks first available agent (round-robin: 1 → 2 → 3 → 4)
    const result = await fetchFirstAvailableAgentForDate(dateStr);
    console.log('Result from API', dateStr, result)
    setAgentWithSlots(result);
    setLoadingSlots(false);
  };

  // ─── Month change ─────────────────────────────────────────────────────────
  const handleMonthChange = (month: { year: number; month: number }) => {
    setCurrentMonth({ year: month.year, month: month.month });
    setSelectedDate('');
    setAgentWithSlots(null);
    setSelectedSlot(null);
  };

  // ─── Calendar marked dates ────────────────────────────────────────────────
  const buildMarkedDates = () => {
    const marked: Record<string, any> = {};
    const daysInMonth = new Date(currentMonth.year, currentMonth.month, 0).getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentMonth.year, currentMonth.month - 1, d);
      const dateStr = `${currentMonth.year}-${String(currentMonth.month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      
      // Get day of week: 0 = Sunday, 5 = Friday, 6 = Saturday
      const dayOfWeek = date.getDay();
      const isSaudiWeekend = dayOfWeek === 5 || dayOfWeek === 6;

      // Logic for marking dates
      if (dateStr < today) {
        // Past dates: Disabled
        marked[dateStr] = { disabled: true, disableTouchEvent: true };
      } else if (isSaudiWeekend) {
        // Saudi Weekends (Fri/Sat): Disabled and Faded
        marked[dateStr] = { 
          disabled: true, 
          disableTouchEvent: true,
        };
      } else if (availableDates[dateStr]) {
        // Available Weekdays: Active
        marked[dateStr] = { 
          marked: false, 
          disabled: false, 
          disableTouchEvent: false 
        };
      } else {
        // Weekdays with no HubSpot slots: Disabled
        marked[dateStr] = { disabled: true, disableTouchEvent: true };
      }
    }

    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: '#20957B',
        selectedTextColor: '#fff',
        marked: false,
      };
    }

    return marked;
  };

  // ─── Book meeting + create lead ───────────────────────────────────────────
  const { mutate: confirmBooking, isPending: isBooking } = useMutation({
    mutationFn: () =>
      submitLeadAndBookMeeting(
        {
          fullName: userInfo.fullName,
          phone: userInfo?.phone?.phone || '',
          email: userInfo.email || '',
          country: userInfo.country,
          city: userInfo.city,
        },
        selectedSlot!,
        agentWithSlots!.agent
      ),
    onSuccess: (result) => {
      if (result.success) {
        // Navigate to Thank You screen
        navigate(NavigationRoutes.AUTH_STACK.HUB_SPOT_THANK_YOU);
      } else {
        Toast.show({
          type: 'error',
          text1: result.error || 'Booking failed. Please try again.',
        });
      }
    },
    onError: (error: Error) => {
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong.',
      });
    },
  });

  const handleConfirmBooking = () => {
    if (!selectedSlot || !agentWithSlots) return;
    confirmBooking();
  };

  // ─── Format time ──────────────────────────────────────────────────────────
  const formatTime = (ms: number) => {
    const d = new Date(ms);
    let h = d.getHours();
    const m = d.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  const selectedDateLabel = selectedDate
    ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return {
    today,
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
  };
}