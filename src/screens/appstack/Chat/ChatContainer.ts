import { useState, useMemo } from 'react';
import { ChatMessage, ChatStatus } from '@/types/chat';
import { useForm } from 'react-hook-form';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import STORAGE_CONST from '@/constants/storage';
import { createInboxArchiveApi, createInboxSnoozeApi, createInboxUnArchiveApi, createInboxUnSnoozeApi, getChatListApi, getChatListCityApi } from '@/services/chatApi';
import { PAGE_SIZE, queryClient } from '@/services/api';
import useInfiniteListData from '@/hooks/useInfiniteListData';
import Toast from 'react-native-toast-message';
import { createChatArchiveByConversationIdPayloadType, createChatArchiveByConversationIdResponseType, createChatSnoozeByConversationIdPayloadType, createChatSnoozeByConversationIdResponseType } from '@/types/api/chatTypes';
import { getUserListingsByUserIDApi } from '@/services/bookingManagementApi';
import { useAuthStore } from '@/store/useAuthStore';

export const useChatContainer = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<ChatStatus>('All');
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [filterAssigned, setFilterAssigned] = useState(false);

  const { control, reset, formState: { errors } } = useForm({
    defaultValues: { reservationStatus: '', listings: '', city: '' }
  });

  const resetFilters = () => {
    setFilterAssigned(false);
  };

  const handleResetAll = () => {
    reset();
    resetFilters();
  };
  function getChatFiltersByTab(tab: ChatStatus) {
    switch (tab) {
      case 'Unread':
        return { unread: true };

      case 'Archived':
        return { archived: true };

      case 'Snoozed':
        return { snoozed: true };

      case 'Marketplace':
        return { marketplace: true };

      case 'All':
      default:
        return {};
    }
  }

  const filters = useMemo(
    () => getChatFiltersByTab(activeTab),
    [activeTab],
  );
  // Get All Chat List
  const dataQuery = useInfiniteQuery({
    queryKey: [STORAGE_CONST.GET_CHAT_LIST, filters],
    queryFn: ({ pageParam = 1 }) =>
      getChatListApi({
        page: pageParam as number,
        limit: PAGE_SIZE,
        ...filters,
      }),
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage.current_page < lastPage.total_pages
        ? lastPage.current_page + 1
        : undefined,
  });


  const { data: raiseIssueData, isLoading, isFetching } = dataQuery;
  const data = useInfiniteListData(raiseIssueData?.pages);

  // Archive Chat
  const { mutate: chatArchivePayload, isPending: isPendingchatArchive } =
    useMutation<createChatArchiveByConversationIdResponseType, Error, createChatArchiveByConversationIdPayloadType>({
      mutationFn: createInboxArchiveApi,
      onSuccess: ({ message }) => {
        queryClient.invalidateQueries({
          queryKey: [STORAGE_CONST.GET_CHAT_LIST]
        });
        Toast.show({ type: 'success', text1: message });
      },
      onError: (error) => {
        Toast.show({ type: 'error', text1: error.message });
      },
    });

  // UnArchive Chat
  const { mutate: chatUnArchivePayload, isPending: isPendingchatUnArchive } =
    useMutation<createChatArchiveByConversationIdResponseType, Error, createChatArchiveByConversationIdPayloadType>({
      mutationFn: createInboxUnArchiveApi,
      onSuccess: ({ message }) => {
        queryClient.invalidateQueries({
          queryKey: [STORAGE_CONST.GET_CHAT_LIST],
        });
        Toast.show({ type: 'success', text1: message });
      },
      onError: (error) => {
        Toast.show({ type: 'error', text1: error.message });
      },
    });

  // Snooze
  const { mutate: chatSnoozePayload, isPending: isPendingSnooze } =
    useMutation<createChatSnoozeByConversationIdResponseType, Error, createChatSnoozeByConversationIdPayloadType>({
      mutationFn: createInboxSnoozeApi,
      onSuccess: ({ message }) => {
        queryClient.invalidateQueries({
          queryKey: [STORAGE_CONST.GET_CHAT_LIST],
        });
        Toast.show({ type: 'success', text1: message });
      },
      onError: (error) => {
        Toast.show({ type: 'error', text1: error.message });
      },
    });

  // Snooze
  const { mutate: chatUnSnoozePayload, isPending: isPendingChatUnSnooze } =
    useMutation<createChatSnoozeByConversationIdResponseType, Error, createChatSnoozeByConversationIdPayloadType>({
      mutationFn: createInboxUnSnoozeApi,
      onSuccess: ({ message }) => {
        queryClient.invalidateQueries({
          queryKey: [STORAGE_CONST.GET_CHAT_LIST],
        });
        Toast.show({ type: 'success', text1: message });
      },
      onError: (error) => {
        Toast.show({ type: 'error', text1: error.message });
      },
    });

  const handleAction = (id: string, newStatus: ChatStatus) => {
    if (newStatus === 'Archived') {
      chatArchivePayload({ conversation_id: id })
    } else if (newStatus === 'Snoozed') {
      chatSnoozePayload({ conversation_id: id })
    }
  };

  // City
  const { data: citiesData = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_CHAT_LIST_CITY],
    queryFn: getChatListCityApi,
  });

  // Listings && Appartment Types
  const { data: listings } = useQuery({
    queryKey: [STORAGE_CONST.GET_USER_LISTINGS_USER_ID, user?.id],
    queryFn: () =>
      getUserListingsByUserIDApi({
        user: user?.id!,
      }),
  });

  // City Transformed
  const transformedCities = citiesData.map((item: { name: string, id: string }) => ({
    label: item.name,
    value: item.id,
  }));  

  // Listings Transformed
  const transformedListings = listings?.data.map((item: { title: string, id: string }) => ({
    label: item.title,
    value: item.id,
  }));

   // Listings Transformed
  const transformedApartmentTypes = listings?.data.map((item: { type: string, id: string }) => ({
    label: item.type,
    value: item.id,
  }));
  // console.log('transformedListings', transformedListings);


  return {
    data,
    isLoading,
    isFetching,
    dataQuery,
    activeTab,
    setActiveTab,
    handleAction,
    isFilterVisible,
    setFilterVisible,
    filterAssigned,
    setFilterAssigned,
    handleResetAll,
    control,
    errors,
    transformedCities,
    transformedListings,
    transformedApartmentTypes
  };
};