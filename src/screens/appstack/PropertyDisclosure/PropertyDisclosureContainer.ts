import i18n from '@/locales/i18n/i18n';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRoute } from '@react-navigation/native';
import { useMutation, useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useState } from 'react';

import { goBack, navigate, resetToRoutes } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingDetailsApi, editListingApi, createListingExportApi } from '@/services/ createListingService';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/services/api';
import STORAGE_CONST from '@/constants/storage';
import { CreateListingDetailsPayload, CreateListingDetailsResponse, CreateListingExportPayloadType } from '@/types/api/createListingTypes';
import { getChannelsUserbyId } from '@/services/bookingManagementApi';

const otaAccountSchema = yup.object({
  ota_account: yup.string().required(i18n.t('app.validation.ota_required')),
});
type OtaAccountFormValues = { ota_account: string };

export const disclosureSchema = yup.object().shape({
  securityCameras:   yup.string().required(i18n.t('app.validation.required')),
  noiseMonitor:      yup.string().required(i18n.t('app.validation.required')),
  weaponsOnProperty: yup.string().required(i18n.t('app.validation.required')),
});

export type DisclosureFormValues = yup.InferType<typeof disclosureSchema>;

export default function usePropertyDisclosureContainer() {
  const { params }  = useRoute<any>();
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user }    = useAuthStore();

  const listing = params?.paramData?.listing;
  const isEdit  = Boolean(listing?.listing_id);

  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  // ── OTA Form ──────────────────────────────────────────────────────────────
  const {
    control: otaControl,
    handleSubmit: handleOtaSubmit,
    formState: { errors: otaErrors },
    watch: otaWatch,
  } = useForm<OtaAccountFormValues>({
    resolver: yupResolver(otaAccountSchema) as any,
    defaultValues: { ota_account: '' },
  });

  const ota_Account = otaWatch('ota_account');

  // ── OTA Accounts ──────────────────────────────────────────────────────────
  const { data: response } = useQuery({
    queryKey: [STORAGE_CONST.GET_CHANNELS_USER, user?.id],
    queryFn:  () => getChannelsUserbyId({ user_id: Number(user?.id) }),
    enabled:  !!user?.id,
  });

  const connectedAccounts = response?.data || [];
  const listingOptions = connectedAccounts
    .filter((item: any) => item.connection_type === 'Airbnb')
    .map((item: any) => ({ label: `Airbnb - ${item?.id} - ${item?.channel_name}`, value: item.ch_channel_id }));

  // ── Export Mutation ───────────────────────────────────────────────────────
  const { mutate: createListingExportPayload, isPending: isPendingExporting } =
    useMutation<CreateListingDetailsResponse, Error, CreateListingExportPayloadType>({
      mutationFn: createListingExportApi,
      onSuccess: ({ message }: any) => {
        setBottomSheetVisible(false);
        queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
        Toast.show({ type: 'success', text1: message || i18n.t('common.toast.exported') });
      },
      onError: (err: any) =>
        Toast.show({ type: 'error', text1: err.message || i18n.t('common.toast.something_went_wrong') }),
    });

  const handleExport = () => setBottomSheetVisible(true);

  const handleExportSubmit = (data: OtaAccountFormValues) => {
    createListingExportPayload({
      channel_id: ota_Account,
      listing_id: String(listing_id),
    });
  };

  // ── Main Form ─────────────────────────────────────────────────────────────
  const { control, handleSubmit, formState: { errors } } = useForm<DisclosureFormValues>({
    resolver: yupResolver(disclosureSchema),
    defaultValues: {
      securityCameras:   listing?.exterior_security_camera === 1 || listing?.exterior_security_camera === true ? 'Yes'
                       : listing?.exterior_security_camera === 0 || listing?.exterior_security_camera === false ? 'No' : '',
      noiseMonitor:      listing?.noise_decibel_monitor === 1 || listing?.noise_decibel_monitor === true ? 'Yes'
                       : listing?.noise_decibel_monitor === 0 || listing?.noise_decibel_monitor === false ? 'No' : '',
      weaponsOnProperty: listing?.weapon_on_property === 1 || listing?.weapon_on_property === true ? 'Yes'
                       : listing?.weapon_on_property === 0 || listing?.weapon_on_property === false ? 'No' : '',
    },
  });

  const buildPayload = (data: DisclosureFormValues, isSaveAndExit: boolean = false): CreateListingDetailsPayload => ({
    user_id:       String(user?.id),
    channel_id,
    listing_id:    String(listing_id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name:                     propertyDetail?.name || 'New Listing',
      exterior_security_camera: data.securityCameras   === 'Yes',
      noise_decibel_monitor:    data.noiseMonitor       === 'Yes',
      weapon_on_property:       data.weaponsOnProperty  === 'Yes',
    },
  });

  const { mutate: createListingDetailsPayload, isPending } =
    useMutation<CreateListingDetailsResponse, Error, CreateListingDetailsPayload>({
      mutationFn: createListingDetailsApi,
      onError: (err: any) =>
        Toast.show({ type: 'error', text1: err.message || i18n.t('common.toast.something_went_wrong') }),
    });

  const { mutate: updateListingDisclosure, isPending: isUpdating } =
    useMutation<CreateListingDetailsResponse, Error, CreateListingDetailsPayload>({
      mutationFn: editListingApi,
      onSuccess: ({ message }) => {
        queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
        queryClient.invalidateQueries({
          queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
        });
        Toast.show({ type: 'success', text1: message || i18n.t('common.toast.updated') });
        goBack();
      },
      onError: (err: any) =>
        Toast.show({ type: 'error', text1: err.message || i18n.t('common.toast.something_went_wrong') }),
    });

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
      exterior_security_camera: data.securityCameras   === 'Yes',
      noise_decibel_monitor:    data.noiseMonitor       === 'Yes',
      weapon_on_property:       data.weaponsOnProperty  === 'Yes',
    });
    if (isEdit) {
      updateListingDisclosure(buildPayload(data, true));
    } else {
      createListingDetailsPayload(buildPayload(data, true), {
        onSuccess: () => resetToRoutes([
          { name: NavigationRoutes.APP_STACK.ROOT_STACK },
          { name: NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS },
        ] as any),
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
    // ✅ Export
    handleExport,
    handleExportSubmit,
    bottomSheetVisible,
    setBottomSheetVisible,
    otaControl,
    otaErrors,
    handleOtaSubmit,
    listingOptions,
    isPendingExporting,
  };
}