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
  const { listing_id, channel_id } = useCreateListingStore();
  const { user } = useAuthStore();
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
    // Export logic here (API call to export listing to OTA)
    Toast.show({ type: 'success', text1: `Exported to ${data.ota_account}` });
    setBottomSheetVisible(false);
  };

  const buildPayload = (
    data: DocumentFormValues,
    overrideListingId?: string,
    saveAndExit: number = 0
  ): DocumentUploadPayload => {
    const documents: Array<{ url: string; type: string; file_name: string }> = [];

    // Add property ownership document
    if (data.propertyOwnership?.base64) {
      documents.push({
        url: data.propertyOwnership.base64,
        type: 'ownership',
        file_name: data.propertyOwnership.name || 'ownership.pdf',
      });
    }

    // Add authority license document
    if (data.authorityLicense?.base64) {
      documents.push({
        url: data.authorityLicense.base64,
        type: 'authority_license',
        file_name: data.authorityLicense.name || 'authority_license.pdf',
      });
    }

    // Add national ID document
    if (data.nationalId?.base64) {
      documents.push({
        url: data.nationalId.base64,
        type: 'national_id',
        file_name: data.nationalId.name || 'national_id.pdf',
      });
    }

    return {
      save_and_exit: saveAndExit,
      listing_id: overrideListingId || listing_id,
      channel_id,
      documents,
    };
  };

  const onSaveExit = (data: DocumentFormValues) => {
     navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS);
    return false
    const payload = buildPayload(data, listing?.listing_id || listing_id, 1);

    if (isEdit) {
      updateListingDetails(payload);
    } else {
      createListingDetailsPayload(payload, {
        onSuccess: () => {
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
    // OTA form
    otaControl,
    otaErrors,
    handleOtaSubmit,
    handleExportSubmit,
  };
}