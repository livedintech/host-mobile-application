import { ConfirmActionRef } from '@/components/molecules/ConfirmAction/ConfirmAction';
import STORAGE_CONST from '@/constants/storage';
import useInfiniteListData from '@/hooks/useInfiniteListData';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { PAGE_SIZE, queryClient } from '@/services/api';
import { navigate } from '@/services/navigationService';
import { deleteSaveReplyApi, editStatusSaveReplyApi, getSavedRepliesApi } from '@/services/savedRepliesApi';
import { deleteSavedRepliesTypesApiPayload, editStatusSavedRepliesTypesApiPayload, savedRepliesTypesApiResponse } from '@/types/api/savedRepliesTypes';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import Toast from 'react-native-toast-message';

interface SavedReply {
  id: string;
  title: string;
  body: string;
  isActive: boolean;
}

export const useSavedRepliesContainer = () => {
  const removeSheetRef = useRef<ConfirmActionRef>(null);
  const [Item, setItem] = useState<{ id: string; is_active?: boolean; title?: string }>()

  const editReply = (item: SavedReply) => {
    navigate(NavigationRoutes.APP_STACK.SAVED_REPLIES_CREATE_EDIT, { editData: item })
  };

  const createNewReply = () => {
    navigate(NavigationRoutes.APP_STACK.SAVED_REPLIES_CREATE_EDIT)
  };

  // Get All Saved Replies
  const dataQuery = useInfiniteQuery({
    queryKey: [STORAGE_CONST.GET_SAVED_REPLIES],
    queryFn: ({ pageParam = 1 }) =>
      getSavedRepliesApi({
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
    mutate: deleteSaveReplyPayload,
    isPending: isPendingDeleteSaveReply,
    isIdle: isIdleDeleteSaveReply,

  } = useMutation<savedRepliesTypesApiResponse, Error, deleteSavedRepliesTypesApiPayload>({
    mutationFn: deleteSaveReplyApi,
    onSuccess: ({ message }) => {
      Toast.show({
        type: 'success',
        text1: message,
      });
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.GET_SAVED_REPLIES]
      });
      removeSheetRef?.current?.close()
    },
    onError: error => {
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong',
      });
    },
  });

  //Edit Status
  const { mutate: editStatusSaveReplyPayload, isPending: isPendingEditSaveEdit, isIdle: isIdleEditSaveEdit } = useMutation<
    savedRepliesTypesApiResponse,
    Error,
    editStatusSavedRepliesTypesApiPayload
  >({
    mutationFn: editStatusSaveReplyApi,
    onSuccess: ({ message }) => {
      Toast.show({ type: 'success', text1: message });
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_SAVED_REPLIES] });
    },
    onError: error => {
      Toast.show({ type: 'error', text1: error.message || 'Something went wrong' });
    },
  });


  const openRemoveConfirmSheet = (item: any) => {
    setItem(item)
    removeSheetRef?.current?.open();
  };
  const confirm = () => {

    if (Item)
      deleteSaveReplyPayload({
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
    editReply,
    createNewReply,
    openRemoveConfirmSheet,
    confirm,
    removeSheetRef,
    isLoadingRemoved: isPendingDeleteSaveReply && !isIdleDeleteSaveReply || isPendingEditSaveEdit && !isIdleEditSaveEdit,
    isLoadingStatus: isPendingEditSaveEdit && !isIdleEditSaveEdit,
    Item
  };
};