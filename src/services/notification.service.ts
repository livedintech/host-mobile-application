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

    // Background state
    onNotificationOpenedApp(getMessaging(), remoteMessage => {
      NotificationService.handleNavigation(remoteMessage);
    });

    // Quit state — Firebase
    getInitialNotification(getMessaging()).then(remoteMessage => {
      if (remoteMessage) {
        NotificationService.handleNavigation(remoteMessage);
      }
    });

    // Quit state — Notifee
    notifee.getInitialNotification().then(initial => {
      if (initial?.notification?.data) {
        NotificationService.handleNavigation({
          data: initial.notification.data as Record<string, string>,
        } as FirebaseMessagingTypes.RemoteMessage);
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
  ): void {
    if (!remoteMessage?.data) return;

    const { type, id } = remoteMessage.data as Record<string, string>;

    setTimeout(() => {
      switch (type) {
        case 'booking_detail':
          navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_DETAIL_SCREEN, {
            booking_id: `O${id}`,
          });
          break;

        case 'chats_view':
          navigate(NavigationRoutes.APP_STACK.CHAT_DETAIL, {
            conversation_id: id,
          });
          break;

        case 'booking_modification':
          navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_DETAIL_SCREEN, {
            booking_id: `O${id}`,
          });
          break;

        case 'booking_cancellation':
          navigate(NavigationRoutes.APP_STACK.NOTIFIATION);
          break;

        case 'booking_request':
          navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_DETAIL_SCREEN, {
            booking_id: `O${id}`,
          });
          break;

        case 'listing_mapping':
        case 'listing_export':
          break;

        case 'task_update':
          navigate(NavigationRoutes.APP_STACK.EDIT_TASK, {
            taskId: id,
          });
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
    }, 5000);
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
        showBadge: true,
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
