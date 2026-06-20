import i18n from '@/locales/i18n/i18n';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRoute } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import * as yup from 'yup';
import Toast from 'react-native-toast-message';

import { goBack, navigate, resetToRoutes } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { createListingDetailsApi, editListingApi } from '@/services/ createListingService';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/services/api';
import STORAGE_CONST from '@/constants/storage';
import { CreateListingDetailsPayload } from '@/types/api/createListingTypes';
import useListingExport from '@/hooks/useListingExport';

export const getDescribeHouseSchema = (editType?: string) =>
  yup.object().shape({
    name: editType === 'description'
      ? yup.string().notRequired()
      : yup.string()
          .required(i18n.t('app.describe_house.validation_title_required'))
          .max(50, i18n.t('app.describe_house.validation_title_max')),
    listing_descriptions: editType === 'title'
      ? yup.string().notRequired()
      : yup.string()
          .required(i18n.t('app.describe_house.validation_description_required'))
          .max(500, i18n.t('app.describe_house.validation_description_max')),
  });

export type DescribeHouseFormValues = yup.InferType<ReturnType<typeof getDescribeHouseSchema>>;

const parseDescription = (raw: any): string => {
  if (!raw) return '';
  const first = Array.isArray(raw) ? raw[0] : raw;
  if (typeof first === 'object' && first !== null) return first.description || '';
  if (typeof first === 'string') {
    try {
      const parsed = JSON.parse(first);
      return parsed?.description || first;
    } catch {
      return first;
    }
  }
  return '';
};

export default function useDescribeHouseContainer() {
  const { params }   = useRoute<any>();
  const { updateListing, listing_id, channel_id, listing: propertyDetail } = useCreateListingStore();
  const { user }     = useAuthStore();

  const listing  = params?.paramData?.listing;
  const editType = params?.editType;
  const isEdit   = Boolean(listing?.listing_id);

  // ── Export ────────────────────────────────────────────────────────────────
  const {
    bottomSheetVisible,
    setBottomSheetVisible,
    handleExport,
    handleExportSubmit,
    handleOtaSubmit,
    otaControl,
    otaErrors,
    listingOptions,
    isPendingExporting,
  } = useListingExport();

  // ── Main Form ─────────────────────────────────────────────────────────────
  const { control, handleSubmit, formState: { errors }, watch } =
    useForm<DescribeHouseFormValues>({
      resolver: yupResolver(getDescribeHouseSchema(editType)) as any,
      defaultValues: {
        name:                 isEdit ? (listing?.name ?? '') : '',
        listing_descriptions: isEdit ? (parseDescription(listing?.listing_descriptions) || '') : '',
      },
    });

  const titleLength       = (watch('name') || '').length;
  const descriptionLength = (watch('listing_descriptions') || '').length;

  const buildPayload = (
    data: DescribeHouseFormValues,
    isSaveAndExit: boolean = false,
  ): CreateListingDetailsPayload => ({
    user_id:       String(user?.id),
    channel_id,
    listing_id:    String(listing_id),
    save_and_exit: isSaveAndExit ? 1 : 0,
    listing: {
      name:                 data.name ?? '',
      listing_desc:         data.listing_descriptions ?? '',
      listing_descriptions: [{ description: data.listing_descriptions ?? '' }],
    },
  });

  const { mutate: createListingDetailsPayload, isPending } = useMutation({
    mutationFn: createListingDetailsApi,
    onSuccess: (_, variables: any) => {
      if (variables?.save_and_exit) {
        resetToRoutes([{ name: NavigationRoutes.APP_STACK.ROOT_STACK }, { name: NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS }] as any);
      } else {
        navigate(NavigationRoutes.APP_STACK.ADD_PROPERTY_GUIDELINES);
      }
    },
    onError: (err: any) =>
      Toast.show({ type: 'error', text1: err.message || i18n.t('common.toast.something_went_wrong') }),
  });

  const { mutate: updateListingDetails, isPending: isUpdating } = useMutation({
    mutationFn: editListingApi,
    onSuccess: ({ message }: any) => {
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

  const onNext = (data: DescribeHouseFormValues) => {
    updateListing({ name: data.name ?? '', listing_desc: data.listing_descriptions ?? '' });
    createListingDetailsPayload(buildPayload(data, false));
  };

  const onSaveExit = (data: DescribeHouseFormValues) => {
    updateListing({ name: data.name ?? '', listing_desc: data.listing_descriptions ?? '' });
    if (isEdit) {
      updateListingDetails(buildPayload(data, true));
    } else {
      if (!listing_id) {
        Toast.show({ type: 'error', text1: i18n.t('common.toast.something_went_wrong') });
        return;
      }
      createListingDetailsPayload(buildPayload(data, true));
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
    titleLength,
    descriptionLength,
    editType,
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