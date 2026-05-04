import { SERVICE_CONFIG_URLS } from '@/constants/api_urls';
import apiService from './apiService';

export interface ApiNotificationPayload {
  type: string;
  id: string;
  sound: string;
  otaName: string;
  notification_type: string;
}

export interface ApiNotificationItem {
  notification_id: number;
  status: 'read' | 'unread';
  title: string;
  message: string;
  listing_name: string;
  created_at: string;
  payload: ApiNotificationPayload;
}

export interface ApiNotificationGroup {
  title: string;
  data: ApiNotificationItem[];
}

export interface NotificationsMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface GetNotificationsResponse {
  status: string;
  message: string;
  data: ApiNotificationGroup[];
  meta: NotificationsMeta;
}

export const getMobileNotifications = async (page: number = 1): Promise<GetNotificationsResponse> => {
  const { ok, response, data } = await apiService.get(
    SERVICE_CONFIG_URLS.APP.GET_MOBILE_NOTIFICATIONS,
    { page },
  );

  if (ok) return data;
  throw new Error(response?.message || 'Failed to fetch notifications');
};

export const markNotificationRead = async (id: number): Promise<void> => {
  const url = SERVICE_CONFIG_URLS.APP.MARK_NOTIFICATION_READ.replace('{id}', String(id));
  const { ok, response } = await apiService.put(url, {});
  if (!ok) throw new Error(response?.message || 'Failed to mark notification as read');
};

export const markAllNotificationsRead = async (): Promise<void> => {
  const { ok, response } = await apiService.put(
    SERVICE_CONFIG_URLS.APP.MARK_ALL_NOTIFICATIONS_READ,
    {},
  );
  if (!ok) throw new Error(response?.message || 'Failed to mark all notifications as read');
};

export const deleteMobileNotification = async (id: number): Promise<void> => {
  const url = SERVICE_CONFIG_URLS.APP.DELETE_MOBILE_NOTIFICATION.replace('{id}', String(id));
  const { ok, response } = await apiService.delete(url);
  if (!ok) throw new Error(response?.message || 'Failed to delete notification');
};

export interface NotificationsCountData {
  total: number;
  unread: number;
  read: number;
}

export interface NotificationsCountResponse {
  status: string;
  message: string;
  data: NotificationsCountData;
}

export const getMobileNotificationsCount = async (): Promise<NotificationsCountResponse> => {
  const { ok, response, data } = await apiService.get(
    SERVICE_CONFIG_URLS.APP.GET_MOBILE_NOTIFICATIONS_COUNT,
  );
  if (ok) return data;
  throw new Error(response?.message || 'Failed to fetch notifications count');
};
