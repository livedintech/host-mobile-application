// usePropertyDisclosureContainer.ts
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRoute } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingDetailsApi, editListingApi } from '@/services/ createListingService';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/services/api';
import STORAGE_CONST from '@/constants/storage';
import { CreateListingDetailsPayload, CreateListingDetailsResponse } from '@/types/api/createListingTypes';

// ── Schema ────────────────────────────────────────────────────────────────────
export const disclosureSchema = yup.object().shape({
  securityCameras:   yup.string().required('Required'),
  noiseMonitor:      yup.string().required('Required'),
  weaponsOnProperty: yup.string().required('Required'),
});

export type DisclosureFormValues = yup.InferType<typeof disclosureSchema>;

// ── Container ─────────────────────────────────────────────────────────────────
export default function usePropertyDisclosureContainer() {
  const { params }  = useRoute<any>();
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user }    = useAuthStore();

  const listing = params?.paramData?.listing;
  const isEdit  = Boolean(listing?.listing_id); // ✅ consistent

  // ── Form ──────────────────────────────────────────────────────────────────
  const { control, handleSubmit, formState: { errors } } = useForm<DisclosureFormValues>({
    resolver: yupResolver(disclosureSchema),
    defaultValues: {
      securityCameras:   listing?.exterior_security_camera === 1 || listing?.exterior_security_camera === true
                           ? 'Yes'
                           : listing?.exterior_security_camera === 0 || listing?.exterior_security_camera === false
                           ? 'No' : '',
      noiseMonitor:      listing?.noise_decibel_monitor === 1 || listing?.noise_decibel_monitor === true
                           ? 'Yes'
                           : listing?.noise_decibel_monitor === 0 || listing?.noise_decibel_monitor === false
                           ? 'No' : '',
      weaponsOnProperty: listing?.weapon_on_property === 1 || listing?.weapon_on_property === true
                           ? 'Yes'
                           : listing?.weapon_on_property === 0 || listing?.weapon_on_property === false
                           ? 'No' : '',
    },
  });

  // ── Payload builder ───────────────────────────────────────────────────────
  const buildPayload = (
    data: DisclosureFormValues,
    isSaveAndExit: boolean = false,
  ): CreateListingDetailsPayload => ({
    user_id:       String(user?.id),
    channel_id,
    listing_id:    String(listing_id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name:                     propertyDetail?.name || 'New Listing',
      exterior_security_camera: data.securityCameras   === 'Yes', // ✅ swagger key
      noise_decibel_monitor:    data.noiseMonitor       === 'Yes', // ✅ swagger key
      weapon_on_property:       data.weaponsOnProperty  === 'Yes', // ✅ swagger key
    },
  });

  // ── Mutations ─────────────────────────────────────────────────────────────
  const { mutate: createListingDetailsPayload, isPending } =
    useMutation<CreateListingDetailsResponse, Error, CreateListingDetailsPayload>({
      mutationFn: createListingDetailsApi,
      onError: (err: any) =>
        Toast.show({ type: 'error', text1: err.message || 'Something went wrong' }),
    });

  const { mutate: updateListingDisclosure, isPending: isUpdating } =
    useMutation<CreateListingDetailsResponse, Error, CreateListingDetailsPayload>({
      mutationFn: editListingApi,
      onSuccess: ({ message }) => {
        queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
        queryClient.invalidateQueries({
          queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
        });
        Toast.show({ type: 'success', text1: message || 'Updated successfully' });
        goBack();
      },
      onError: (err: any) =>
        Toast.show({ type: 'error', text1: err.message || 'Something went wrong' }),
    });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const onNext = (data: DisclosureFormValues) => {
    updateListing({
      exterior_security_camera: data.securityCameras   === 'Yes',
      noise_decibel_monitor:    data.noiseMonitor       === 'Yes',
      weapon_on_property:       data.weaponsOnProperty  === 'Yes',
    });

    createListingDetailsPayload(buildPayload(data, false), {
      onSuccess: () => navigate(NavigationRoutes.APP_STACK.FINISH_UP_STEP_3),
    });
  };

  const onSaveExit = (data: DisclosureFormValues) => {
    updateListing({
      exterior_security_camera: data.securityCameras   === 'Yes', // ✅ fixed — sab store ho rahi hain
      noise_decibel_monitor:    data.noiseMonitor       === 'Yes',
      weapon_on_property:       data.weaponsOnProperty  === 'Yes',
    });

    if (isEdit) {
      updateListingDisclosure(buildPayload(data, true));
    } else {
      createListingDetailsPayload(buildPayload(data, true), {
        onSuccess: () => navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS),
      });
    }
  };

  return {
    isEdit,
    isLoading: isPending || isUpdating,
    control,
    errors,
    handleSubmit,
    onNext,
    onSaveExit,
  };
}