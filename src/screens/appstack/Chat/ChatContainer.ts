import { useState, useMemo, useRef, useCallback } from 'react';
import i18n from '@/locales/i18n/i18n';
import { ChatMessage, ChatStatus } from '@/types/chat';
import { useForm } from 'react-hook-form';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import STORAGE_CONST from '@/constants/storage';
import {
  createInboxArchiveApi,
  createInboxSnoozeApi,
  createInboxUnArchiveApi,
  createInboxUnSnoozeApi,
  getChatListApi,
  getChatListCityApi,
  markReadChatApi
} from '@/services/chatApi';
import { PAGE_SIZE, queryClient } from '@/services/api';
import useInfiniteListData from '@/hooks/useInfiniteListData';
import Toast from 'react-native-toast-message';
import {
  createChatArchiveByConversationIdPayloadType,
  createChatArchiveByConversationIdResponseType,
  createChatSnoozeByConversationIdPayloadType,
  createChatSnoozeByConversationIdResponseType,
  markReadChatPayloadType
} from '@/types/api/chatTypes';
import { getUserListingsByUserIDApi } from '@/services/bookingManagementApi';
import { useAuthStore } from '@/store/useAuthStore';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import BottomSheet, { BottomSheetModal } from '@gorhom/bottom-sheet';

export const useChatContainer = () => {
  const { user } = useAuthStore();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['40%', '60%'], []);
  const [activeTab, setActiveTab] = useState<ChatStatus>('All');

  const [filterAssigned, setFilterAssigned] = useState(false);
  const [search, setSearch] = useState('');

  const {
    control,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      reservationStatus: '',
      listings: '',
      city: '',
      apartmenttype: '',
    }
  });

  const reservationStatus = watch('reservationStatus');
  const listingId = watch('listings');
  const city = watch('city');
  const listingType = watch('apartmenttype');

  /* -------------------------------- TAB FILTERS -------------------------------- */

  const getChatFiltersByTab = (tab: ChatStatus) => {
    switch (tab) {
      case 'Unread':
        return { unread: true };
      case 'Archived':
        return { archived: true };
      case 'Snoozed':
        return { snoozed: true };
      default:
        return {};
    }
  };

  /* ------------------------------- FINAL FILTERS ------------------------------- */

  const finalFilters = useMemo(() => {
    const rawFilters = {
      ...getChatFiltersByTab(activeTab),
      search: search || undefined,
      assigned_to: filterAssigned ? user?.id : undefined,
      listing_id: listingId || undefined,
      city: city || undefined,
      listing_type: listingType || undefined,
      reservation_status: reservationStatus || undefined,
    };

    // Remove undefined & empty values
    return Object.fromEntries(
      Object.entries(rawFilters).filter(
        ([_, value]) => value !== undefined && value !== ''
      )
    );
  }, [
    activeTab,
    search,
    filterAssigned,
    listingId,
    city,
    listingType,
    reservationStatus,
    user?.id,
  ]);

  /* ------------------------------- CHAT LIST QUERY ------------------------------ */

  const dataQuery = useInfiniteQuery({
    queryKey: [STORAGE_CONST.GET_CHAT_LIST, finalFilters],
    queryFn: ({ pageParam = 1 }) =>
      getChatListApi({
        page: pageParam as number,
        limit: PAGE_SIZE,
        ...finalFilters,
      }),
    refetchInterval: 4000,
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage?.current_page < lastPage?.total_pages
        ? lastPage?.current_page + 1
        : undefined,
  });

  const { data: rawData, isLoading, isFetching } = dataQuery;
  const data = useInfiniteListData(rawData?.pages);

  console.log("chatList", data)

  /* --------------------------------- MUTATIONS --------------------------------- */

  const invalidateChats = () => {
    queryClient.invalidateQueries({
      queryKey: [STORAGE_CONST.GET_CHAT_LIST],
    });
  };

  const showSuccess = (message: string) =>
    Toast.show({ type: 'success', text1: message });

  const showError = (message: string) =>
    Toast.show({ type: 'error', text1: message });

  const { mutate: archiveChat } = useMutation<
    createChatArchiveByConversationIdResponseType,
    Error,
    createChatArchiveByConversationIdPayloadType
  >({
    mutationFn: createInboxArchiveApi,
    onSuccess: ({ message }) => {
      invalidateChats();
      showSuccess(message);
    },
    onError: (error) => showError(error.message),
  });

  const { mutate: unArchiveChat } = useMutation({
    mutationFn: createInboxUnArchiveApi,
    onSuccess: ({ message }) => {
      invalidateChats();
      showSuccess(message);
    },
    onError: (error: Error) => showError(error.message),
  });

  const { mutate: snoozeChat } = useMutation<
    createChatSnoozeByConversationIdResponseType,
    Error,
    createChatSnoozeByConversationIdPayloadType
  >({
    mutationFn: createInboxSnoozeApi,
    onSuccess: ({ message }) => {
      invalidateChats();
      showSuccess(message);
    },
    onError: (error) => showError(error.message),
  });

  const { mutate: unSnoozeChat } = useMutation({
    mutationFn: createInboxUnSnoozeApi,
    onSuccess: ({ message }) => {
      invalidateChats();
      showSuccess(message);
    },
    onError: (error: Error) => showError(error.message),
  });

  const { mutate: markRead } = useMutation<
    unknown,
    Error,
    markReadChatPayloadType
  >({
    mutationFn: markReadChatApi,
    onSuccess: invalidateChats,
    onError: (error) => showError(error.message),
  });

  /* -------------------------------- ACTIONS -------------------------------- */

  const handleAction = (item: ChatMessage, status: ChatStatus) => {
    if (status === 'Archived') {
      item?.is_archived
        ? unArchiveChat({ conversation_id: item.id })
        : archiveChat({ conversation_id: item.id });
    }

    if (status === 'Snoozed') {
      item?.is_mute
        ? unSnoozeChat({ conversation_id: item.id })
        : snoozeChat({ conversation_id: item.id });
    }
  };

  const handleResetAll = () => {
    reset();
    setFilterAssigned(false);
  };

  const goToChatDetail = (item: {
    id: string;
    latest_message?: { id: number };
    listing_id: string;
    assigned_to_ids: number[];
  }) => {
    console.log("otemm", item)
    if (item?.latest_message?.id) {
      markRead({
        conversation_id: item.id,
        last_message_id: item.latest_message.id,
      });
    }

    navigate(NavigationRoutes.APP_STACK.CHAT_DETAIL, {
      conversation_id: item.id,
      listing_id: item.listing_id,
      assigned_to_ids: item.assigned_to_ids,
    });
  };

  /* ------------------------------- DROPDOWN DATA ------------------------------- */

  const { data: citiesData = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_CHAT_LIST_CITY],
    queryFn: getChatListCityApi,
  });

  const { data: listings } = useQuery({
    queryKey: [STORAGE_CONST.GET_USER_LISTINGS_USER_ID, user?.id],
    queryFn: () =>
      getUserListingsByUserIDApi({
        user: user?.id!,
      }),
    enabled: !!user?.id,
  });

  console.log("chatlistings", listings)

  const transformedCities = citiesData.map(
    (item: { name: string; id: string }) => ({
      label: item.name,
      value: item.id,
    })
  );

  const transformedListings =
    listings?.data?.map((item: { title: string; listing_id: string }) => ({
      label: item.title,
      value: item.listing_id,
    })) || [];

  const transformedApartmentTypes = [
    { label: i18n.t('common.dropdown.apartment'), value: 'apartment' },
  ];

  // MENU OPTIONS
