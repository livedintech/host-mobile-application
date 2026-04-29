import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { PermissionsAndroid, Platform } from 'react-native';
import { navigateToRoot } from './navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION HANDLER — Backend se jo data aata hai uski structure yeh hai:
//
//  remoteMessage.data = {
//    type: string        ← is field ke basis par screen navigate hogi
//    id:   string        ← booking id / review id / thread id etc
//    ...any other fields backend chahye send kare
//  }
//
// Naya type add karna ho to bas neeche ek aur "case" add karo:
//
//   case 'YOUR_TYPE':
//     navigateToRoot(NavigationRoutes.APP_STACK.YOUR_SCREEN, {
//       someParam: data.id,
//     });
//     break;
// ─────────────────────────────────────────────────────────────────────────────

export class NotificationService {
  static initiated = false;

  // ── FCM Token ──────────────────────────────────────────────────────────────

  static async getToken(): Promise<string> {
    const FCMToken = await messaging().getToken();
    return FCMToken;
  }

  static onTokenRefresh(callback: (token: string) => void): () => void {
    return messaging().onTokenRefresh(callback);
  }

  static async deleteToken(): Promise<void> {
    await messaging().deleteToken();
  }

  // ── Permissions ────────────────────────────────────────────────────────────

  static async requestUserPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const status = await messaging().requestPermission({
        alert: true,
        badge: true,
        sound: true,
        provisional: false,
      });

      const granted =
        status === messaging.AuthorizationStatus.AUTHORIZED ||
        status === messaging.AuthorizationStatus.PROVISIONAL;

      return granted;
    }

    if (Platform.OS === 'android') {
      // Android 13+ (API 33+) ke liye runtime permission chahiye
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

      // Android 12 aur neeche ke liye permission automatic hoti hai
      return true;
    }

    return false;
  }

  static async hasPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const status = await messaging().hasPermission();
      return (
        status === messaging.AuthorizationStatus.AUTHORIZED ||
        status === messaging.AuthorizationStatus.PROVISIONAL
      );
    }

    if (Platform.OS === 'android' && Platform.Version >= 33) {
      return PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }

    return true;
  }

  // ── Listeners ──────────────────────────────────────────────────────────────

  static async createNotificationListeners(): Promise<void> {
    this.initiated = true;

    // App background mein thi aur user ne notification tap ki
    messaging().onNotificationOpenedApp(remoteMessage => {
      NotificationService.handleNavigation(remoteMessage);
    });

    // App bilkul band thi (quit state), user ne notification tap ki
    const initialMessage = await messaging().getInitialNotification();
    if (initialMessage) {
      // Thoda delay dete hain taake navigation stack load ho jaye
      setTimeout(() => {
        NotificationService.handleNavigation(initialMessage);
      }, 1000);
    }

    // App foreground mein hai — local notification dikhao
    messaging().onMessage(async remoteMessage => {
      await notifee.incrementBadgeCount();
      await localNotification(remoteMessage);
    });

    // Foreground mein notifee notification tap hone par
    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS && detail.notification?.data) {
        console.log('notifee foreground tap data:', detail.notification.data);
        NotificationService.handleNavigation({
          data: detail.notification.data as Record<string, string>,
        } as FirebaseMessagingTypes.RemoteMessage);
      }
    });
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  static handleNavigation(
    remoteMessage: FirebaseMessagingTypes.RemoteMessage | null,
  ): void {
    if (!remoteMessage?.data) return;
    console.log('remoteMessage',remoteMessage);
    

    const { type, id, otaName } = remoteMessage.data as Record<string, string>;

    // ─── Yahan neeche apni navigation cases add karo ───────────────────────
    // Backend jo "type" field bhejega uske according case likhna hai.
    // navigateToRoot use karo jab screen APP_STACK ke andar ho (tab bar ke andar).
    // navigate use karo jab screen top-level ya modal ho.
    // ────────────────────────────────────────────────────────────────────────

    switch (type) {
      // Backend type: "booking_detail"
      // Backend data example: { type: "booking_detail", id: "123", otaName: "Airbnb" }
      case 'booking_detail':
        navigateToRoot(NavigationRoutes.APP_STACK.RESERVATION_DETAILS, {
          item: id,
          otaName: otaName,
        });
        break;

      // Backend type: "review_recieved"
      // Backend data example: { type: "review_recieved", id: "456" }
      case 'review_recieved':
        navigateToRoot(
          NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_DETAIL_SCREEN,
          {
            reviewId: id,
            showActionSheet: true,
          },
        );
        break;

      // Backend type: "payment_received"
      // Backend data example: { type: "payment_received" }
      case 'payment_received':
        navigateToRoot(NavigationRoutes.APP_STACK.BILLING);
        break;

      // Backend type: "chats_view"
      // Backend data example: { type: "chats_view", id: "thread_789" }
      case 'chats_view':
        navigateToRoot(NavigationRoutes.APP_STACK.CHAT_DETAIL, {
          threadID: id,
        });
        break;

      // ─── Naya type add karna ho to yahan likho ──────────────────────────
      // case 'task_assigned':
      //   navigateToRoot(NavigationRoutes.APP_STACK.VIEW_TASK, { taskId: id });
      //   break;
      // ────────────────────────────────────────────────────────────────────

      default:
        // Unknown type — sirf home par chale jao
        navigateToRoot(NavigationRoutes.APP_STACK.HOME);
        break;
    }
  }
}

// ── Local Notification (Foreground) ─────────────────────────────────────────
// Jab app khuli ho aur notification aaye tab yeh function use hoga.
// Notifee local notification show karta hai.

export async function localNotification(
  message: FirebaseMessagingTypes.RemoteMessage,
): Promise<void> {
  const { notification, data } = message;

  if (!notification) return;

  try {
    const badgeCount = await notifee.getBadgeCount();

    // Android notification channel — ek baar create hoti hai, repeat calls safe hain
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
        smallIcon: 'notification_icon', // android/app/src/main/res/drawable/notification_icon.xml
        importance: AndroidImportance.HIGH,
        pressAction: { id: 'default' },
      },
      ios: {
        badgeCount: badgeCount,
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
    // Silent fail — notification miss hogi but app crash nahi hogi
  }
}
