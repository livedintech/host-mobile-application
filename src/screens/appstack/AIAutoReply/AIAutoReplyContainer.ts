import i18n from '@/locales/i18n/i18n';
import { useRef, useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { ConfirmActionRef } from '@/components/molecules/ConfirmAction/ConfirmAction';
import Toast from 'react-native-toast-message';
import STORAGE_CONST from '@/constants/storage';
import { deleteAiAutoReplyApi, editAiAllowStatusApi, editStatusAiAutoReplyApi, getaiAutoReplyApi } from '@/services/aiAutoReplyApi';
import { aiAllowStatusPayload, aiAllowStatusResponse, aiAutoReplyTypesApiPayload, aiAutoReplyTypesApiResponse, deleteaiAutoReplyTypesApiPayload, deleteaiAutoReplyTypesApiResponse, editStatusAiAutoReplyTypesApiPayload } from '@/types/api/aiAutoReplyTypes';
import { PAGE_SIZE } from '@/services/api';
import useInfiniteListData from '@/hooks/useInfiniteListData';

interface AIReply {
    id: string;
    title: string;
    listingAccess: string;
    isActive: boolean;
}

export default function useAIAutoReplyContainer() {
    const queryClient = useQueryClient();
    const removeSheetRef = useRef<ConfirmActionRef>(null);
  const [Item, setItem] = useState<{ id: string; is_active?: boolean; name?: string }>()

    const handleCreateNew = () => navigate(NavigationRoutes.APP_STACK.CREATE_EDIT_AI_AUTO_REPLY);
    const handleEdit = (item: AIReply) => navigate(NavigationRoutes.APP_STACK.CREATE_EDIT_AI_AUTO_REPLY, { editData: item });
    const handleKnowledgeBase = () => navigate(NavigationRoutes.APP_STACK.WHAT_AI_KNOWS);

    // Get All Saved Replies
    const dataQuery = useInfiniteQuery({
        queryKey: [STORAGE_CONST.GET_AI_AUTO_REPLY],
        queryFn: ({ pageParam = 1 }) =>
            getaiAutoReplyApi({
                page: pageParam as number,
                limit: PAGE_SIZE,
            }),
        initialPageParam: 1,
        getNextPageParam: lastPage =>
            lastPage.current_page < lastPage.total_pages
                ? lastPage.current_page + 1
                : undefined,
    });


    const { data: raiseIssueData, isLoading, isFetching } = dataQuery;
    const data = useInfiniteListData(raiseIssueData?.pages);
    const isAiAllowed: boolean = !!raiseIssueData?.pages?.[0]?.is_ai_allow;

    // Delete User 
    const {
        mutate: deleteAiAutoReplyPayload,
        isPending: isPendingDeleteAiAutoReply,
        isIdle: isIdleDeleteAiAutoReply,

    } = useMutation<deleteaiAutoReplyTypesApiResponse, Error, deleteaiAutoReplyTypesApiPayload>({
        mutationFn: deleteAiAutoReplyApi,
        onSuccess: ({ message }) => {
            Toast.show({
                type: 'success',
                text1: message,
            });
            queryClient.invalidateQueries({
                queryKey: [STORAGE_CONST.GET_AI_AUTO_REPLY]
            });
        },
        onError: error => {
            Toast.show({
                type: 'error',
                text1: error.message || i18n.t('common.toast.something_went_wrong'),
            });
        },
    });

    //Edit Status
  const { mutate: editStatusPayload, isPending: isPendingEditSaveEdit, isIdle: isIdleEditSaveEdit } = useMutation<
    aiAutoReplyTypesApiResponse,
    Error,
    editStatusAiAutoReplyTypesApiPayload
  >({
    mutationFn: editStatusAiAutoReplyApi,
    onSuccess: ({ message }) => {
      Toast.show({ type: 'success', text1: message });
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_AI_AUTO_REPLY] });
    },
    onError: error => {
      Toast.show({ type: 'error', text1: error.message || i18n.t('common.toast.something_went_wrong') });
    },
  });

    // Toggle global AI allow status
    const { mutate: editAiAllowPayload, isPending: isPendingAiAllow } = useMutation<
        aiAllowStatusResponse,
        Error,
        aiAllowStatusPayload
    >({
        mutationFn: editAiAllowStatusApi,
        onSuccess: ({ message }) => {
            Toast.show({ type: 'success', text1: message });
            queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_AI_AUTO_REPLY] });
        },
        onError: error => {
            Toast.show({ type: 'error', text1: error.message || i18n.t('common.toast.something_went_wrong') });
        },
    });

    const openRemoveConfirmSheet = (item: any) => {
        setItem(item)
        removeSheetRef?.current?.open();
    };
    const confirm = () => {

        if (Item)
            deleteAiAutoReplyPayload({
                id: Item?.id
            })
    }
    const handleToggleAiAllow = () => {
        editAiAllowPayload({ is_ai_allow: !isAiAllowed });
    };

    const toggleSwitch = (item: { id: string; is_enabled: boolean }) => {
        setItem({
            id: item?.id
        })
        editStatusPayload({
            id: item?.id,
            is_enabled: !item?.is_enabled
        })
    };

    return {
        data,
        isLoading,
        isFetching,
        dataQuery,
        toggleSwitch,
        handleCreateNew,
        handleEdit,
        handleKnowledgeBase,
        confirm,
        openRemoveConfirmSheet,
        Item,
        removeSheetRef,
        isLoadingRemoved: isPendingDeleteAiAutoReply && !isIdleDeleteAiAutoReply,
        isLoadingStatus: isPendingEditSaveEdit && !isIdleEditSaveEdit,
        isAiAllowed,
        handleToggleAiAllow,
        isLoadingAiAllow: isPendingAiAllow,
    };
}