const MENU_OPTIONS = [
  { id: 'saved_replies', label: i18n.t('common.dropdown.saved_replies'), icon: 'expandIcon' },
  { id: 'automation_template', label: i18n.t('common.dropdown.automation_template'), icon: 'automationTemplateIcon' },
];

  const handleOpenFilter = () => {
    bottomSheetRef.current?.present();
  };

  const handleCloseFilter = () => {
    bottomSheetRef.current?.close();
  };



  /* -------------------------------- RETURN -------------------------------- */

const handlePopupMenu = (selectedId: string) => {
  if (selectedId === 'saved_replies') {
    navigate(NavigationRoutes.APP_STACK.SAVED_REPLIES);
  } else if (selectedId === 'automation_template') {
    navigate(NavigationRoutes.APP_STACK.AUTOMATION_TEMPLATE);
  } else if (selectedId === 'ai_auto_reply') {
    navigate(NavigationRoutes.APP_STACK.AI_AUTO_REPLY);
  }
};

  return {
    data,
    isLoading:false,
    isFetching,
    dataQuery,
    activeTab,
    setActiveTab,
    handleAction,
    handlePopupMenu, // 👈 ye add karo
    filterAssigned,
    setFilterAssigned,
    handleResetAll,
    control,
    errors,
    transformedCities,
    transformedListings,
    transformedApartmentTypes,
    goToChatDetail,
    search,
    setSearch,
    MENU_OPTIONS,
    handleCloseFilter,
    handleOpenFilter,
    bottomSheetRef,
    snapPoints
  };


};
