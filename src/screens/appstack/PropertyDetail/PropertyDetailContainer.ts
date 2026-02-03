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
  console.log('data...', data?.data?.listing);



  const listing = data?.data?.listing;
  const photos = data?.data?.listing?.photos || [];
  const documents = data?.data?.listing?.documents || [];

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
      size: '',
      bedrooms: listing?.bedrooms ?? '',
      beds: listing?.beds ?? '',
      kitchen: '',
      pool: '',
      longTerm: '',
      minStay: listing?.min_nights ?? '',
      features: Array.isArray(listing?.amenities)
        ? listing.amenities.join(', ')
        : '',

    },
    houseDetails: {
      description: '',
      bookingType: listing?.instant_booking ? 'Instant Booking' : 'Request to Book',
      guestEligibility: '',
      checkIn: listing?.check_in_time || '',
      checkOut: listing?.check_out_time || '',
    },
    pricing: {
      weekday: listing?.prices?.weekday
        ? `SAR ${listing.prices.weekday}`
        : '',
      weekend: listing?.prices?.weekend
        ? `SAR ${listing.prices.weekend}`
        : '',
      discount: '',
      tax: '',
      markup: '',
      cleaning: listing?.prices?.cleaning_fee
        ? `SAR ${listing.prices.cleaning_fee}`
        : '',
    },
    disclosure: {
      cameras: listing?.disclosures?.cameras ?? '',
      noiseMonitor: listing?.disclosures?.noise_monitor ?? '',
      weapons: listing?.disclosures?.weapons ?? '',
    },

    photos,
    documents,
  };

  const handleEditSection = (section: string) => {

    if (section === 'Address') {
      navigate(NavigationRoutes.APP_STACK.CONFIRM_ADDRESS, { paramData: data?.data })
    }
    if (section === 'PlaceInfo') {
      navigate(NavigationRoutes.APP_STACK.ABOUT_THE_PLACE, { paramData: data?.data })
    }
    if (section === 'HouseDetails') {
      navigate(NavigationRoutes.APP_STACK.DESCRIBE_YOUR_HOUSE, { paramData: data?.data })
    }
    if (section === 'Pricing') {
      navigate(NavigationRoutes.APP_STACK.SET_YOUR_PRICING, { paramData: data?.data })
    }
    if (section === 'Disclosure') {
      navigate(NavigationRoutes.APP_STACK.PROPERTY_DISCLOSURE, { paramData: data?.data })
    }
    if (section === 'Interior') {
      navigate(NavigationRoutes.APP_STACK.INTERIOR_PHOTOS_VIDEOS, {
        isEdit: true,
        existingPhotos: data?.data?.listing?.photos?.Interior || [],
      });
    }

    if (section === 'Exterior') {
      navigate(NavigationRoutes.APP_STACK.EXTERIOR_PHOTOS_VIDEOS, { paramData: data?.data })
    }
    if (section === 'Bathroom') {
      navigate(NavigationRoutes.APP_STACK.BATHROOM_PHOTOS_VIDEOS, { paramData: data?.data })
    }
    if (section === 'Documents') {
      navigate(NavigationRoutes.APP_STACK.DOCUMENT_UPLOAD, { paramData: data?.data })
    }
  };

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'channel':
        navigate(NavigationRoutes.APP_STACK.CONNECTED_OTA)
        break;
      case 'delete':
        Alert.alert("Delete Property", "Are you sure you want to delete this listing?", [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: () => console.log("Deleted") }
        ]);
        break;
      default:
        console.log(`Action: ${action} selected`);
        break;
    }
  };
  const goToConnectedOTA = () => {
    navigate(NavigationRoutes.APP_STACK.CONNECTED_OTA)
  }

  return {
    propertyData,
    handleEditSection,
    handleMenuAction,
    goToConnectedOTA,
    isLoading,
    refetch,
    data
  };
}