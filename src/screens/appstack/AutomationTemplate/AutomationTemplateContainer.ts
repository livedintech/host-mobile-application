import i18n from '@/locales/i18n/i18n';
import { useRef, useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import STORAGE_CONST from '@/constants/storage';
import { PAGE_SIZE } from '@/services/api';
import useInfiniteListData from '@/hooks/useInfiniteListData';
import { deleteAutomationTemplateApi, editStatusAutomationTemplateApi, getAutomationTemplateApi } from '@/services/automationTemplateApi';
import { ConfirmActionRef } from '@/components/molecules/ConfirmAction/ConfirmAction';
import { deleteSavedRepliesTypesApiPayload } from '@/types/api/savedRepliesTypes';
import { automationTemplateEditStatusTypesApiPayload, AutomationTemplateTypesApiResponse, deleteAutomationTemplateTypesApiResponse } from '@/types/api/automationTemplateTypes';

interface AutomationTemplate {
    id: string;
    name?: string;
    is_active?: boolean;
}

export default function useAutomationTemplateContainer() {
    const removeSheetRef = useRef<ConfirmActionRef>(null);
    const [Item, setItem] = useState<AutomationTemplate>()
    const queryClient = useQueryClient();

    const editTemplate = (item: AutomationTemplate) => {
        navigate(NavigationRoutes.APP_STACK.CREATE_EDIT_AUTOMATION_TEMPLATE, { editData: item });
    };

    const createNewTemplate = () => {
        navigate(NavigationRoutes.APP_STACK.CREATE_EDIT_AUTOMATION_TEMPLATE, { editData: null });
    };

    // Get All Chat List
    const dataQuery = useInfiniteQuery({
        queryKey: [STORAGE_CONST.GET_AUTOMATION_TEMPLATE],
        queryFn: ({ pageParam = 1 }) =>
            getAutomationTemplateApi({
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

    // Delete User 
    const {
        mutate: deleteAiAutoReplyPayload,
        isPending: isPendingDeleteAiAutoReply,
        isIdle: isIdleDeleteAiAutoReply,

    } = useMutation<deleteAutomationTemplateTypesApiResponse, Error, deleteSavedRepliesTypesApiPayload>({
        mutationFn: deleteAutomationTemplateApi,
        onSuccess: ({ message }) => {
            Toast.show({
                type: 'success',
                text1: message,
            });
            queryClient.invalidateQueries({
                queryKey: [STORAGE_CONST.GET_AUTOMATION_TEMPLATE]
            });
            removeSheetRef?.current?.close()
        },
        onError: error => {
            Toast.show({
                type: 'error',
                text1: error.message || i18n.t('common.toast.something_went_wrong'),
            });
        },
    });

    //Edit Status
    const { mutate: editStatusSaveReplyPayload, isPending: isPendingEditSaveEdit, isIdle: isIdleEditSaveEdit } = useMutation<
        AutomationTemplateTypesApiResponse,
        Error,
        automationTemplateEditStatusTypesApiPayload
    >({
        mutationFn: editStatusAutomationTemplateApi,
        onSuccess: ({ message }) => {
            Toast.show({ type: 'success', text1: message });
            queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_AUTOMATION_TEMPLATE] });
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

    const toggleSwitch = (item: { id: string; is_active: boolean }) => {

        setItem({
            id: item?.id
        })
        editStatusSaveReplyPayload({
            id: item?.id,
            is_active: !item?.is_active
        })
    };


    return {
        data,
        isLoading,
        isFetching,
        dataQuery,
        toggleSwitch,
        editTemplate,
        createNewTemplate,
        openRemoveConfirmSheet,
        confirm,
        removeSheetRef,
        isLoadingRemoved: isPendingDeleteAiAutoReply && !isIdleDeleteAiAutoReply,
        isLoadingStatus: isPendingEditSaveEdit && !isIdleEditSaveEdit,
        Item
    };
}