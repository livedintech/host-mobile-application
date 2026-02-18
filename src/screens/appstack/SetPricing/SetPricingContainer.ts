import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PricingFormValues, pricingSchema } from '@/validation/auth/createListingSchemas';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useMutation } from '@tanstack/react-query';
import { CreateListingDetailsPayload, CreateListingDetailsResponse } from '@/types/api/createListingTypes';
import { createListingDetailsApi, editListingApi } from '@/services/ createListingService';
import Toast from 'react-native-toast-message';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRoute } from '@react-navigation/native';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';

export default function useSetPricingContainer() {
  const { params } = useRoute();
const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();  const { user } = useAuthStore();
  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.id);

  // Discount percentage options
  const discountOptions = Array.from({ length: 21 }, (_, i) => ({
    label: `${i * 5}%`,
    value: `${i * 5}`,
  }));

  const { control, handleSubmit, formState: { errors } } = useForm<PricingFormValues>({
    resolver: yupResolver(pricingSchema) as any,
    defaultValues: {
      weekday_base_price: listing?.weekday_base_price ?? '',
      weekend_base_price: listing?.weekend_base_price ?? '',
      discount: listing?.discount ?? '',
      tax_vat: listing?.tax_vat ?? '',
      markup_price: listing?.markup_price ?? '',
      cleaning_fee: listing?.cleaning_fee ?? '',
      airbnb_discount: listing?.airbnb_discount ?? '',
      gathern_discount: listing?.gathern_discount ?? '',
      booking_discount: listing?.booking_discount ?? '',
      extra_guest_fee: listing?.extra_guest_fee ?? '',
    },
  });

  // ---- Mutations ----
  const { mutate: createListingDetailsPayload, isPending: isCreating } =
    useMutation<CreateListingDetailsResponse, Error, CreateListingDetailsPayload>({
      mutationFn: createListingDetailsApi,
      onError: error => {
        Toast.show({ type: 'error', text1: error.message || 'Something went wrong' });
      },
    });

  const { mutate: updateListingDetails, isPending: isUpdating } = useMutation({
    mutationFn: editListingApi,
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
  const buildPayload = (data: PricingFormValues, isSaveAndExit: boolean = false): CreateListingDetailsPayload => ({
  channel_id,
  listing_id: String(listing_id),
  user_id: String(user?.id),
  save_and_exit: isSaveAndExit ? 1 : 0,
  listing: {
    name: propertyDetail?.name || 'New Listing',
    weekday_base_price: String(data.weekday_base_price),
    weekend_base_price: String(data.weekend_base_price),
    discount: data.discount ? String(data.discount) : undefined,
    tax_vat: data.tax_vat ? String(data.tax_vat) : undefined,
    markup_price: data.markup_price ? String(data.markup_price) : undefined,
    cleaning_fee: String(data.cleaning_fee),
    airbnb_discount: data.airbnb_discount ? String(data.airbnb_discount) : undefined,
    gathern_discount: data.gathern_discount ? String(data.gathern_discount) : undefined,
    booking_discount: data.booking_discount ? String(data.booking_discount) : undefined,
    extra_guest_fee: String(data.extra_guest_fee),
  },
});

  // ---- Handlers ----
  const onNext = (data: PricingFormValues) => {
  // 1. Store Update (taake pricing values persist rahein jab user back aye)
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

  // 2. API Hit
  createListingDetailsPayload(buildPayload(data, false), {
    onSuccess: () => {
      // Navigate to AI Dynamic Pricing
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