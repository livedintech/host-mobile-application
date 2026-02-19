import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PricingFormValues, pricingSchema } from '@/validation/auth/createListingSchemas';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useMutation } from '@tanstack/react-query';
import { CreateListingDetailsPayload, CreateListingDetailsResponse, createListingPricingPayload, createListingPricingResponse } from '@/types/api/createListingTypes';
import { createListingDetailsApi, createListingPricingApi, editListingApi, editListingPriceApi } from '@/services/ createListingService';
import Toast from 'react-native-toast-message';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRoute } from '@react-navigation/native';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';
import { useEffect } from 'react';

export default function useSetPricingContainer() {
  const { params } = useRoute();
  const { updateListing, listing_id, channel_id } = useCreateListingStore();
  const { user } = useAuthStore();
  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.id);

  // Discount percentage options
  const discountOptions = Array.from({ length: 21 }, (_, i) => ({
    label: `${i * 5}%`,
    value: String(i * 5),
  }));


  const { control, handleSubmit, formState: { errors } } =
    useForm<PricingFormValues>({
      resolver: yupResolver(pricingSchema) as any,
      defaultValues: {
  weekday_base_price: listing?.prices?.weekday?.toString() || '',
  weekend_base_price: listing?.prices?.weekend?.toString() || '',
  discount: String(listing?.discounts ?? 0),           // ✅ listing.discounts
  tax_vat: String(listing?.tax ?? 0),                  // ✅ already correct
  markup_price: String(listing?.markup ?? 0),          // ✅ already correct
  cleaning_fee: listing?.prices?.cleaning_fee?.toString() || '',
  airbnb_discount: String(listing?.prices?.airbnb_discount ?? 0),
  gathern_discount: String(listing?.prices?.gathern_discount ?? 0),
  booking_discount: String(listing?.prices?.bookingCom_discount ?? 0),
  extra_guest_fee: listing?.prices?.price_per_extra_person?.toString() || '',
},

    });


  // ---- Mutations ----
  const { mutate: createListingDetailsPayload, isPending: isCreating } =
    useMutation<createListingPricingResponse, Error, createListingPricingPayload>({
      mutationFn: createListingPricingApi,
      onError: error => {
        Toast.show({ type: 'error', text1: error.message || 'Something went wrong' });
      },
    });

  const { mutate: updateListingDetails, isPending: isUpdating } = useMutation({
    mutationFn: editListingPriceApi,
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
      });
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS],
      });
      Toast.show({ type: 'success', text1: message || 'Updated successfully' });
      goBack();
    },
    onError: error => {
      Toast.show({ type: 'error', text1: error.message || 'Something went wrong' });
    },
  });

  // ---- Payload builder ----
  const buildPayload = (data: PricingFormValues, isSaveAndExit: boolean = false): createListingPricingPayload => ({
    user_id: Number(user?.id),
    listing_id: String(listing_id),
    channel_id: String(channel_id),
    listing_currency: "SAR", // Swagger requirement
    // save_and_exit: isSaveAndExit ? 1 : 0,
    save_and_exit: 0,
    prices: {
      weekday: Number(data.weekday_base_price),
      weekend: Number(data.weekend_base_price),
      cleaning_fee: Number(data.cleaning_fee),
      security_deposit: 0, // Agar form mein nahi hai toh default 0 bhejien
      price_per_extra_person: Number(data.extra_guest_fee || 0),
      discount: Number(data.discount || 0),
      tax: Number(data.tax_vat || 0),
      markup: Number(data.markup_price || 0),
      airbnb_discount: Number(data.airbnb_discount || 0),
      gathern_discount: Number(data.gathern_discount || 0),
      bookingCom_discount: Number(data.booking_discount || 0), // Swagger key: bookingCom_discount
    }
  });

  // ---- Handlers ----
  const onNext = (data: PricingFormValues) => {
    // Store update for UI persistence
    updateListing({
      weekday_base_price: data.weekday_base_price,
      weekend_base_price: data.weekend_base_price,
      discount: data.discount,
      tax_vat: data.tax_vat,
      markup_price: data.markup_price,
      cleaning_fee: data.cleaning_fee,
      airbnb_discount: data.airbnb_discount,
      gathern_discount: data.gathern_discount,
      booking_discount: data.booking_discount,
      extra_guest_fee: data.extra_guest_fee,
    });

    // API Call with exact Swagger structure
    createListingDetailsPayload(buildPayload(data, false), {
      onSuccess: () => {
        navigate(NavigationRoutes.APP_STACK.CREATE_EDIT_AI_DYNAMIC_PRICING);
      },
    });
  };

  const onSaveExit = (data: PricingFormValues) => {
    // Persistence call
    updateListing({ weekday_base_price: data.weekday_base_price });

    const payload = buildPayload(data, true); // save_and_exit: 1

    if (isEdit) {
      updateListingDetails(payload);
    } else {
      createListingDetailsPayload(payload, {
        onSuccess: () => {
          navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS);
        },
      });
    }
  };

  return {
    control,
    errors,
    handleSubmit,
    onNext,
    onSaveExit,
    isEdit,
    isLoading: isCreating || isUpdating,
    discountOptions,
  };
}