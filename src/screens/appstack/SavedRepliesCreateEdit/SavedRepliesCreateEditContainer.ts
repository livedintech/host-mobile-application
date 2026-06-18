import i18n from '@/locales/i18n/i18n';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { goBack } from '@/services/navigationService';
import STORAGE_CONST from '@/constants/storage';
import {
  savedRepliesTypesApiPayload,
  savedRepliesTypesApiResponse,
} from '@/types/api/savedRepliesTypes';
import {
  createSaveReplyApi,
  editSaveReplyApi,
} from '@/services/savedRepliesApi';
import { useRoute } from '@react-navigation/native';
import { getManageYourListings } from '@/services/ createListingService';
import { ManageListingsResponse } from '@/types/api/createListingTypes';
import { useAuthStore } from '@/store/useAuthStore';
import { useMemo } from 'react';
interface SavedReply {
  id: string;
  title: string;
  body: string;
  is_active: boolean;
  listing_ids?: string[];
}

const savedReplySchema = yup.object().shape({
  title: yup.string().required(i18n.t('app.validation.message_name_required')),
  body: yup
    .string()
    .required(i18n.t('app.validation.message_content_required')),
  listing_ids: yup.array().of(yup.string()).optional(),
  auto_apply_new_listings: yup.boolean().default(false),
});

export default function useSavedRepliesCreateEditContainer() {
  const { user } = useAuthStore();
  const route = useRoute<any>();
  const editData = route?.params?.editData as SavedReply;
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(savedReplySchema),
    defaultValues: {
      title: editData?.title || '',
      body: editData?.body || '',
listing_ids: editData?.listing_ids ? editData.listing_ids.map(id => String(id)) : [],
      auto_apply_new_listings: editData?.auto_apply_new_listings || false,
    },
  });

  // Create
  const {
    mutate: createSaveReplyPayload,
    isPending,
    isIdle,
  } = useMutation<
    savedRepliesTypesApiResponse,
    Error,
    savedRepliesTypesApiPayload
  >({
    mutationFn: createSaveReplyApi,
    onSuccess: ({ message }) => {
      Toast.show({
        type: 'success',
        text1: message,
      });
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.GET_SAVED_REPLIES],
      });
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.GET_CHAT_DETAIL_SAVED_REPLIES],
      });
      goBack();
    },
    onError: error => {
      Toast.show({
        type: 'error',
        text1: error.message || i18n.t('common.toast.something_went_wrong'),
      });
    },
  });

  //Edit
  const {
    mutate: editSaveReplyPayload,
    isPending: isPendingEditSaveEdit,
    isIdle: isIdleEditSaveEdit,
  } = useMutation<
    savedRepliesTypesApiResponse,
    Error,
    savedRepliesTypesApiPayload
  >({
    mutationFn: editSaveReplyApi,
    onSuccess: ({ message }) => {
      Toast.show({
        type: 'success',
        text1: message,
      });
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.GET_SAVED_REPLIES],
      });
      goBack();
    },
    onError: error => {
      Toast.show({
        type: 'error',
        text1: error.message || i18n.t('common.toast.something_went_wrong'),
      });
    },
  });

  const onSubmit = (data: any) => {
    if (editData) {
      const payload = {
        id: editData.id,
        ...data,
      };

      editSaveReplyPayload(payload);
    } else {
      const payload = {
        ...data,
      };

      createSaveReplyPayload(payload);
    }
  };
  // Listing
  const {
    data: listing,
    refetch,
    isLoading,
  } = useQuery<ManageListingsResponse>({
    queryKey: [STORAGE_CONST.GET_SAVED_REPLIES_LISTING, user?.id],
    queryFn: () =>
      getManageYourListings({
        user: user?.id!,
      }),
    enabled: Boolean(user?.id),
  });

  // Listing
  const transformedListing = useMemo(() => {
    return (
      listing?.data?.map((item: any) => ({
        // Use the title for the dropdown label
        label: item.title || item.name || 'Untitled Property',
        // Use the id for the value (ensure it's a string)
        value: String(item.id),
      })) || []
    );
  }, [listing]);

  return {
    control,
    errors,
    handleSubmit: handleSubmit(onSubmit),
    isLoading:
      (isPending && !isIdle) || (isPendingEditSaveEdit && !isIdleEditSaveEdit),
    isEditMode: !!editData,
    transformedListing,
  };
}
