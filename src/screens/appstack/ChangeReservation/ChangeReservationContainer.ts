import { useMutation, useQueryClient } from '@tanstack/react-query';
import i18n from '@/locales/i18n/i18n';
import {
  changeReservationApi,
  getListing,
} from '@/services/calendarBookingManagement';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import STORAGE_CONST from '@/constants/storage';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

const ChangeReservationContainer = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  // Get booking_id from navigation params (ReviewDetailScreen passed it)
  const params = route.params?.bookingData || {};
  const booking_id = params?.booking_id;

  const {
    control,
    handleSubmit,
    setValue,
    
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      listing_id: params.listing_id?.toString() || '',
      dates: `${params.check_in} - ${params.check_out}`,
      start_date: params.check_in || '',
      end_date: params.check_out || '',
      guests: params.guests?.toString() || '01',
      basePrice: params.basePrice || '0.00',
    },
  });

  // React Query Mutation
  const { mutate, isPending: isUpdating } = useMutation({
    mutationFn: changeReservationApi,
    onSuccess: data => {
      Toast.show({ type: 'success', text1: i18n.t('common.toast.request_sent') });
      // Invalidate queries to refresh data on previous screens
      //   queryClient.invalidateQueries([STORAGE_CONST.GET_BOOKING_DETAILS]);
      navigation.goBack();
    },
    onError: (error: any) => {
      console.log('errorTesttt', error);
      Toast.show({
        type: 'error',
        text1: error?.message,
      });
    },
  });

  const onSubmit = (data: any) => {
    const payload = {
      booking_id: booking_id,
      listing_id: data.listing_id,
      start_date: data.start_date,
      end_date: data.end_date,
      amount: data.basePrice,
    };
    mutate(payload);
  };

  const { data: rawListings = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_LISTING],
    queryFn: getListing,
  });

  const listingOptions = useMemo(
    () =>
      rawListings?.map((item: any) => ({
        label: item.value,
        value: item.id.toString(),
      })) || [],
    [rawListings],
  );

  // Inside ChangeReservationContainer
  useEffect(() => {
    if (params.basePrice) {
      setValue('basePrice', String(params.basePrice));
    }
  }, [params.basePrice]);
  return {
    listingOptions,
    control,
    errors,
    watch,
    setValue,
    handleSubmit: handleSubmit(onSubmit), // Wrap the submit logic
    isUpdating,
  };
};

export default ChangeReservationContainer;
