import STORAGE_CONST from '@/constants/storage';
import useInfiniteListData from '@/hooks/useInfiniteListData';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { PAGE_SIZE, queryClient } from '@/services/api';
import { navigate } from '@/services/navigationService';
import { deleteSaveReplyApi, getSavedRepliesApi } from '@/services/savedReplies';
import { deleteSavedRepliesTypesApiPayload, deleteSavedRepliesTypesApiResponse } from '@/types/api/savedRepliesTypes';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

interface SavedReply {
    id: string;
    title: string;
    body: string;
    isActive: boolean;
}

export const useSavedRepliesContainer = () => {
    const [replies, setReplies] = useState<SavedReply[]>([
        { id: '1', title: 'Cleaning',body:'Description', isActive: true },
        { id: '2', title: 'Payment Details', body:'Description',isActive: true },
        { id: '3', title: 'Address',body:'Description', isActive: true },
        { id: '4', title: 'Wifi Password',body:'Description', isActive: false },
    ]);

    const toggleSwitch = (id: string) => {
        setReplies(prev => prev.map(item =>
            item.id === id ? { ...item, isActive: !item.isActive } : item
        ));
    };

    const deleteReply = (id: string) => {
        setReplies(prev => prev.filter(item => item.id !== id));
    };

    const editReply = (item:SavedReply) => {
        navigate(NavigationRoutes.APP_STACK.SAVED_REPLIES_CREATE_EDIT,{editData: item})
    };

    const createNewReply = () => {
        navigate(NavigationRoutes.APP_STACK.SAVED_REPLIES_CREATE_EDIT)
    };

    // Get All Chat List
    // const dataQuery = useInfiniteQuery({
    //     queryKey: [STORAGE_CONST.GET_SAVED_REPLIES],
    //     queryFn: ({ pageParam = 1 }) =>
    //         getSavedRepliesApi({
    //             page: pageParam as number,
    //             limit: PAGE_SIZE,
    //         }),
    //     initialPageParam: 1,
    //     getNextPageParam: lastPage =>
    //         lastPage.current_page < lastPage.total_pages
    //             ? lastPage.current_page + 1
    //             : undefined,
    // });


    // const { data: raiseIssueData, isLoading, isFetching } = dataQuery;
    // const data = useInfiniteListData(raiseIssueData?.pages);

     // Delete User 
   const {
    mutate: deleteSaveReplyPayload,
    isPending: isPendingDeleteSaveReply,
  } = useMutation<deleteSavedRepliesTypesApiResponse, Error, deleteSavedRepliesTypesApiPayload>({
    mutationFn: deleteSaveReplyApi,
    onSuccess: ({ message }) => {
      Toast.show({
        type: 'success',
        text1: message,
      });
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.GET_SAVED_REPLIES]
      });
    },
    onError: error => {
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong',
      });
    },
  });

    return {
        data: [],
        isLoading: false,
        isFetching: false,
        dataQuery:{},
        replies,
        toggleSwitch,
        deleteReply,
        editReply,
        createNewReply
    };
};