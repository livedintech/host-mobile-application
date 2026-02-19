import STORAGE_CONST from '@/constants/storage';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { getManageListingDetailById } from '@/services/ createListingService';
import { navigate } from '@/services/navigationService';
import { useAuthStore } from '@/store/useAuthStore';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useQuery } from '@tanstack/react-query';
import { Alert } from 'react-native';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export default function usePropertyDetailContainer() {
  const { user } = useAuthStore();
  const { listing_id } = useCreateListingStore();

  const { data, refetch, isLoading } = useQuery({
    queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
    queryFn: () =>
      getManageListingDetailById({
        listing_id: listing_id!,
        user_id: user?.id!,
      }),
    enabled: Boolean(listing_id),
  });

  const listing = data?.data?.listing;
  const rawDescription = data?.data?.listing?.listing_descriptions?.[0];

  const listing_descriptionParsed =
    typeof rawDescription === 'string'
      ? (() => {
        try {
          return JSON.parse(rawDescription);
        } catch {
          return [];
        }
      })()
      : rawDescription; // If it's already parsed or just a string



  const propertyData = {
    discounts: listing?.discounts ? `${listing.discounts}%` : '',
    title: listing?.name || '',

    address: [
      listing?.street,
      listing?.apt,
      listing?.city?.name,
      listing?.district?.name,
      listing?.state?.name,
      listing?.country_name,
    ]
      .filter(Boolean)
      .join(', '),

    placeInfo: {
      size: listing?.property_area || '',
      bedrooms: listing?.bedrooms ?? '',
      beds: listing?.beds ?? '',
      kitchen: listing?.has_kitchen === 1,
      pool: listing?.has_pool,
      longTermStay: listing?.long_term_stay === 1 ? 'Yes' : 'No',
      minGapNight: listing?.min_gap_night ?? '',
      minNights: listing?.min_nights ?? '',
      maxNights: listing?.max_nights ?? '',
      features: Array.isArray(listing?.amenities)
        ? listing.amenities.join(', ')
        : '',
    },

    houseDetails: {
      description: typeof listing_descriptionParsed === 'string'
        ? listing_descriptionParsed
        : listing_descriptionParsed?.description || '',
      wifiUsername: listing?.wifi_network || '',
      wifiPassword: listing?.wifi_password || '',
      doorLockCode: listing?.door_lock_code,
    },

    bookingDetails: {
      bookingType: listing?.prices?.instant_booking === 1 ? 'Instant' : 'Request',
      guestEligibility: listing?.guest_eligibility === 1,
      checkIn: dayjs(listing?.check_in_time, "HH:mm:ss").format("hh:mm a") || '',
      checkOut: dayjs(listing?.check_out_time, "HH:mm:ss").format("hh:mm a") || '',
    },

    guidelines: {
      arrivalGuide: listing?.arrival_guide || '',
      houseRules: listing?.house_rule || '',
      checkoutInstructions: listing?.cleaning_instructions || '',
    },

    cancelPolicies: {
      airbnb: listing?.airbnb_cancellation_policy || '',
      gathern: listing?.gathern_cancellation_policy || '',
      booking: listing?.bookingCom_cancellation_policy || '',
    },

    aiPricing: {
      pricingMode: listing?.pricing_mode,
      manualOverride: listing?.manual_price_override === 1 ? true : false,
    },

    pricing: {
      weekday: listing?.prices?.weekday
        ? `SAR ${listing.prices.weekday}`
        : '',
      weekend: listing?.prices?.weekend
        ? `SAR ${listing.prices.weekend}`
        : '',
      discount: listing?.discounts ? `${listing.discounts}%` : '',
      tax: listing?.tax ? `${listing.tax}%` : '',
      markup: listing?.markup ? `${listing.markup}%` : '',
      cleaning: listing?.prices?.cleaning_fee
        ? `SAR ${listing.prices.cleaning_fee}`
        : '',
      airbnbDiscount: listing?.prices?.airbnb_discount
        ? `${listing.prices.airbnb_discount}%`
        : '',
      gathernDiscount: listing?.prices?.gathern_discount
        ? `${listing.prices.gathern_discount}%`
        : '',
      bookingDiscount: listing?.prices?.bookingCom_discount
        ? `${listing.prices.bookingCom_discount}%`
        : '',
      extraGuestFee: listing?.prices?.price_per_extra_person
        ? `SAR ${listing.prices.price_per_extra_person}`
        : '',
    },

    disclosure: {
      cameras: listing?.exterior_security_camera === 1,
      noise: listing?.noise_decibel_monitor === 1,
      weapons: listing?.weapon_on_property === 1,
    },

    photos: listing?.photos || {},
    documents: listing?.documents || {},
  };

  const handleEditSection = (section: string) => {
    switch (section) {
      case 'Address':
        navigate(NavigationRoutes.APP_STACK.CONFIRM_ADDRESS, { paramData: data?.data });
        break;
      case 'PlaceInfo':
        navigate(NavigationRoutes.APP_STACK.ABOUT_THE_PLACE, { paramData: data?.data });
        break;
      case 'HouseDetails':
        navigate(NavigationRoutes.APP_STACK.DESCRIBE_YOUR_HOUSE, { paramData: data?.data });
        break;
      case 'BookingDetails':
        navigate(NavigationRoutes.APP_STACK.CREATE_EDIT_BOOKING_DETAIL, { paramData: data?.data });
        break;
      case 'Guidelines':
        navigate(NavigationRoutes.APP_STACK.CREATE_EDIT_HOUSE_GUIDELINES, { paramData: data?.data });
        break;
      case 'CancelPolicies':
        navigate(NavigationRoutes.APP_STACK.CREATE_EDIT_CANCEL_POLICIES, { paramData: data?.data });
        break;
      case 'AIPricing':
        navigate(NavigationRoutes.APP_STACK.CREATE_EDIT_AI_DYNAMIC_PRICING, { paramData: data?.data });
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
      case 'channel':
        navigate(NavigationRoutes.APP_STACK.CONNECTED_OTA);
        break;
      case 'delete':
        Alert.alert('Delete Property', 'Are you sure you want to delete this listing?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => console.log('Deleted') },
        ]);
        break;
      default:
        console.log(`Action: ${action} selected`);
        break;
    }
  };

  const handleEditPhotosVideos = (category: string) => {
    navigate(NavigationRoutes.APP_STACK.OTHER_VIDEOS, {
      isEdit: true,
      existingPhotos: data?.data?.listing?.photos?.[category] || [],
      category: category,
    });
  };

  return {
    propertyData,
    handleEditSection,
    handleMenuAction,
    isLoading,
    refetch,
    data,
    handleEditPhotosVideos,
  };
}