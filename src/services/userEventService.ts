
import { Platform } from 'react-native';
import { getFirestore, addDoc, collection, serverTimestamp } from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';
import { useAuthStore } from '@/store/useAuthStore';

// ─── Event Action Types ────────────────────────────────────────────────────────
// Backend ke saath agree karo konse actions track karne hain — yahan add karo
export type UserEventAction =
  | 'app_open'
  | 'app_background'
  | 'screen_view'
  | 'button_tap'
  | 'listing_viewed'
  | 'booking_viewed'
  | 'booking_action_taken'
  | 'notification_tapped'
  | 'filter_applied'
  | 'search_performed'
  | 'logout'
  | (string & {}); // unknown future actions ke liye fallback

// ─── Screen Names ─────────────────────────────────────────────────────────────
export type EventScreen =
  | 'home'
  | 'bookings'
  | 'listing_detail'
  | 'booking_detail'
  | 'profile'
  | 'notifications'
  | 'analytics'
  | 'chat'
  | 'calendar'
  | (string & {});

// ─── Event Shape ──────────────────────────────────────────────────────────────
interface UserEvent {
  user_id: string | number;
  action: UserEventAction;
  screen: EventScreen;
  data?: Record<string, unknown>;
  timestamp: number; // epoch ms — Firestore ke serverTimestamp se replace hoga
  device: string;
  app_version: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────
class UserEventService {
  private appVersion: string = '0.0.0';

  init() {
    this.appVersion = DeviceInfo.getVersion();
  }

  async logEvent(
    action: UserEventAction,
    screen: EventScreen,
    data?: Record<string, unknown>,
  ): Promise<void> {
    const user = useAuthStore.getState().user;

    if (!user) return; // login nahi hai to log mat karo

    const event: UserEvent = {
      user_id: user.id,
      action,
      screen,
      ...(data !== undefined && { data }),
      timestamp: Date.now(),
      device: Platform.OS,
      app_version: this.appVersion || DeviceInfo.getVersion(),
    };

    // ── DEV: console mein dikhao ─────────────────────────────────────────────
    if (__DEV__) {
      console.log('[UserEvent]', JSON.stringify(event, null, 2));
    }

    try {
      await addDoc(collection(getFirestore(), 'user_events'), {
        ...event,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      if (__DEV__) {
        console.warn('[UserEvent] Failed to log event:', err);
      }
    }
  }
}

export const userEventService = new UserEventService();
