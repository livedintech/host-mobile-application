// useSetPricingContainer.ts
import { useForm } from 'react-hook-form';
import i18n from '@/locales/i18n/i18n';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { goBack, navigate, resetToRoutes } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingPricingApi } from '@/services/ createListingService'; // ✅ correct API
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';
import useListingExport from '@/hooks/useListingExport';

// ── Schema ────────────────────────────────────────────────────────────────────
export const pricingSchema = yup.object().shape({
  currency: yup.string().required(i18n.t('app.set_pricing.validation_currency_required')),
  weekday_price: yup.string().required(i18n.t('app.set_pricing.validation_weekday_required')).min(1, i18n.t('app.set_pricing.validation_weekday_required')),
  weekend_price: yup.string().required(i18n.t('app.set_pricing.validation_weekend_required')).min(1, i18n.t('app.set_pricing.validation_weekend_required')),
  tax_vat: yup.string().optional(),
  airbnb_markup: yup.string().optional(),
  gathern_markup: yup.string().optional(),
  booking_com_markup: yup.string().optional(),
  extra_guest_fee: yup.string().optional(),
  cleaning_fee: yup.string().optional(),
});

export type PricingFormValues = yup.InferType<typeof pricingSchema>;
type NormalizedPrices = {
  weekday_price: string;
  weekend_price: string;
  tax_vat: string;
  airbnb_markup: string;
  gathern_markup: string;
  booking_com_markup: string;
  extra_guest_fee: string;
  cleaning_fee: string;
};

const toStringSafe = (val: any): string =>
  val === null || val === undefined || val === 0 || val === '0' ? '' : String(val);

const normalizePrices = (listing: any): NormalizedPrices => {
  const prices = listing?.prices ?? {};

  return {
    weekday_price: toStringSafe(
      prices.weekday_price ?? prices.weekday
    ),

    weekend_price: toStringSafe(
      prices.weekend_price ?? prices.weekend
    ),

    tax_vat: toStringSafe(
      prices.tax_vat ?? prices.tax ?? listing?.tax
    ),

    airbnb_markup: toStringSafe(prices.airbnb_markup),

    gathern_markup: toStringSafe(prices.gathern_markup),

    booking_com_markup: toStringSafe(
      prices.booking_com_markup ?? prices.bookingCom_markup
    ),

    extra_guest_fee: toStringSafe(
      prices.extra_guest_fee ?? prices.price_per_extra_person
    ),

    cleaning_fee: toStringSafe(prices.cleaning_fee),
  };
};

// ── Container ─────────────────────────────────────────────────────────────────
export default function usePricingContainer() {
  const { params } = useRoute<any>();
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user } = useAuthStore();

  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.listing_id); // ✅ consistent

  // ── Export ────────────────────────────────────────────────────────────────
  const {
    bottomSheetVisible,
    setBottomSheetVisible,
    handleExport,
    handleExportSubmit,
    handleOtaSubmit,
    otaControl,
    otaErrors,
    listingOptions,
    isPendingExporting: isExporting,
  } = useListingExport();

  // ── Form ──────────────────────────────────────────────────────────────────
  const normalized = isEdit ? normalizePrices(listing) : null;

  const { control, handleSubmit, formState: { errors } } = useForm<PricingFormValues>({


    resolver: yupResolver(pricingSchema) as any,
    // useSetPricingContainer.ts — defaultValues fix

    defaultValues: {
      currency: listing?.listing_currency ?? 'SAR',

      weekday_price: normalized?.weekday_price ?? '',
      weekend_price: normalized?.weekend_price ?? '',
      tax_vat: normalized?.tax_vat ?? '',
      airbnb_markup: normalized?.airbnb_markup ?? '',
      gathern_markup: normalized?.gathern_markup ?? '',
      booking_com_markup: normalized?.booking_com_markup ?? '',
      extra_guest_fee: normalized?.extra_guest_fee ?? '',
      cleaning_fee: normalized?.cleaning_fee ?? '',
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
      cleaning_fee: Number(data.cleaning_fee),
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
      Toast.show({ type: 'error', text1: err.message || i18n.t('common.toast.something_went_wrong') }),
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
        Toast.show({ type: 'success', text1: res?.message || i18n.t('common.toast.saved') });

        if (isSaveAndExit) {
          isEdit
            ? goBack()
            : resetToRoutes([{ name: NavigationRoutes.APP_STACK.ROOT_STACK }, { name: NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS }] as any);
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
  isEdit,

  // export
  handleExport,
  handleExportSubmit,
  bottomSheetVisible,
  setBottomSheetVisible,
  otaControl,
  otaErrors,
  handleOtaSubmit,
  listingOptions,
  isExporting,
};
}