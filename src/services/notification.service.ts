import {
  getMessaging,
  getToken,
  onTokenRefresh,
  deleteToken,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  requestPermission,
  hasPermission,
  AuthorizationStatus,
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { PermissionsAndroid, Platform } from 'react-native';
import { navigate } from './navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { useCreateListingStore } from '@/store/useCreateListingStore';

export class NotificationService {
  static initiated = false;

  static async getToken(): Promise<string> {
    const FCMToken = await getToken(getMessaging());
    return FCMToken;
  }

  static onTokenRefresh(callback: (token: string) => void): () => void {
    return onTokenRefresh(getMessaging(), callback);
  }

  static async deleteToken(): Promise<void> {
    await deleteToken(getMessaging());
  }

  static async setBadgeCount(count: number): Promise<void> {
    await notifee.setBadgeCount(count);
  }

  static async requestUserPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const status = await requestPermission(getMessaging(), {
        alert: true,
        badge: true,
        sound: true,
        provisional: false,
      });

      return (
        status === AuthorizationStatus.AUTHORIZED ||
        status === AuthorizationStatus.PROVISIONAL
      );
    }

    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const already = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        if (already) return true;

        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message:
              'Allow Livedin to send you booking updates and important alerts.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          },
        );

        return result === PermissionsAndroid.RESULTS.GRANTED;
      }

      return true;
    }

    return false;
  }

  static async hasPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const status = await hasPermission(getMessaging());
      return (
        status === AuthorizationStatus.AUTHORIZED ||
        status === AuthorizationStatus.PROVISIONAL
      );
    }

    if (Platform.OS === 'android' && Platform.Version >= 33) {
      return PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }

    return true;
  }

  static async createNotificationListeners(): Promise<void> {
    if (this.initiated) return;
    this.initiated = true;

    // Background state — app already running, navigation is ready quickly
    onNotificationOpenedApp(getMessaging(), remoteMessage => {
      NotificationService.handleNavigation(remoteMessage, 1000);
    });

    // Quit state — Firebase — app is cold starting, needs more time
    getInitialNotification(getMessaging()).then(remoteMessage => {
      if (remoteMessage) {
        NotificationService.handleNavigation(remoteMessage, 5000);
      }
    });

    // Quit state — Notifee — app is cold starting, needs more time
    notifee.getInitialNotification().then(initial => {
      if (initial?.notification?.data) {
        NotificationService.handleNavigation(
          {
            data: initial.notification.data as Record<string, string>,
          } as FirebaseMessagingTypes.RemoteMessage,
          5000,
        );
      }
    });

    // Foreground — show local notification with badge increment
    onMessage(getMessaging(), async remoteMessage => {
      await localNotification(remoteMessage);
    });

    // Foreground — notifee tap
    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS && detail.notification?.data) {
        NotificationService.handleNavigation({
          data: detail.notification.data as Record<string, string>,
        } as FirebaseMessagingTypes.RemoteMessage);
      }
    });
  }

  static handleNavigation(
    remoteMessage: FirebaseMessagingTypes.RemoteMessage | null,
    delay: number = 1000,
  ): void {
    if (!remoteMessage?.data) return;

    const { type, id } = remoteMessage.data as Record<string, string>;

    setTimeout(() => {
      switch (type) {
        case 'booking':
          navigate(NavigationRoutes.APP_STACK.RESERVATION_CALENDAR);
          break;

        case 'direct_booking_received':
          navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_DETAIL_SCREEN, {
            booking_id: `L${id}`,
          });
          break;

        case 'booking_detail':
        case 'booking_confirmed':
        case 'stay_completed':
        case 'checkin_today':
        case 'checkout_today':
          navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_DETAIL_SCREEN, {
            booking_id: `O${id}`,
          });
          break;

        case 'booking_modification':
        case 'reservation_updated':
          navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_DETAIL_SCREEN, {
            booking_id: `O${id}`,
          });
          break;

        case 'booking_request':
        case 'pre_booking_inquiry':
        case 'new_booking_request':
          navigate(NavigationRoutes.APP_STACK.RESERVATION_CALENDAR, {
            activeFilter: 'booking_request',
          });
          break;

        case 'booking_cancellation':
        case 'reservation_cancelled':
          navigate(NavigationRoutes.APP_STACK.RESERVATION_CALENDAR);
          break;

        case 'chats_view':
        case 'new_guest_message':
        case 'escalation':
          navigate(NavigationRoutes.APP_STACK.CHAT_DETAIL, {
            conversation_id: id,
          });
          break;

        case 'task_update':
        case 'task_created':
        case 'task_in_progress':
        case 'task_completed':
          navigate(NavigationRoutes.APP_STACK.EDIT_TASK, {
            taskId: id,
          });
          break;

        case 'smart_lock':
        case 'smart_lock_assigned':
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

        case 'profile_updated':
        case 'account_created':
          navigate(NavigationRoutes.APP_STACK.PROFILE_SETTING);
          break;

        case 'listing_deleted':
          navigate(NavigationRoutes.APP_STACK.MANAGE_YOUR_LISTINGS);
          break;
        case 'listing_exported_created':
        case 'listing_added':
        case 'listing_mapped':
        case 'listing_unmapped':
        case 'listing_exported':
          useCreateListingStore.getState().setListingId(id.toString());
          navigate(NavigationRoutes.APP_STACK.PROPERTY_DETAIL);
          break;

        case 'user_invited':
        case 'user_invitation_accepted':
        case 'user_role_updated':
        case 'user_removed':
          navigate(NavigationRoutes.APP_STACK.USER_MANAGEMENT);
          break;

        default:
          break;
      }
    }, delay);
  }
}

export async function localNotification(
  message: FirebaseMessagingTypes.RemoteMessage,
): Promise<void> {
  const { notification, data } = message;

  if (!notification) return;

  try {
    const currentBadge = await notifee.getBadgeCount();
    const newBadge = currentBadge + 1;
    await notifee.setBadgeCount(newBadge);

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      vibration: true,
      badge: true,
    });

    await notifee.displayNotification({
      title: notification.title,
      body: notification.body,
      android: {
        channelId,
        largeIcon: 'ic_launcher_round',
        smallIcon: 'notification_icon',
        importance: AndroidImportance.HIGH,
        pressAction: { id: 'default' },
        badgeCount: newBadge,
      },
      ios: {
        badgeCount: newBadge,
        sound: 'default',
        foregroundPresentationOptions: {
          alert: true,
          badge: true,
          sound: true,
        },
      },
      data: data as Record<string, string>,
    });
  } catch (err) {
    // silent fail
  }
}
