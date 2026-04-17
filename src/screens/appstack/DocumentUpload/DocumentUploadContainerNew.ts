import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DocumentFormValues, documentUploadSchema } from '@/validation/auth/createListingSchemas';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useMutation, useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRoute } from '@react-navigation/native';
import * as DocumentPicker from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';
import * as yup from 'yup';
import { createListingExportApi } from '@/services/ createListingService';
import { BASE_URL_DEV } from '@env';
import { getChannelsUserbyId } from '@/services/bookingManagementApi';

const BASE_URL = BASE_URL_DEV;

const otaAccountSchema = yup.object({
  ota_account: yup.string().required('Please select an OTA account'),
});

type OtaAccountFormValues = { ota_account: string };

export default function useCreateEditListingDocumentUploadContainer() {
  const [isLoading, setIsLoading] = useState(false);
  const { params } = useRoute() as any;
  const { listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user, token } = useAuthStore();
  
  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.id);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  // --- Fetch OTA Accounts ---
  const { data: response, isLoading: isLoadingChannelList } = useQuery({
    queryKey: [STORAGE_CONST.GET_CHANNELS_USER, user?.id],
    queryFn: () => getChannelsUserbyId({ user_id: Number(user?.id) }),
    enabled: !!user?.id,
  });

  const connectedAccounts = response?.data || [];

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<DocumentFormValues>({
    resolver: yupResolver(documentUploadSchema) as any,
    defaultValues: {
      propertyOwnership: null,
      authorityLicense: null,
      nationalId: null,
    },
  });

  const { control: otaControl, handleSubmit: handleOtaSubmit, formState: { errors: otaErrors } } = useForm<OtaAccountFormValues>({
    resolver: yupResolver(otaAccountSchema) as any,
  });

  const propertyOwnershipDoc = watch('propertyOwnership');
  const authorityLicenseDoc = watch('authorityLicense');
  const nationalIdDoc = watch('nationalId');

  // --- Document Picker ---
  const pickDocument = async (fieldName: any) => {
    try {
      const result = await DocumentPicker.pick({ type: ['application/pdf'] });
      if (!result?.[0]) return;
      const file = result[0];
      if (file.size && file.size > 10 * 1024 * 1024) {
        return Toast.show({ type: 'error', text1: 'File size must be ≤ 10 MB' });
      }
      const base64 = await RNFS.readFile(file.uri, 'base64');
      setValue(fieldName, { uri: file.uri, name: file.name, type: file.type, base64 } as any);
    } catch (err) {
      console.log(err);
    }
  };

  // --- Export Mutation ---
  const { mutate: exportListing, isPending: isExporting } = useMutation({
    mutationFn: createListingExportApi,
    onSuccess: () => {
      setBottomSheetVisible(false);
      Toast.show({ type: 'success', text1: 'Listing exported successfully' });
      navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS);
    },
    onError: (err: any) => Toast.show({ type: 'error', text1: err.message }),
  });

  const buildPayload = (data: DocumentFormValues) => {
    const documents = [];
    if (data.propertyOwnership?.base64) documents.push({ url: `data:application/pdf;base64,${data.propertyOwnership.base64}`, type: 'ownership', file_name: data.propertyOwnership.name });
    if (data.authorityLicense?.base64) documents.push({ url: `data:application/pdf;base64,${data.authorityLicense.base64}`, type: 'authority_license', file_name: data.authorityLicense.name });
    if (data.nationalId?.base64) documents.push({ url: `data:application/pdf;base64,${data.nationalId.base64}`, type: 'national_id', file_name: data.nationalId.name });

    return {
      user_id: Number(user?.id),
      channel_id,
      listing_id: String(listing_id || listing?.id),
      save_and_exit: 0,
      documents,
      listing: { name: propertyDetail?.name || listing?.name || 'New Listing' },
    };
  };

  const onSaveExit = async (data: DocumentFormValues) => {
    const payload = buildPayload(data);
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}api/v2/channelmanagement/create-listing/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
        if (isEdit) {
          Toast.show({ type: 'success', text1: 'Updated successfully' });
          goBack();
        } else {
          setBottomSheetVisible(true);
        }
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportSubmit = (data: OtaAccountFormValues) => {
    exportListing({ channel_id: data.ota_account, listing_id: String(listing_id || listing?.id) });
  };

  const listingOptions = connectedAccounts?.map((item: any) => ({
    label: item.connection_type,
    value: item.ch_channel_id,
  })) || [];

  return {
    control, errors, handleSubmit, onSaveExit, isLoading,
    propertyOwnershipDoc, authorityLicenseDoc, nationalIdDoc,
    pickDocument, removeDocument: (f: any) => setValue(f, null),
    bottomSheetVisible, setBottomSheetVisible,
    otaControl, otaErrors, handleOtaSubmit, handleExportSubmit,
    listingOptions, isLoadingChannelList, isCreating: isExporting
  };
}