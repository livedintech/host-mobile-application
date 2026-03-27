import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { goBack, navigate } from '@/services/navigationService';
import { createAiAutoReplyApi, editAiAutoReplyApi } from '@/services/aiAutoReplyApi';
import { aiAutoReplyTypesApiPayload, aiAutoReplyTypesApiResponse, editAiAutoReplyTypesApiPayload } from '@/types/api/aiAutoReplyTypes';
import STORAGE_CONST from '@/constants/storage';
import { ManageListingsResponse } from '@/types/api/createListingTypes';
import { getManageYourListings } from '@/services/ createListingService';
import { useAuthStore } from '@/store/useAuthStore';

const aiRuleSchema = yup.object().shape({
    name: yup.string().required('Rule name is required'),
    listing_ids: yup.array().optional(),
    template: yup.string().required('Template is required'),
    auto_send: yup.boolean().default(false),
    is_enabled: yup.boolean().default(true),
});

export default function useCreateEditAIRuleContainer(editData?: any) {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(aiRuleSchema),
        defaultValues: {
            name: editData?.name || '',
            template: editData?.template || '',
            listing_ids: editData?.listing_ids || [],
            auto_send: editData?.auto_send ?? false,
        },
    });

    // Create
    const {
        mutate: createAiAutoReplyPayload,
        isPending,
        isIdle,
    } = useMutation<aiAutoReplyTypesApiResponse, Error, aiAutoReplyTypesApiPayload>({
        mutationFn: createAiAutoReplyApi,
        onSuccess: ({ message }) => {
            Toast.show({
                type: 'success',
                text1: message,
            });
            queryClient.invalidateQueries({
                queryKey: [STORAGE_CONST.GET_AI_AUTO_REPLY]
            });
            goBack()
        },
        onError: error => {
            Toast.show({
                type: 'error',
                text1: error.message || 'Something went wrong',
            });
        },
    });

    // Edit
    const {
        mutate: editAiAutoReplyPayload,
        isPending: isPendingEditSaveEdit,
        isIdle: isIdleEditSaveEdit,
    } = useMutation<aiAutoReplyTypesApiResponse, Error, editAiAutoReplyTypesApiPayload>({
        mutationFn: editAiAutoReplyApi,
        onSuccess: ({ message }) => {
            Toast.show({
                type: 'success',
                text1: message,
            });
            queryClient.invalidateQueries({
                queryKey: [STORAGE_CONST.GET_AI_AUTO_REPLY]
            });
            goBack()
        },
        onError: error => {
            Toast.show({
                type: 'error',
                text1: error.message || 'Something went wrong',
            });
        },
    });

    const onSubmit = (data: any) => {
        if (editData) {
            const payload = {
                id: editData.id,
                ...data,
            };

            editAiAutoReplyPayload(payload);
        } else {
            const payload = {
                ...data,
            };

            createAiAutoReplyPayload(payload);
        }
    };

     // Listing
    const { data:listing, refetch, isLoading } = useQuery<ManageListingsResponse>({
        queryKey: [STORAGE_CONST.GET_AI_AUTO_REPLY_LISTING, user?.id],
        queryFn: () =>
            getManageYourListings({
                user: user?.id!,
            }),
        enabled: Boolean(user?.id),
    });
    
    // Listing
      const transformedListing = listing?.data.map((item: any) => ({
        label: item.title,
        value: item.id,
      }));

    return {
        control,
        errors,
        handleSubmit: handleSubmit(onSubmit),
        isLoading: isPending && !isIdle || isPendingEditSaveEdit && isIdleEditSaveEdit,
        isEditMode: !!editData,
        transformedListing
    };
}