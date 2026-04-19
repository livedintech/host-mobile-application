// useSetPricingContainer.ts
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingPricingApi } from '@/services/ createListingService'; // ✅ correct API
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';

// ── Schema ────────────────────────────────────────────────────────────────────
export const pricingSchema = yup.object().shape({
  currency:           yup.string().required('Currency is required'),
  weekday_price:      yup.string().required('Weekday base price is required'),
  weekend_price:      yup.string().required('Weekend base price is required'),
  tax_vat:            yup.string().optional(),
  airbnb_markup:      yup.string().optional(),
  gathern_markup:     yup.string().optional(),
  booking_com_markup: yup.string().optional(),
  extra_guest_fee:    yup.string().optional(),
});

export type PricingFormValues = yup.InferType<typeof pricingSchema>;

// ── Container ─────────────────────────────────────────────────────────────────
export default function usePricingContainer() {
  const { params } = useRoute<any>();
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user } = useAuthStore();

  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.listing_id); // ✅ consistent
  console.log('listing', listing);


  // ── Form ──────────────────────────────────────────────────────────────────
  const { control, handleSubmit, formState: { errors } } = useForm<PricingFormValues>({
    resolver: yupResolver(pricingSchema) as any,
    // useSetPricingContainer.ts — defaultValues fix

    defaultValues: {
      currency: 'SAR',

      weekday_price: isEdit ? String(listing?.prices?.weekday ?? listing?.prices?.weekday_price ?? '') : '',
      weekend_price: isEdit ? String(listing?.prices?.weekend ?? listing?.prices?.weekend_price ?? '') : '',

      tax_vat: isEdit ? String(
        listing?.prices?.tax !== undefined ? listing.prices.tax
          : listing?.prices?.tax_vat !== undefined ? listing.prices.tax_vat
            : listing?.tax !== undefined ? listing.tax
              : ''
      ) : '',

      airbnb_markup: isEdit ? String(listing?.prices?.airbnb_markup ?? '') : '',
      gathern_markup: isEdit ? String(listing?.prices?.gathern_markup ?? '') : '',

      booking_com_markup: isEdit ? String(
        listing?.prices?.bookingCom_markup !== undefined ? listing.prices.bookingCom_markup
          : listing?.prices?.booking_com_markup !== undefined ? listing.prices.booking_com_markup
            : ''
      ) : '',

      extra_guest_fee: isEdit ? String(
        listing?.prices?.price_per_extra_person !== undefined ? listing.prices.price_per_extra_person
          : listing?.prices?.extra_guest_fee !== undefined ? listing.prices.extra_guest_fee
            : ''
      ) : '',
    },
  });

  // ── Payload builder ───────────────────────────────────────────────────────
  const buildPayload = (data: PricingFormValues, isSaveAndExit: boolean = false) => ({
    user_id: String(user?.id),
    listing_id: String(listing_id),
    channel_id,
    listing_currency: data.currency,          // ✅ swagger root key
    save_and_exit: isSaveAndExit ? 1 : 0,
    prices: {
      weekday: Number(data.weekday_price),      // ✅
      weekend: Number(data.weekend_price),      // ✅
      tax: Number(data.tax_vat),            // ✅ swagger key
      price_per_extra_person: Number(data.extra_guest_fee),    // ✅ swagger key
      markup: Number(data.airbnb_markup),      // ✅ swagger overall markup
      airbnb_markup: Number(data.airbnb_markup),      // 🆕 NEW
      gathern_markup: Number(data.gathern_markup),     // 🆕 NEW
      bookingCom_markup: Number(data.booking_com_markup), // 🆕 NEW
      // swagger existing fields — default 0
      cleaning_fee: 0,
      security_deposit: 0,
      discount: 0,
      airbnb_discount: 0,
      gathern_discount: 0,
      bookingCom_discount: 0,
    },
  });

  // ── Mutation ──────────────────────────────────────────────────────────────
  const { mutate: handlePricingApi, isPending } = useMutation({
    mutationFn: createListingPricingApi, // ✅ correct API
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err.message || 'Something went wrong' }),
  });

  // ── Handler ───────────────────────────────────────────────────────────────
  const onSubmit = (data: PricingFormValues, isSaveAndExit: boolean = false) => {
    updateListing({
      listing_currency: data.currency,
      prices: {
        weekday: Number(data.weekday_price),
        weekend: Number(data.weekend_price),
        tax: Number(data.tax_vat),
        price_per_extra_person: Number(data.extra_guest_fee),
      },
    });

    handlePricingApi(buildPayload(data, isSaveAndExit) as any, {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
        queryClient.invalidateQueries({
          queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
        });
        Toast.show({ type: 'success', text1: res?.message || 'Saved successfully' });

        if (isSaveAndExit) {
          isEdit
            ? goBack()
            : navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS);
        } else {
          navigate(NavigationRoutes.APP_STACK.ADD_DISCOUNTS);
        }
      },
    });
  };

  return {
    control,
    errors,
    handleSubmit,
    onSubmit,
    isLoading: isPending,
    isEdit
  };
}