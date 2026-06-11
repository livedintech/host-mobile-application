import { useState, useMemo, useRef } from 'react';
import i18n from '@/locales/i18n/i18n';
import { ChatMessage, ChatStatus } from '@/types/chat';
import { useForm } from 'react-hook-form';
import { keepPreviousData, useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
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
import { PAGE_SIZE, queryClient, STALE_TIME } from '@/services/api';
import useInfiniteListData from '@/hooks/useInfiniteListData';
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
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useIsFocused } from '@react-navigation/native';

/** Survives tab unmount so inbox does not flash empty while refetching. */
const cachedChatInboxByFilter: Record<string, ChatMessage[]> = {};

const buildInboxInitialData = (cacheKey: string) => {
  const cached = cachedChatInboxByFilter[cacheKey];
  if (!cached?.length) return undefined;
  return {
    pages: [{ chats: cached, current_page: 1, total_pages: 1 }],
    pageParams: [1],
  };
};

export const useChatContainer = () => {
  const { user } = useAuthStore();
  const isFocused = useIsFocused();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%'], []);
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

  const filterCacheKey = useMemo(
    () => JSON.stringify(finalFilters),
    [finalFilters],
  );

  const dataQuery = useInfiniteQuery({
    queryKey: [STORAGE_CONST.GET_CHAT_LIST, finalFilters],
    queryFn: ({ pageParam = 1 }) =>
      getChatListApi({
        page: pageParam as number,
        limit: PAGE_SIZE,
        ...finalFilters,
      }),
    enabled: !!user?.id,
    staleTime: STALE_TIME,
    refetchOnWindowFocus: isFocused,
    refetchOnMount: true,
    refetchInterval: isFocused ? 30_000 : false,
    refetchIntervalInBackground: false,
    initialPageParam: 1,
    placeholderData: keepPreviousData,
    initialData: () => buildInboxInitialData(filterCacheKey),
    getNextPageParam: lastPage =>
      lastPage?.current_page < lastPage?.total_pages
        ? lastPage?.current_page + 1
        : undefined,
  });

  const { data: rawData, isFetching, isPending, isFetched } = dataQuery;
  const parsedData = useInfiniteListData(rawData?.pages);

  if (parsedData.length > 0) {
    cachedChatInboxByFilter[filterCacheKey] = parsedData;
  }

  const data =
    parsedData.length > 0
      ? parsedData
      : cachedChatInboxByFilter[filterCacheKey] ?? [];

  const hasMessages = data.length > 0;
  const isListLoading = !hasMessages && (!isFetched || isPending || isFetching);
  const showEmptyState = !hasMessages && isFetched && !isFetching && !isPending;


  /* --------------------------------- MUTATIONS --------------------------------- */

  const invalidateChats = () => {
    queryClient.invalidateQueries({
      queryKey: [STORAGE_CONST.GET_CHAT_LIST],
    });
  };

  const { mutate: archiveChat } = useMutation<
    createChatArchiveByConversationIdResponseType,
    Error,
    createChatArchiveByConversationIdPayloadType
  >({
    mutationFn: createInboxArchiveApi,
    onSuccess: () => invalidateChats(),
  });

  const { mutate: unArchiveChat } = useMutation({
    mutationFn: createInboxUnArchiveApi,
    onSuccess: () => invalidateChats(),
  });

  const { mutate: snoozeChat } = useMutation<
    createChatSnoozeByConversationIdResponseType,
    Error,
    createChatSnoozeByConversationIdPayloadType
  >({
    mutationFn: createInboxSnoozeApi,
    onSuccess: () => invalidateChats(),
  });

  const { mutate: unSnoozeChat } = useMutation({
    mutationFn: createInboxUnSnoozeApi,
    onSuccess: () => invalidateChats(),
  });

  const { mutate: markRead } = useMutation<
    unknown,
    Error,
    markReadChatPayloadType
  >({
    mutationFn: markReadChatApi,
    onSuccess: invalidateChats,
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


  const transformedCities = citiesData.map(
    (item: { name: string; id: string }) => ({
      label: item.name,
      value: item.id,
    })
  );

const transformedListings =
  listings?.data?.map((item: { title: string; listing_id: string }) => ({
    label: item?.title || `Property #${item?.listing_id}`,
    value: item?.listing_id ? String(item.listing_id) : '',
  }))?.filter((item: { label: string; value: string }) => item.value !== '') || [];
    

  const transformedApartmentTypes = [
    { label: i18n.t('common.dropdown.apartment'), value: 'apartment' },
  ];

  // MENU OPTIONS
const MENU_OPTIONS = [
  { id: 'saved_replies', label: i18n.t('common.dropdown.saved_replies'), icon: 'expandIcon' },
  { id: 'automation_template', label: i18n.t('common.dropdown.automation_template'), icon: 'automationTemplateIcon' },
  { id: 'ai_auto_reply', label: i18n.t('common.dropdown.ai_auto_reply'), icon: 'aiAutoReplyIcon' },
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
    navigate(NavigationRoutes.APP_STACK.MESSAGE_CATEGORIES);
  }
};

  return {
    data,
    isListLoading,
    showEmptyState,
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
