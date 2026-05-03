import { useMemo, useCallback, useEffect } from 'react';
import { AppState } from 'react-native';
import { useInfiniteQuery, useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
import notifee from '@notifee/react-native';
import STORAGE_CONST from '@/constants/storage';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import {
  getMobileNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteMobileNotification,
  ApiNotificationItem,
  ApiNotificationGroup,
  GetNotificationsResponse,
} from '@/services/mobileNotificationsApi';

export type FlatItem =
  | { type: 'header'; title: string; key: string; id: string }
  | { type: 'notification'; data: ApiNotificationItem; key: string; id: string };

export function getIconForType(notificationType: string, title?: string): string {
  const t = (title ?? '').toLowerCase();
  switch (notificationType) {
    case 'booking_detail':
      if (t.includes('check-in') || t.includes('check in')) return 'upcomingCheckIn';
      if (t.includes('check-out') || t.includes('check out')) return 'upcomingCheckOut';
      return 'calendarBooking';
    case 'booking_request':
      return 'calendarBooking';
    case 'booking_modification':
      return 'updateBooking';
    case 'booking_cancellation':
      return 'cancelBooking';
    case 'chats_view':
      return 'chatMessage';
    case 'task_update':
      if (t.includes('done') || t.includes('complete')) return 'completeTask';
      return 'newTaskAssign';
    case 'smart_lock':
      return 'unlockActivity';
    case 'listing_export':
    case 'listing_mapping':
      return 'airbnbImportListing';
    default:
      return 'calendarBooking';
  }
}

export function formatTime(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

const QUERY_KEY = [STORAGE_CONST.GET_MOBILE_NOTIFICATIONS];

function mergeGroupsFromPages(pages: GetNotificationsResponse[]): ApiNotificationGroup[] {
  const groupMap = new Map<string, ApiNotificationItem[]>();
  const groupOrder: string[] = [];

  for (const page of pages) {
    for (const group of page?.data ?? []) {
      if (!groupMap.has(group.title)) {
        groupMap.set(group.title, []);
        groupOrder.push(group.title);
      }
      const existing = groupMap.get(group.title)!;
      const existingIds = new Set(existing.map(n => n.notification_id));
      for (const item of group.data) {
        if (!existingIds.has(item.notification_id)) {
          existing.push(item);
        }
      }
    }
  }

  return groupOrder.map(title => ({ title, data: groupMap.get(title)! }));
}

function groupsToFlatItems(groups: ApiNotificationGroup[]): FlatItem[] {
  const items: FlatItem[] = [];
  for (const group of groups) {
    const headerKey = `header-${group.title}`;
    items.push({ type: 'header', title: group.title, key: headerKey, id: headerKey });
    for (const notification of group.data) {
      const notifKey = `notif-${notification.notification_id}`;
      items.push({ type: 'notification', data: notification, key: notifKey, id: notifKey });
    }
  }
  return items;
}

// Immutable updater for the React Query v5 cache (cache is frozen — no direct mutations allowed)
function updateCacheItems(
  old: InfiniteData<GetNotificationsResponse> | undefined,
  updater: (item: ApiNotificationItem) => ApiNotificationItem,
  filter?: (item: ApiNotificationItem) => boolean,
): InfiniteData<GetNotificationsResponse> | undefined {
  if (!old) return old;
  return {
    ...old,
    pages: old.pages.map(page => ({
      ...page,
      data: page.data
        .map(group => ({
          ...group,
          data: group.data
            .map(n => updater(n))
            .filter(n => (filter ? filter(n) : true)),
        }))
        .filter(group => group.data.length > 0),
    })),
  };
}

export default function useNotificationsContainer() {
  const queryClient = useQueryClient();

  const dataQuery = useInfiniteQuery({
    queryKey: QUERY_KEY,
    queryFn: ({ pageParam = 1 }) => getMobileNotifications(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.last_page
        ? lastPage.meta.current_page + 1
        : undefined,
  });

  const { isLoading, isFetching } = dataQuery;

  const flatItems = useMemo(() => {
    const pages = (dataQuery.data?.pages ?? []) as GetNotificationsResponse[];
    return groupsToFlatItems(mergeGroupsFromPages(pages));
  }, [dataQuery.data?.pages]);

  useEffect(() => {
    if (!dataQuery.data) return;
    const pages = dataQuery.data.pages as GetNotificationsResponse[];
    const unreadCount = pages.reduce((total, page) =>
      total + page.data.reduce((g, group) =>
        g + group.data.filter(n => n.status === 'unread').length, 0), 0);
    notifee.setBadgeCount(unreadCount);
  }, [dataQuery.data]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        dataQuery.refetch();
      }
    });
    return () => subscription.remove();
  }, [dataQuery]);

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_MOBILE_NOTIFICATIONS_COUNT] });
      queryClient.setQueryData<InfiniteData<GetNotificationsResponse>>(
        QUERY_KEY,
        old => updateCacheItems(old, n => n.notification_id === id ? { ...n, status: 'read' } : n),
      );
      notifee.decrementBadgeCount();
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_MOBILE_NOTIFICATIONS_COUNT] });
      queryClient.setQueryData<InfiniteData<GetNotificationsResponse>>(
        QUERY_KEY,
        old => updateCacheItems(old, n => ({ ...n, status: 'read' })),
      );
      notifee.setBadgeCount(0);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMobileNotification,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_MOBILE_NOTIFICATIONS_COUNT] });
      queryClient.setQueryData<InfiniteData<GetNotificationsResponse>>(
        QUERY_KEY,
        old => updateCacheItems(
          old,
          n => n,
          n => n.notification_id !== id,
        ),
      );
    },
  });

  const handleNotificationPress = useCallback((item: ApiNotificationItem) => {
    if (item.status === 'unread') {
      markReadMutation.mutate(item.notification_id);
    }

    const { type, id } = item.payload;

    switch (type) {
      case 'booking':
        navigate(NavigationRoutes.APP_STACK.RESERVATION_CALENDAR);
        break;
      case 'booking_detail':
        navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_DETAIL_SCREEN, { booking_id: `O${id}` });
        break;
      case 'booking_modification':
        navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_DETAIL_SCREEN, { booking_id: `O${id}` });
        break;
      case 'booking_request':
        navigate(NavigationRoutes.APP_STACK.RESERVATION_CALENDAR, { activeFilter: 'booking_request' });
        break;
      case 'booking_cancellation':
        break;
      case 'chats_view':
        navigate(NavigationRoutes.APP_STACK.CHAT_DETAIL, { conversation_id: id });
        break;
      case 'task_update':
        navigate(NavigationRoutes.APP_STACK.EDIT_TASK, { taskId: id });
        break;
      case 'smart_lock':
        navigate(NavigationRoutes.APP_STACK.ACTIVE_CODES);
        break;
      case 'review_recieved':
        navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_DETAIL_SCREEN, {
          reviewId: id,
          showActionSheet: true,
        });
        break;
      case 'payment_received':
        navigate(NavigationRoutes.APP_STACK.BILLING);
        break;
      default:
        break;
    }
  }, [markReadMutation]);

  const handleMarkAllRead = useCallback(() => {
    markAllReadMutation.mutate();
  }, [markAllReadMutation]);

  const handleDeleteNotification = useCallback((id: number) => {
    deleteMutation.mutate(id);
  }, [deleteMutation]);

  return {
    flatItems,
    isLoading,
    isFetching,
    dataQuery,
    handleMarkAllRead,
    handleDeleteNotification,
    handleNotificationPress,
    goBack,
  };
}
