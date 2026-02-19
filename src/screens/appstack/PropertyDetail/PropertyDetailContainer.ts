import STORAGE_CONST from '@/constants/storage';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { getManageListingDetailById } from '@/services/ createListingService';
import { navigate } from '@/services/navigationService';
import { useAuthStore } from '@/store/useAuthStore';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useQuery } from '@tanstack/react-query';
import { Alert } from 'react-native';

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
      : [];

  const propertyData = {
    title: listing?.name || '',

    address: [
      listing?.street,
      listing?.apt,
      listing?.city,
      listing?.state,
      listing?.country_code,
    ]
      .filter(Boolean)
      .join(', '),

    placeInfo: {
      size: listing?.size_sqm || '',
      bedrooms: listing?.bedrooms ?? '',
      beds: listing?.beds ?? '',
      kitchen: listing?.kitchen,
      pool: listing?.pool,
      longTermStay: listing?.long_term_stay,
      minGapNight: listing?.min_gap_night ?? '',
      minNights: listing?.min_nights ?? '',
      maxNights: listing?.max_nights ?? '',
      features: Array.isArray(listing?.amenities)
        ? listing.amenities.join(', ')
        : '',
    },

    houseDetails: {
      description: listing_descriptionParsed?.[0]?.description || '',
      wifiUsername: listing?.wifi_username || '',
      wifiPassword: listing?.wifi_password || '',
      doorLockCode: listing?.door_lock_code || '',
    },

    bookingDetails: {
      bookingType: listing?.booking_type || '',
      guestEligibility: listing?.guest_eligibility,
      checkIn: listing?.check_in_time || '',
      checkOut: listing?.check_out_time || '',
    },

    guidelines: {
      arrivalGuide: listing?.arrival_guide || '',
      houseRules: listing?.house_rules || '',
      checkoutInstructions: listing?.checkout_instructions || '',
    },

    cancelPolicies: {
      airbnb: listing?.cancel_policy_airbnb || '',
      gathern: listing?.cancel_policy_gathern || '',
      booking: listing?.cancel_policy_booking || '',
    },

    aiPricing: {
      pricingMode: listing?.pricing_mode || '',
      manualOverride: listing?.manual_price_override,
    },

    pricing: {
      weekday: listing?.weekday_base_price
        ? `SAR ${listing.weekday_base_price}`
        : '',
      weekend: listing?.weekend_base_price
        ? `SAR ${listing.weekend_base_price}`
        : '',
      discount: listing?.discount || '',
      tax: listing?.tax_vat || '',
      markup: listing?.markup_price || '',
      cleaning: listing?.cleaning_fee || '',
      airbnbDiscount: listing?.airbnb_discount || '',
      gathernDiscount: listing?.gathern_discount || '',
      bookingDiscount: listing?.booking_discount || '',
      extraGuestFee: listing?.extra_guest_fee
        ? `SAR ${listing.extra_guest_fee}`
        : '',
    },

    disclosure: {
      cameras: listing?.disclosures?.cameras,
      noise: listing?.disclosures?.noise,
      weapons: listing?.disclosures?.weapons,
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