// useCreateEditListingDocumentUploadContainer.ts
import { useState } from 'react';
import { Platform } from 'react-native';
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
import {
  pick,
  types,
  errorCodes,
  isErrorWithCode,
} from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';
import * as yup from 'yup';
import { createListingExportApi } from '@/services/ createListingService';
import { BASE_URL_DEV } from '@env';
import { getChannelsUserbyId } from '@/services/bookingManagementApi';
import { Control, FieldValues } from 'react-hook-form';

const BASE_URL = BASE_URL_DEV;

const otaAccountSchema = yup.object({
  ota_account: yup.string().required('Please select an OTA account'),
});

type OtaAccountFormValues = { ota_account: string };

export default function useDocumentUploadContainer() {
  const [isLoading, setIsLoading] = useState(false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const { params } = useRoute<any>();
  const { listing_id, channel_id } = useCreateListingStore();
  const { user, token } = useAuthStore();

  const listing = params?.paramData?.listing;
  const isEdit = Boolean(listing?.listing_id);

  // ── Fetch OTA Accounts ────────────────────────────────────────────────────
  const { data: response, isLoading: isLoadingChannelList } = useQuery({
    queryKey: [STORAGE_CONST.GET_CHANNELS_USER, user?.id],
    queryFn: () => getChannelsUserbyId({ user_id: Number(user?.id) }),
    enabled: !!user?.id,
  });

  const connectedAccounts = response?.data || [];

  // ── Existing doc helper ───────────────────────────────────────────────────
  const getExistingDoc = (type: string) => {
    const docs = Array.isArray(listing?.documents) ? listing.documents : [];
    const doc = docs.find((d: any) => d.type === type);
    if (!doc) return null;
    return {
      uri: doc.path,
      name: doc.file_name,
      type: 'application/pdf',
      base64: null,
      isExisting: true,
    };
  };

  // ── Document form ─────────────────────────────────────────────────────────
  const { control, handleSubmit, formState: { errors }, watch, setValue } =
    useForm<DocumentFormValues>({
      resolver: yupResolver(documentUploadSchema) as any,
      defaultValues: {
        propertyOwnership: getExistingDoc('ownership'),
        authorityLicense: getExistingDoc('authority_license'),
        nationalId: getExistingDoc('national_id'),
      },
    });

  // ── OTA form ──────────────────────────────────────────────────────────────
  const {
    control: otaControlRaw,
    handleSubmit: handleOtaSubmit,
    formState: { errors: otaErrors },
  } = useForm<OtaAccountFormValues>({
    resolver: yupResolver(otaAccountSchema) as any,
  });

  // ✅ Cast for DropdownField — Control<FieldValues> se compatible
  const otaControl = otaControlRaw as Control<FieldValues>;

  const propertyOwnershipDoc = watch('propertyOwnership');
  const authorityLicenseDoc = watch('authorityLicense');
  const nationalIdDoc = watch('nationalId');

  // ── getBase64 — Android + iOS donu ───────────────────────────────────────
  const getBase64 = async (uri: string): Promise<string> => {
    if (Platform.OS === 'ios') {
      // iOS: import mode ke baad uri seedha app-sandbox file:// hoti hai
      const filePath = decodeURIComponent(uri.replace('file://', ''));
      return await RNFS.readFile(filePath, 'base64');
    }

    // Android: content:// URI — pehle cache mein copy karo
    if (uri.startsWith('content://')) {
      const destPath = `${RNFS.CachesDirectoryPath}/temp_${Date.now()}.pdf`;
      await RNFS.copyFile(uri, destPath);
      const base64 = await RNFS.readFile(destPath, 'base64');
      await RNFS.unlink(destPath).catch(() => {});
      return base64;
    }

    // Android: normal file:// URI
    return await RNFS.readFile(uri.replace('file://', ''), 'base64');
  };

  // ── Document picker ───────────────────────────────────────────────────────
  const pickDocument = async (fieldName: any) => {
    try {
      const result = await pick({
        type: [types.pdf],
        // ✅ KEY FIX: mode:'import' — iOS file ko app sandbox mein copy karta
        //    hai automatically. Iske baad uri seedha readable file:// hoti hai.
        //    Downloads, iCloud, Files app — sab se pick kaam karega.
        mode: 'import',
        presentationStyle: 'fullScreen',
        transitionStyle: 'coverVertical',
      });

      const file = result?.[0];
      if (!file) return;

      // file.error check
      if (file.error) {
        Toast.show({ type: 'error', text1: `File error: ${file.error}` });
        return;
      }

      if (file.size && file.size > 10 * 1024 * 1024) {
        Toast.show({ type: 'error', text1: 'File size must be ≤ 10 MB' });
        return;
      }

      // ✅ Platform-aware base64 — iOS aur Android dono ke liye
      const base64 = await getBase64(file.uri);

      setValue(fieldName, {
        uri: file.uri,
        name: file.name || 'document.pdf',
        type: file.type || 'application/pdf',
        base64,
        isExisting: false,
      } as any);

    } catch (err: unknown) {
      // ✅ Cancel silently handle karo
      if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) return;
      console.log('Picker error:', err);
      Toast.show({ type: 'error', text1: 'Document pick karne mein masla aaya.' });
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

  // ── onSaveExit ────────────────────────────────────────────────────────────
  const onSaveExit = async (data: DocumentFormValues) => {
    const payload = buildPayload(data);
    setIsLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}api/v2/channelmanagement/create-listing/documents`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
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

  // ── Export mutation ───────────────────────────────────────────────────────
  const { mutate: exportListing, isPending: isExporting } = useMutation({
    mutationFn: createListingExportApi,
    onSuccess: () => {
      setBottomSheetVisible(false);
      Toast.show({ type: 'success', text1: 'Listing exported successfully' });
      navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS);
    },
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err.message }),
  });

  const handleExport = () => {
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

  const handleExportSubmit = (data: OtaAccountFormValues) => {
    exportListing({
      channel_id: data.ota_account,
      listing_id: String(listing_id),
    });
  };

 const listingOptions = connectedAccounts
  .filter((item: any) => item.connection_type === 'Airbnb') // ✅
  .map((item: any) => ({
    label: 'Airbnb',
    value: item.ch_channel_id,
  }));

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