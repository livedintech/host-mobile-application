import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DocumentFormValues, documentUploadSchema } from '@/validation/auth/createListingSchemas';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useMutation } from '@tanstack/react-query';
import { CreateListingDetailsPayload, CreateListingDetailsResponse, DocumentUploadPayload } from '@/types/api/createListingTypes';
import { createListingDetailsApi, editListingApi } from '@/services/ createListingService';
import Toast from 'react-native-toast-message';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRoute } from '@react-navigation/native';
import * as DocumentPicker from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';
import * as yup from 'yup';

// Schema for OTA Account selection
const otaAccountSchema = yup.object({
  ota_account: yup.string().required('Please select an OTA account'),
});

type OtaAccountFormValues = {
  ota_account: string;
};

export default function useCreateEditListingDocumentUploadContainer() {
  const { params } = useRoute();
  const { listing_id, channel_id, listing: propertyDetail } = useCreateListingStore(); const { user } = useAuthStore();
  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.id);

  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  // OTA account options (can be fetched from API)
  const otaAccountOptions = [
    { label: "Tooba's airbnb account", value: 'tooba_airbnb' },
    { label: "Ahmad's booking.com account", value: 'ahmad_booking' },
    { label: "Sarah's gathern account", value: 'sarah_gathern' },
  ];

  // Main form for documents
  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<DocumentFormValues>({
    resolver: yupResolver(documentUploadSchema) as any,
    defaultValues: {
      propertyOwnership: listing?.property_ownership_doc ?? null,
      authorityLicense: listing?.authority_license_doc ?? null,
      nationalId: listing?.national_id_doc ?? null,
    },
  });

  // Separate form for OTA account selection
  const {
    control: otaControl,
    handleSubmit: handleOtaSubmit,
    formState: { errors: otaErrors },
  } = useForm<OtaAccountFormValues>({
    resolver: yupResolver(otaAccountSchema) as any,
    defaultValues: {
      ota_account: '',
    },
  });

  const propertyOwnershipDoc = watch('propertyOwnership');
  const authorityLicenseDoc = watch('authorityLicense');
  const nationalIdDoc = watch('nationalId');

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
  const { mutate: createListingDetailsPayload, isPending: isCreating } =
    useMutation<CreateListingDetailsResponse, Error, CreateListingDetailsPayload>({
      mutationFn: createListingDetailsApi,
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
    // Example Export API Call
    // exportListingApi({ listing_id, ota_account_id: data.ota_account })
    Toast.show({ type: 'success', text1: `Exporting listing to ${data.ota_account}...` });
    setBottomSheetVisible(false);
  };

  const buildPayload = (
    data: DocumentFormValues,
    isSaveAndExit: number
  ): any => {
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
      save_and_exit:  0,

      documents,
      // Note: If API expects documents inside 'listing' object, wrap it here.
      // Based on standard Swagger for files:
      listing: {
        name: propertyDetail?.name || 'New Listing'
      }
    };
  };

  const onSaveExit = (data: DocumentFormValues) => {
    // 1. Check if at least one document is present
    if (!data.propertyOwnership && !data.authorityLicense && !data.nationalId) {
      Toast.show({ type: 'error', text1: 'Please upload at least one document' });
      return;
    }

    const payload = buildPayload(data, 1); // save_and_exit: 1

    if (isEdit) {
      updateListingDetails(payload);
    } else {
      createListingDetailsPayload(payload, {
        onSuccess: () => {
          // Complete the flow
          navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS);
        },
      });
    }
  };

  return {
    control,
    errors,
    handleSubmit,
    onSaveExit,
    isEdit,
    isLoading: isCreating || isUpdating,
    propertyOwnershipDoc,
    authorityLicenseDoc,
    nationalIdDoc,
    pickDocument,
    removeDocument,
    handleExport,
    bottomSheetVisible,
    setBottomSheetVisible,
    otaAccountOptions,
    otaControl,
    otaErrors,
    handleOtaSubmit,
    handleExportSubmit,
  };
}