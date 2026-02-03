import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { goBack, navigate } from '@/services/navigationService';
import STORAGE_CONST from '@/constants/storage';
import { savedRepliesTypesApiPayload, savedRepliesTypesApiResponse } from '@/types/api/savedRepliesTypes';
import { createSaveReplyApi, editSaveReplyApi } from '@/services/savedReplies';
import { useRoute } from '@react-navigation/native';
interface SavedReply {
    id: string;
    title: string;
    body: string;
    isActive: boolean;
}

const savedReplySchema = yup.object().shape({
    title: yup.string().required('Message Name is required'),
    body: yup.string().required('Message Content is required'),
    listing_ids: yup.array().min(1, 'Please select at least one listing').required(),
    auto_apply_new_listings: yup.boolean().default(false),
});

export default function useSavedRepliesCreateEditContainer() {
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
            listing_ids: editData?.listing_ids || [],
            auto_apply_new_listings: editData?.isActive || false,
        },
    });

    // Create
    const {
        mutate: createSaveReplyPayload,
        isPending,
        isIdle,
    } = useMutation<savedRepliesTypesApiResponse, Error, savedRepliesTypesApiPayload>({
        mutationFn: createSaveReplyApi,
        onSuccess: ({ message }) => {
            Toast.show({
                type: 'success',
                text1: message,
            });
            queryClient.invalidateQueries({
                queryKey: [STORAGE_CONST.GET_SAVED_REPLIES]
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

    const {
        mutate: editSaveReplyPayload,
        isPending: isPendingEditSaveEdit,
        isIdle: isIdleEditSaveEdit,
    } = useMutation<savedRepliesTypesApiResponse, Error, savedRepliesTypesApiPayload>({
        mutationFn: editSaveReplyApi,
        onSuccess: ({ message }) => {
            Toast.show({
                type: 'success',
                text1: message,
            });
            queryClient.invalidateQueries({
                queryKey: [STORAGE_CONST.GET_USER_MANAGEMENT]
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

            editSaveReplyPayload(payload);
        } else {
            const payload = {
                ...data,
            };

            createSaveReplyPayload(payload);
        }
    };


    return {
        control,
        errors,
        handleSubmit: handleSubmit(onSubmit),
        isLoading: isPending || isPendingEditSaveEdit,
        isEditMode: !!editData,
    };
}