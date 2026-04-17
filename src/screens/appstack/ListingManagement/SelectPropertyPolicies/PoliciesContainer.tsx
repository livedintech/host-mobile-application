import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { useRoute } from '@react-navigation/native';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingDetailsApi, editListingApi } from '@/services/ createListingService';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';

// Schema as per your validation pattern
const policiesSchema = yup.object().shape({
  start_time: yup.string().optional(),
  end_time: yup.string().optional(),
});

export type PoliciesFormValues = yup.InferType<typeof policiesSchema>;

export default function usePoliciesContainer() {
  const { params } = useRoute() as any;

  // As per your exact requirement: store variables
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user } = useAuthStore();

  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.id);

  // States for selection and modal
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>(listing?.policies || []);
  const [showTimeModal, setShowTimeModal] = useState(false);

  const isPolicySelected = selectedPolicies.length > 0;

  const { control, handleSubmit, formState: { errors } } = useForm<PoliciesFormValues>({
    resolver: yupResolver(policiesSchema) as any,
    defaultValues: {
      start_time: listing?.quiet_hours_start ?? '',
      end_time: listing?.quiet_hours_end ?? '',
    },
  });

  // ---- Mutations ----
  const { mutate: createListingDetailsPayload, isPending: isCreating } = useMutation({
    mutationFn: createListingDetailsApi,
    onError: error => {
      Toast.show({ type: 'error', text1: error.message || 'Something went wrong' });
    },
  });

  const { mutate: updateListingDetails, isPending: isUpdating } = useMutation({
    mutationFn: editListingApi,
    onSuccess: ({ message }: any) => {
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

  // ---- Payload builder (Strict as per your requirement) ----
  const buildPayload = (data: PoliciesFormValues, isSaveAndExit: boolean = false) => ({
    channel_id,
    listing_id: String(listing_id),
    user_id: String(user?.id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name: propertyDetail?.name || listing?.name || 'New Listing',
      policies: selectedPolicies,
      quiet_hours_start: selectedPolicies.includes('quiet_hours') ? data.start_time : null,
      quiet_hours_end: selectedPolicies.includes('quiet_hours') ? data.end_time : null,
    },
  });

  // ---- Handlers ----
  const onNext = (data: PoliciesFormValues) => {
    // 1. Store Update
    updateListing({
      // @ts-ignore (If policies not in initial store type)
      policies: selectedPolicies,
      check_in_time: data.start_time,
      check_out_time: data.end_time,
    });

    // 2. API Hit
    createListingDetailsPayload(buildPayload(data, false) as any, {
      onSuccess: () => {
        navigate(NavigationRoutes.APP_STACK.PROPERTY_DISCLOSURE); 
      },
    });
  };

  const onSaveExit = (data: PoliciesFormValues) => {
    updateListing({
      // @ts-ignore
      policies: selectedPolicies,
    });

    const payload = buildPayload(data, true);

    if (isEdit) {
      updateListingDetails(payload as any);
    } else {
      createListingDetailsPayload(payload as any, {
        onSuccess: () => {
          navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS);
        },
      });
    }
  };

  const togglePolicy = (id: string) => {
    if (id === 'quiet_hours') {
      if (selectedPolicies.includes(id)) {
        setSelectedPolicies(prev => prev.filter(p => p !== id));
      } else {
        setShowTimeModal(true);
      }
      return;
    }

    // normal policies
    setSelectedPolicies(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  return {
    control,
    errors,
    selectedPolicies,
    togglePolicy,
    showTimeModal,
    setShowTimeModal,
    handleSubmit,
    onNext,
    onSaveExit,
    isLoading: isCreating || isUpdating,
    setSelectedPolicies,
    isEdit,
    isPolicySelected
  };
}