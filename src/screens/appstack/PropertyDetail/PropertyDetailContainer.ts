import i18n from '@/locales/i18n/i18n';
// PropertyDetailContainer.ts
import STORAGE_CONST from '@/constants/storage';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import {
  createListingExportApi,
  deleteListingApi,
  getManageListingDetailById,
} from '@/services/ createListingService';
import { goBack, navigate } from '@/services/navigationService';
import { useAuthStore } from '@/store/useAuthStore';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Alert } from 'react-native';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Toast from 'react-native-toast-message';
import { queryClient } from '@/services/api';
import { DeleteListingPayloadType } from '@/types/api/bookingManagementTypes';
import { getUser } from '@/services/UserPermission';
import { useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateListingDetailsResponse, CreateListingExportPayloadType } from '@/types/api/createListingTypes';
import { getChannelsUserbyId } from '@/services/bookingManagementApi';

dayjs.extend(customParseFormat);

const otaAccountSchema = yup.object({
  ota_account: yup.string().required(i18n.t('app.validation.ota_required')),
});

type OtaAccountFormValues = { ota_account: string };

export default function usePropertyDetailContainer() {
  const { user } = useAuthStore();
  const { listing_id } = useCreateListingStore();
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const {
    control: otaControl,
    handleSubmit: handleOtaSubmit,
    formState: { errors: otaErrors },
    watch: newWatch,
  } = useForm<OtaAccountFormValues>({
    resolver: yupResolver(otaAccountSchema) as any,
    defaultValues: { ota_account: '' },
  });

  const ota_Account = newWatch('ota_account');

  // ── OTA Accounts ──────────────────────────────────────────────────────────
  const { data: response, isLoading: isLoadingChannelList } = useQuery({
    queryKey: [STORAGE_CONST.GET_CHANNELS_USER, user?.id],
    queryFn: () => getChannelsUserbyId({ user_id: Number(user?.id) }),
    enabled: !!user?.id,
  });

  const connectedAccounts = response?.data || [];
  const listingOptions = connectedAccounts
    .filter((item: any) => item.connection_type === 'Airbnb')
    .map((item: any) => ({
      label: `Airbnb - ${item?.id} - ${item?.channel_name}`,
      value: item.ch_channel_id,
    }));

  // ── Export ────────────────────────────────────────────────────────────────
  const handleExport = () => setBottomSheetVisible(true);

  const { mutate: createListingExportPayload, isPending: isPendingExporting } =
    useMutation<CreateListingDetailsResponse, Error, CreateListingExportPayloadType>({
      mutationFn: createListingExportApi,
      onSuccess: ({ message }) => {
        setBottomSheetVisible(false);
        queryClient.invalidateQueries({
          queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
        });
        queryClient.invalidateQueries({
          queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS],
        });
        // ✅ OTA name dhundho selected account se
        const selectedAccount = connectedAccounts.find(
          (item: any) => item.ch_channel_id === ota_Account,
        );
        const otaName = selectedAccount?.connection_type || 'OTA Platform';
        Toast.show({ type: 'success', text1: message || i18n.t('common.toast.exported') });
        // navigate(NavigationRoutes.APP_STACK.LISTING_EXPORT_SUCCESS, { otaName });
      },
      onError: (err: any) =>
        Toast.show({ type: 'error', text1: err.message || i18n.t('common.toast.something_went_wrong') }),
    });

  const handleExportSubmit = (data: OtaAccountFormValues) => {
    createListingExportPayload({
      channel_id: ota_Account,
      listing_id: String(listing_id),
    });
  };

  // ── Listing Detail ────────────────────────────────────────────────────────
  const { data, refetch, isLoading } = useQuery({
    queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
    queryFn: () => getManageListingDetailById({ listing_id: listing_id!, user_id: user?.id! }),
    enabled: Boolean(listing_id),
  });

  // ── Delete ────────────────────────────────────────────────────────────────
  const { mutate: deletePropertyPayload } = useMutation<any, Error, DeleteListingPayloadType>({
    mutationFn: deleteListingApi,
    onSuccess: ({ message }) => {
      Toast.show({ type: 'success', text1: message });
      goBack();
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
    },
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err.message || i18n.t('common.toast.something_went_wrong') }),
  });

  // ── Data Mapping ──────────────────────────────────────────────────────────
  const listing = data?.data?.listing;

  console.log('listing?.cleaning_instructions', listing);


  // ✅ Description parsing — API plain string ya object dono handle
  let extractedDescription = '';
  const rawDescription = listing?.listing_descriptions?.[0];
  if (typeof rawDescription === 'string') {
    try {
      const parsed = JSON.parse(rawDescription);
      extractedDescription = parsed?.description || rawDescription;
    } catch {
      extractedDescription = rawDescription;
    }
  } else if (typeof rawDescription === 'object' && rawDescription !== null) {
    extractedDescription = rawDescription?.description || '';
  }
  const propertyData = {
    title: listing?.name || '',
    discounts: listing?.discounts ? `${listing.discounts}%` : '',

    // ✅ country.name — API object deta hai
    address: [
      listing?.street,
      listing?.apt,
      listing?.city?.name,
      listing?.district?.name,
      listing?.state?.name,
      listing?.country?.name,
    ].filter(Boolean).join(', '),

    placeInfo: {
      size: listing?.property_area ?? '',
      bedrooms: listing?.bedrooms ?? '',
      beds: listing?.beds ?? '',
      bathrooms: listing?.bathrooms ?? '',
      kitchen: listing?.has_kitchen === 1 || listing?.has_kitchen === true,
      pool: listing?.has_pool === 1 || listing?.has_pool === true,
      longTermStay: listing?.long_term_stay === 1 ? 'Yes' : 'No',
      minGapNight: listing?.min_gap_night ?? '',
      minNights: listing?.min_nights ?? '', // ✅ Fix
      maxNights: listing?.max_nights ?? '',
      features: Array.isArray(listing?.amenities_with_labels)
        ? listing.amenities_with_labels.map((a: { label: string }) => a.label).join(', ')
        : Array.isArray(listing?.amenities)
          ? listing.amenities.join(', ')
          : '',
    },

    houseDetails: {
      description: extractedDescription || 'No description provided',
      wifiUsername: listing?.wifi_network || '',
      wifiPassword: listing?.wifi_password || '',
      doorLockCode: listing?.door_lock_code || '',
    },

    bookingDetails: {
      bookingType: listing?.instant_booking === 0 ? 'Instant' : 'Manual', // ✅ Fix
      guestEligibility: listing?.guest_eligibility === 1,
      checkIn: listing?.check_in_time
        ? dayjs(listing.check_in_time, 'HH:mm:ss').format('hh:mm a')
        : '',
      checkOut: listing?.check_out_time
        ? dayjs(listing.check_out_time, 'HH:mm:ss').format('hh:mm a')
        : '',
    },

    guidelines: {
        houseManual: listing?.house_manual || listing?.house_manul || '',  // ✅ API has both spellings
      arrivalGuide: listing?.arrival_guide || '',
      houseRules: listing?.house_rule || '',
      checkoutInstructions: listing?.cleaning_instructions || '',
      // ✅ Add this:
      checkoutInstructionsTasks: (() => {
        const ci = listing?.checkout_instructions;
        if (!ci || typeof ci !== 'object') return '';
        const taskMap: Record<string, string> = {
          return_keys: 'Return Keys',
          turn_things_off: 'Turn Things Off',
          throw_trash: 'Throw Trash',
          lock_up: 'Lock Up',
          gather_towels: 'Gather Towels',
          additional_requests: 'Additional Requests',
        };
        const presentTasks = Object.entries(ci)
          .filter(([_, val]: any) => val?.is_present === true)
          .map(([key]) => taskMap[key] || key);
        return presentTasks.join(', ');
      })(),
    },

    // ✅ Cancel policies — API { id, title } object deta hai
    cancelPolicies: {
      airbnb: listing?.cancellation_policy || '',
      gathern: listing?.gathern_cancellation_policy?.title || '',
      booking: listing?.bookingCom_cancellation_policy?.title || '',
    },

    aiPricing: {
      pricingMode: listing?.pricing_mode,               // ✅ Fix — pricing_mode
      manualOverride: listing?.manual_price_override === 1,
    },

    pricing: {
      weekday: listing?.prices?.weekday ? `SAR ${listing.prices.weekday}` : '',
      weekend: listing?.prices?.weekend ? `SAR ${listing.prices.weekend}` : '',
      discount: listing?.discounts ? `${listing.discounts}%` : '',
      tax: listing?.tax ? `${listing.tax}%` : '',
      markup: listing?.markup ? `${listing.markup}%` : '',
      cleaning: listing?.prices?.cleaning_fee ? `SAR ${listing.prices.cleaning_fee}` : '',
      airbnbDiscount: listing?.prices?.airbnb_discount ? `${listing.prices.airbnb_discount}%` : '',
      gathernDiscount: listing?.prices?.gathern_discount ? `${listing.prices.gathern_discount}%` : '',
      bookingDiscount: listing?.prices?.bookingCom_discount ? `${listing.prices.bookingCom_discount}%` : '',
      extraGuestFee: listing?.prices?.price_per_extra_person
        ? `SAR ${listing.prices.price_per_extra_person}`
        : '',
    },

    disclosure: {
      cameras: listing?.exterior_security_camera === 1 || listing?.exterior_security_camera === true,
      noise: listing?.noise_decibel_monitor === 1 || listing?.noise_decibel_monitor === true,
      weapons: listing?.weapon_on_property === 1 || listing?.weapon_on_property === true,
    },

    // ✅ Documents — API object deta hai (ownership, authority_license, national_id)
    documents: (() => {
      const docs = Array.isArray(listing?.documents) ? listing.documents : [];
      const findDoc = (type: string) =>
        docs.find((d: any) => d.type === type)?.file_name || '';
      return {
        ownership: findDoc('ownership'),
        authorityLicense: findDoc('authority_license'),
        nationalId: findDoc('national_id'),
      };
    })(),

    photos: listing?.photos || {},
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleEditSection = (section: string, editType?: string) => {
    switch (section) {
      case 'Address':
        navigate(NavigationRoutes.APP_STACK.CONFIRM_ADDRESS, { paramData: data?.data });
        break;
      case 'PlaceInfo':
        navigate(NavigationRoutes.APP_STACK.ABOUT_THE_PLACE, { paramData: data?.data });
        break;
      case 'Location':
        navigate(NavigationRoutes.APP_STACK.LOCATION, { paramData: data?.data });
        break;
      case 'Amenities':
        navigate(NavigationRoutes.APP_STACK.AMENITIES, { paramData: data?.data });
        break;
      case 'HouseDetails':
        navigate(NavigationRoutes.APP_STACK.DESCRIBE_YOUR_HOUSE, {
          paramData: data?.data,
          editType,
        });
        break;
      case 'WifiAndDoorLock': // ✅ new case
        navigate(NavigationRoutes.APP_STACK.WIFI_AND_DOOR_LOCK_SCREEN, { paramData: data?.data });
        break;
      case 'ArrivalGuide':
        navigate(NavigationRoutes.APP_STACK.ADD_PROPERTY_GUIDELINES, { paramData: data?.data, hideWifiFields: true, guidelinesSection: 'arrival' });
        break;
      case 'Guidelines':
        navigate(NavigationRoutes.APP_STACK.ADD_PROPERTY_GUIDELINES, { paramData: data?.data, hideWifiFields: true, guidelinesSection: 'guidelines' });
        break;
      case 'CheckoutInstructions':
        navigate(NavigationRoutes.APP_STACK.CHECKOUT_INSTRUCTION, { paramData: data?.data });
        break;
      case 'Policies':
        navigate(NavigationRoutes.APP_STACK.SELECT_PROPERTY_POLICIES, { paramData: data?.data });
        break;
      case 'BookingDetails':
        navigate(NavigationRoutes.APP_STACK.CREATE_EDIT_BOOKING_DETAIL, { paramData: data?.data });
        break;
      case 'BookingRules':
        navigate(NavigationRoutes.APP_STACK.ADD_BOOKING_RULES, { paramData: data?.data });
        break;
      case 'CancelPolicies':
        navigate(NavigationRoutes.APP_STACK.ADD_BOOKING_CANCEL_POLICIES, { paramData: data?.data });
        break;
      case 'AIPricing':
        navigate(NavigationRoutes.APP_STACK.CREATE_EDIT_AI_DYNAMIC_PRICING, { paramData: data?.data });
        break;
      case 'discounts':
        navigate(NavigationRoutes.APP_STACK.ADD_DISCOUNTS, { paramData: data?.data });
        break;
      case 'Pricing':
        navigate(NavigationRoutes.APP_STACK.SET_YOUR_PRICING, { paramData: data?.data });
        break;
      case 'Disclosure':
        navigate(NavigationRoutes.APP_STACK.PROPERTY_DISCLOSURE, { paramData: data?.data });
        break;
      case 'Documents':
        navigate(NavigationRoutes.APP_STACK.DOCUMENT_UPLOAD, { paramData: data?.data });
        break;
      default:
        console.log(`Section: ${section} not mapped`);
    }
  };

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'task':
        navigate(NavigationRoutes.APP_STACK.ROOT_STACK, {
          screen: NavigationRoutes.APP_STACK.TASK,
          params: { listing_id: data?.data?.listing?.id },
        });
        break;
      case 'channel':
        navigate(NavigationRoutes.APP_STACK.MANAGE_BOOKING);
        break;
      case 'delete':
        Alert.alert(
          i18n.t('app.property_detail.delete_listing'),
          i18n.t('app.property_detail.delete_confirm_message'),
          [
            { text: i18n.t('common.cancel'), style: 'cancel' },
            {
              text: i18n.t('common.remove'),
              style: 'destructive',
              onPress: () =>
                deletePropertyPayload({
                  listing_id: String(listing_id),
                  reason: 'Listing temporarily closed',
                  user_id: user?.id,
                }),
            },
          ],
        );
        break;
      case 'calendar':
        navigate(NavigationRoutes.APP_STACK.LISTING_STACK, {
          listing_id: data?.data?.listing?.id,
        });
        break;
      default:
        console.log(`Action: ${action} selected`);
    }
  };

  const handleEditPhotosVideos = () => {
    navigate(NavigationRoutes.APP_STACK.PROPERTY_TOUR, {
      isEdit: true,
      existingPhotos: propertyData.photos || {},
    });
  };

  // ── User Permission ───────────────────────────────────────────────────────
  const { data: UserPermission = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_USER],
    queryFn: getUser,
  });

  const firstCategoryImages = Object.values(propertyData.photos || {}).flat();

  return {
    propertyData,
    handleEditSection,
    handleMenuAction,
    isLoading,
    refetch,
    data,
    handleEditPhotosVideos,
    UserPermission,
    handleOtaSubmit,
    handleExportSubmit,
    connectedAccounts,
    listingOptions,
    isLoadingChannelList,
    otaControl,
    otaErrors,
    setBottomSheetVisible,
    bottomSheetVisible,
    handleExport,
    isPendingExporting,
    firstCategoryImages,
    listing
  };
}