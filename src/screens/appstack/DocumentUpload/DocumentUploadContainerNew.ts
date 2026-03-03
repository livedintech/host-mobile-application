import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DocumentFormValues, documentUploadSchema } from '@/validation/auth/createListingSchemas';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CreateListingDetailsResponse, CreateListingDetailsPayload, CreateListingExportPayloadType } from '@/types/api/createListingTypes';
import Toast from 'react-native-toast-message';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRoute } from '@react-navigation/native';
import * as DocumentPicker from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';
import * as yup from 'yup';
import { createListingExportApi, editListingApi } from '@/services/ createListingService';
import { BASE_URL_DEV } from '@env';
import { getChannelsUserbyId } from '@/services/bookingManagementApi';

const BASE_URL = BASE_URL_DEV;

// Schema for OTA Account selection
const otaAccountSchema = yup.object({
  ota_account: yup.string().required('Please select an OTA account'),
});

type OtaAccountFormValues = {
  ota_account: string;
};

export default function useCreateEditListingDocumentUploadContainer() {
  const [isLoading, setIsLoading] = useState(false);
  const { params } = useRoute();
  const { listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user, token } = useAuthStore();
  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.id);

  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const { data: response, isLoading: isLoadingChannelList, refetch } = useQuery({
    queryKey: [STORAGE_CONST.GET_CHANNELS_USER, user?.id],
    queryFn: () =>
      getChannelsUserbyId({
        user_id: Number(user?.id)
      }),
    enabled: !!user?.id,
  });

  const connectedAccounts = response?.data || [];


  // OTA account options (can be fetched from API)


  // --- Map existing documents for edit mode ---
  const mapExistingDocuments = (): DocumentFormValues => ({
    propertyOwnership: listing?.documents?.ownership?.[0]
      ? {
        name: listing.documents.ownership[0].file_name,
        uri: listing.documents.ownership[0].path,
        type: 'application/pdf',
      }
      : null,
    authorityLicense: listing?.documents?.authority_license?.[0]
      ? {
        name: listing.documents.authority_license[0].file_name,
        uri: listing.documents.authority_license[0].path,
        type: 'application/pdf',
      }
      : null,
    nationalId: listing?.documents?.national_id?.[0]
      ? {
        name: listing.documents.national_id[0].file_name,
        uri: listing.documents.national_id[0].path,
        type: 'application/pdf',
      }
      : null,
  });

  // Main form for documents
  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<DocumentFormValues>({
    resolver: yupResolver(documentUploadSchema) as any,
    defaultValues: mapExistingDocuments(),
  });

  // Separate form for OTA account selection
  const {
    control: otaControl,
    handleSubmit: handleOtaSubmit,
    formState: { errors: otaErrors },
    watch: newWatch
  } = useForm<OtaAccountFormValues>({
    resolver: yupResolver(otaAccountSchema) as any,
    defaultValues: {
      ota_account: '',
    },
  });

  const propertyOwnershipDoc = watch('propertyOwnership');
  const authorityLicenseDoc = watch('authorityLicense');
  const nationalIdDoc = watch('nationalId');
  const ota_Account = newWatch('ota_account')


  // ---- Document Picker ----
  const pickDocument = async (fieldName: 'propertyOwnership' | 'authorityLicense' | 'nationalId') => {
    try {
      const result = await DocumentPicker.pick({
        mode: 'open',
        type: ['application/pdf'],
      });

      if (!result || result.length === 0) return;

      const file = result[0];

      // Check file size (10 MB limit)
      if (file.size && file.size > 10 * 1024 * 1024) {
        Toast.show({ type: 'error', text1: 'File size must be ≤ 10 MB' });
        return;
      }

      // Convert to base64
      const base64 = await RNFS.readFile(file.uri, 'base64');

      setValue(fieldName, {
        uri: file.uri,
        name: file.name || 'document.pdf',
        type: file.type || 'application/pdf',
        size: file.size || 0,
        base64,
      } as any);

      Toast.show({ type: 'success', text1: 'Document uploaded successfully' });
    } catch (err: any) {
      if (err?.message !== 'User canceled document picker') {
        Toast.show({ type: 'error', text1: 'Failed to pick document' });
      }
    }
  };

  // ---- Remove Document ----
  const removeDocument = (fieldName: 'propertyOwnership' | 'authorityLicense' | 'nationalId') => {
    setValue(fieldName, null);
  };

  // ---- Mutations ----
  const { mutate: createListingExportPayload, isPending: isCreating } =
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
        Toast.show({ type: 'success', text1: message || 'Updated successfully' });
        navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS);
      },
      onError: error => {
        Toast.show({ type: 'error', text1: error.message || 'Something went wrong' });
      },
    });

  const { mutate: updateListingDetails, isPending: isUpdating } = useMutation({
    mutationFn: editListingApi,
    onSuccess: ({ message }) => {
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

  // ---- Handlers ----
  const handleExport = () => {
    setBottomSheetVisible(true);
  };

  const handleExportSubmit = (data: OtaAccountFormValues) => {
    // Toast.show({ type: 'success', text1: `Exporting listing to ${data.ota_account}...` });
    // setBottomSheetVisible(false);
    createListingExportPayload({
      channel_id: ota_Account,
      listing_id: String(listing_id),
    })
  };

  const buildPayload = (data: DocumentFormValues, isSaveAndExit: number): any => {
    const documents: Array<{ url: string; type: string; file_name: string }> = [];

    // Swagger types: ownership, authority_license, national_id
    if (data.propertyOwnership?.base64) {
      documents.push({
        url: `data:application/pdf;${data.propertyOwnership.base64}`,
        type: 'ownership',
        file_name: data.propertyOwnership.name,
      });
    }

    if (data.authorityLicense?.base64) {
      documents.push({
        url: `data:application/pdf;${data.authorityLicense.base64}`,
        type: 'authority_license',
        file_name: data.authorityLicense.name,
      });
    }

    if (data.nationalId?.base64) {
      documents.push({
        url: `data:application/pdf;${data.nationalId.base64}`,
        type: 'national_id',
        file_name: data.nationalId.name,
      });
    }

    return {
      user_id: Number(user?.id),
      channel_id,
      listing_id: String(listing_id),
      // save_and_exit: isSaveAndExit ? 1 : 0,
      save_and_exit: 0,
      documents,
      listing: {
        name: propertyDetail?.name || 'New Listing',
      },
    };
  };

  // const onSaveExit = (data: DocumentFormValues) => {
  //   if (!data.propertyOwnership && !data.authorityLicense && !data.nationalId) {
  //     Toast.show({ type: 'error', text1: 'Please upload at least one document' });
  //     return;
  //   }

  //   const payload = buildPayload(data, 1);

  //   if (isEdit) {
  //     updateListingDetails(payload);
  //   } else {
  //     createListingDetailsPayload(payload, {
  //       onSuccess: () => navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS),
  //     });
  //   }
  // };
  const onSaveExit = async (data: DocumentFormValues) => {
    if (!data.propertyOwnership && !data.authorityLicense && !data.nationalId) {
      Toast.show({ type: 'error', text1: 'Please upload at least one document' });
      return;
    }
    // handleExport()
    // return false

    const payload = buildPayload(data, 1);
    setIsLoading(true); // 👈 start loading

    try {
      const response = await fetch(`${BASE_URL}api/v2/channelmanagement/create-listing/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        Toast.show({ type: 'success', text1: result?.message || 'Documents uploaded successfully' });
        queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
        queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id] });




        if (isEdit) {
          goBack();
        } else {
          handleExport()
        }
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: error.message || 'Something went wrong' });
    } finally {
      setIsLoading(false); // 👈 stop loading (success & error dono mein)
    }
  };
  const listingOptions = connectedAccounts?.map((item: any) => ({
    label: item.connection_type,
    value: item.ch_channel_id,
  })) ?? [];
  return {
    control,
    errors,
    handleSubmit,
    onSaveExit,
    isEdit,
    isLoading,
    propertyOwnershipDoc,
    authorityLicenseDoc,
    nationalIdDoc,
    pickDocument,
    removeDocument,
    handleExport,
    bottomSheetVisible,
    setBottomSheetVisible,
    otaControl,
    otaErrors,
    handleOtaSubmit,
    handleExportSubmit,
    connectedAccounts,
    listingOptions,
    isLoadingChannelList,
    isCreating
  };
}
