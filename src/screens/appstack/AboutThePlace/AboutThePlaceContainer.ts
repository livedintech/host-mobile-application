import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRoute } from '@react-navigation/native';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingDetailsApi, editListingApi, createListingExportApi } from '@/services/ createListingService';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/services/api';
import STORAGE_CONST from '@/constants/storage';
import * as yup from 'yup';
import { getChannelsUserbyId } from '@/services/bookingManagementApi';
import { CreateListingDetailsResponse, CreateListingExportPayloadType } from '@/types/api/createListingTypes';

const otaAccountSchema = yup.object({
  ota_account: yup.string().required('Please select an OTA account'),
});
type OtaAccountFormValues = { ota_account: string };

export const aboutThePlaceSchema = yup.object().shape({
  size_sqm:    yup.string().typeError('Property size must be a number').required('Property size is required'),
  guest_limit: yup.string().required('Number of guests is required'),
  bedrooms:    yup.string().required('Number of bedrooms is required'),
  beds:        yup.string().required('Number of beds is required'),
  bathrooms:   yup.string().required('Number of bathrooms is required'),
});

export type AboutThePlaceFormValues = yup.InferType<typeof aboutThePlaceSchema>;

export default function useAboutThePlaceContainer() {
  const { user }     = useAuthStore();
  const { listing_id, channel_id, listing: propertyDetail, updateListing } = useCreateListingStore();
  const { params }   = useRoute<any>();

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
    .map((item: any) => ({ label: 'Airbnb', value: item.ch_channel_id }));

  // ── Export Mutation ───────────────────────────────────────────────────────
  const { mutate: createListingExportPayload, isPending: isPendingExporting } =
    useMutation<CreateListingDetailsResponse, Error, CreateListingExportPayloadType>({
      mutationFn: createListingExportApi,
      onSuccess: ({ message }: any) => {
        setBottomSheetVisible(false);
        queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
        Toast.show({ type: 'success', text1: message || 'Exported successfully' });
      },
      onError: (err: any) =>
        Toast.show({ type: 'error', text1: err.message || 'Something went wrong' }),
    });

  const handleExport = () => setBottomSheetVisible(true);

  const handleExportSubmit = (data: OtaAccountFormValues) => {
    createListingExportPayload({
      channel_id: ota_Account,
      listing_id: String(listing_id),
    });
  };

  // ── Dropdown options ──────────────────────────────────────────────────────
  const numberOptions = useMemo(
    () => Array.from({ length: 10 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` })),
    [],
  );

  // ── Main Form ─────────────────────────────────────────────────────────────
  const { control, handleSubmit, formState: { errors } } = useForm<AboutThePlaceFormValues>({
    resolver: yupResolver(aboutThePlaceSchema),
    defaultValues: {
      size_sqm:    isEdit ? (String(listing?.property_area) ?? '') : '',
      guest_limit: isEdit ? (listing?.guest_limit ? String(listing.guest_limit) : '') : '',
      bedrooms:    isEdit ? (listing?.bedrooms    ? String(listing.bedrooms)    : '') : '',
      beds:        isEdit ? (listing?.beds        ? String(listing.beds)        : '') : '',
      bathrooms:   isEdit ? (listing?.bathrooms   ? String(listing.bathrooms)   : '') : '',
    },
  });

  const buildPayload = (data: AboutThePlaceFormValues, isSaveAndExit: boolean = false) => ({
    user_id:       String(user?.id),
    channel_id,
    listing_id:    String(listing_id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name:          propertyDetail?.name || 'New Listing',
      property_area: Number(data.size_sqm),
      guest_limit:   Number(data.guest_limit),
      bedrooms:      Number(data.bedrooms),
      beds:          Number(data.beds),
      bathrooms:     Number(data.bathrooms),
    },
  });

  const { mutate: createListingDetails, isPending: isCreating } = useMutation({
    mutationFn: createListingDetailsApi,
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err.message || 'Something went wrong' }),
  });

  const { mutate: updateListingDetails, isPending: isUpdating } = useMutation({
    mutationFn: editListingApi,
    onSuccess: ({ message }: any) => {
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

  const onNext = (data: AboutThePlaceFormValues) => {
    updateListing({
      property_area: Number(data.size_sqm),
      guest_limit:   Number(data.guest_limit),
      bedrooms:      Number(data.bedrooms),
      beds:          Number(data.beds),
      bathrooms:     Number(data.bathrooms),
    });
    createListingDetails(buildPayload(data, false), {
      onSuccess: () => navigate(NavigationRoutes.APP_STACK.AMENITIES),
    });
  };

  const onSaveExit = (data: AboutThePlaceFormValues) => {
    updateListing({
      property_area: Number(data.size_sqm),
      guest_limit:   Number(data.guest_limit),
      bedrooms:      Number(data.bedrooms),
      beds:          Number(data.beds),
      bathrooms:     Number(data.bathrooms),
    });
    if (isEdit) {
      updateListingDetails(buildPayload(data, true));
    } else {
      createListingDetails(buildPayload(data, true), {
        onSuccess: () => navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS),
      });
    }
  };

  return {
    control,
    errors,
    numberOptions,
    handleSubmit,
    onNext,
    onSaveExit,
    isLoading: isCreating || isUpdating,
    isEdit,
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