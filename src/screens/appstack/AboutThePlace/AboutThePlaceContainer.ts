import { useMemo } from 'react'; // useMemo import karein
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRoute } from '@react-navigation/native';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingDetailsApi } from '@/services/ createListingService';
import { useAuthStore } from '@/store/useAuthStore';
import * as yup from 'yup';

export const stepTwoSchema = yup.object().shape({
  size_sqm: yup.number().typeError('Must be a number').required('Required'),
  guest_limit: yup.string().required('Required'),
  bedrooms: yup.string().required('Required'),
  beds: yup.string().required('Required'),
  bathrooms: yup.string().required('Required'),
});

export default function useAboutThePlaceContainer() {
  const { user } = useAuthStore();
  const { listing_id, channel_id, listing: storeListing, updateListing } = useCreateListingStore();
  const { params } = useRoute<any>();
  const listing = params?.paramData?.listing;

  // FIX: useMemo ka istemal taake dropdown loop na kare
  const numberOptions = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      label: `${i + 1}`,
      value: `${i + 1}`,
    }));
  }, []); // Khali array ka matlab hai ye sirf ek baar banega

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(stepTwoSchema),
    defaultValues: {
  size_sqm: listing?.size_sqm || storeListing?.size_sqm || '',
      guest_limit: listing?.guest_limit ? String(listing.guest_limit) : storeListing?.guest_limit ? String(storeListing.guest_limit) : '',
      bedrooms: listing?.bedrooms ? String(listing.bedrooms) : storeListing?.bedrooms ? String(storeListing.bedrooms) : '',
      beds: listing?.beds ? String(listing.beds) : storeListing?.beds ? String(storeListing.beds) : '',
      bathrooms: listing?.bathrooms ? String(listing.bathrooms) : storeListing?.bathrooms ? String(storeListing.bathrooms) : '',
    },
  });

  const { mutate: createListingDetails, isPending: isCreating } = useMutation({
    mutationFn: createListingDetailsApi,
  });

  const buildPayload = (data: any) => ({
    user_id: String(user?.id),
    channel_id: String(channel_id),
    listing_id: String(listing_id),
    save_and_exit: 0,
    listing: {
     name: storeListing?.name || listing?.name || 'New Listing',
      size_sqm: Number(data.size_sqm),
      guest_limit: Number(data.guest_limit),
      bedrooms: Number(data.bedrooms),
      beds: Number(data.beds),
      bathrooms: Number(data.bathrooms),
    },
  });

  const onNext = (data: any) => {
    const payload = buildPayload(data);
    updateListing(payload.listing);
    createListingDetails(payload, {
      onSuccess: () => navigate(NavigationRoutes.APP_STACK.AMENITIES),
      onError: (err: any) => Toast.show({ type: 'error', text1: err.message }),
    });
  };

  return { control, errors, numberOptions, handleSubmit, onNext, isLoading: isCreating };
}