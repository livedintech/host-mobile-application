// useCreateEditListingDocumentUploadContainer.ts
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DocumentFormValues, documentUploadSchema } from '@/validation/auth/createListingSchemas';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import Toast from 'react-native-toast-message';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRoute } from '@react-navigation/native';
import * as DocumentPicker from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';
import useListingExport from '@/hooks/useListingExport';
import { BASE_URL } from '@/services/apiService';

export default function useCreateEditListingDocumentUploadContainer() {
  const [isLoading, setIsLoading] = useState(false);

  const { params } = useRoute<any>();
  const { listing_id, channel_id } = useCreateListingStore();
  const { token } = useAuthStore();

  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.listing_id); // ✅ consistent

  // ── Export ────────────────────────────────────────────────────────────────
  const {
    bottomSheetVisible,
    setBottomSheetVisible,
    handleExportSubmit,
    handleOtaSubmit,
    otaControl,
    otaErrors,
    listingOptions,
    isLoadingChannelList,
    isPendingExporting: isExporting,
  } = useListingExport({
    successMessage: 'Property exported successfully',
    onSuccess: () => navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS),
  });

  // ✅ Helper — existing documents se form values banao
  const getExistingDoc = (type: string) => {
    const docs = Array.isArray(listing?.documents) ? listing.documents : [];
    const doc = docs.find((d: any) => d.type === type);
    if (!doc) return null;
    return {
      uri: doc.path,
      name: doc.file_name,
      type: 'application/pdf',
      base64: null,       // ✅ already uploaded — no base64 needed
      isExisting: true,      // ✅ flag to differentiate
    };
  };

  // ── Document form ─────────────────────────────────────────────────────────
  const { control, handleSubmit, formState: { errors }, watch, setValue } =
    useForm<DocumentFormValues>({
      resolver: yupResolver(documentUploadSchema) as any,
      defaultValues: {
        propertyOwnership: getExistingDoc('ownership'),          // ✅
        authorityLicense: getExistingDoc('authority_license'),  // ✅
        nationalId: getExistingDoc('national_id'),        // ✅
      },
    });

  const propertyOwnershipDoc = watch('propertyOwnership');
  const authorityLicenseDoc = watch('authorityLicense');
  const nationalIdDoc = watch('nationalId');

  // ── Document picker ───────────────────────────────────────────────────────
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

  const removeDocument = (fieldName: any) => setValue(fieldName, null);

  // ── Payload builder ───────────────────────────────────────────────────────
  const buildPayload = (data: DocumentFormValues) => {
    const documents: any[] = [];

    if (data.propertyOwnership?.base64) {
      documents.push({
        url: `data:application/pdf;base64,${data.propertyOwnership.base64}`,
        type: 'ownership',
        file_name: data.propertyOwnership.name,
      });
    }
    if (data.authorityLicense?.base64) {
      documents.push({
        url: `data:application/pdf;base64,${data.authorityLicense.base64}`,
        type: 'authority_license',
        file_name: data.authorityLicense.name,
      });
    }
    if (data.nationalId?.base64) {
      documents.push({
        url: `data:application/pdf;base64,${data.nationalId.base64}`,
        type: 'national_id',
        file_name: data.nationalId.name,
      });
    }

    return {
      save_and_exit: 0,
      listing_id: String(listing_id),
      channel_id,
      documents,
    };
  };

// onSaveExit fix — modal nahi, seedha navigate

const onSaveExit = async (data: DocumentFormValues) => {
  const payload = buildPayload(data);
  setIsLoading(true);
  try {
    const res = await fetch(
      `${BASE_URL}api/v2/channelmanagement/create-listing/documents`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      },
    );
    const result = await res.json();
    if (res.ok) {
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS] });
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.MANAGE_YOUR_LISTINGS_PROPERTY_DETAIL, listing_id],
      });
      Toast.show({ type: 'success', text1: result?.message || 'Saved successfully' });

      // ✅ Edit ya Create — dono mein seedha navigate, modal nahi
      if (isEdit) {
        goBack();
      } else {
        navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS);
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

const handleExport = () => {
  // ✅ Teeno documents required
  if (!propertyOwnershipDoc) {
    Toast.show({ type: 'error', text1: 'Please upload Property Ownership document' });
    return;
  }
  if (!authorityLicenseDoc) {
    Toast.show({ type: 'error', text1: 'Please upload Authority License document' });
    return;
  }
  if (!nationalIdDoc) {
    Toast.show({ type: 'error', text1: 'Please upload Aqama / National ID document' });
    return;
  }
  setBottomSheetVisible(true);
};

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
    listingOptions,
    isLoadingChannelList,
    isCreating: isExporting,
  };
}