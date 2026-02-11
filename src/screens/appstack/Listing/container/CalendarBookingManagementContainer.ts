import { useQuery } from '@tanstack/react-query';
import { getCalendarBookingManagementListingsApi } from '@/services/calendarBookingManagement'; 
import STORAGE_CONST from '@/constants/storage';
import { useRoute } from '@react-navigation/native';

export default function useCalendarBookingManagementContainer() {
  const { params } = useRoute();

  const { 
    data: listings = [], 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: [STORAGE_CONST.GET_CALENDAR_BOOKINGS], 
    queryFn: getCalendarBookingManagementListingsApi,
  });

  const calendarBookingListing = listings || [];

  return {
    calendarBookingListing,
    isLoading,
    isError,
    refetch,
  };
}