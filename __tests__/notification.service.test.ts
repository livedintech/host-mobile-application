jest.mock('@/services/navigationService', () => ({
  navigate: jest.fn(),
  navigationRef: { current: { isReady: jest.fn(() => true) } },
}));

import NavigationRoutes from '@/navigation/NavigationRoutes';
import {
  navigateFromNotificationPayload,
  parseNotificationPayload,
} from '@/services/notification.service';
import { navigate } from '@/services/navigationService';
import { useCreateListingStore } from '@/store/useCreateListingStore';
import { CrashlyticsService } from '@/services/crashlytics.service';

describe('parseNotificationPayload', () => {
  it('returns null for missing data', () => {
    expect(parseNotificationPayload(null)).toBeNull();
    expect(parseNotificationPayload(undefined)).toBeNull();
  });

  it('returns null when type is missing', () => {
    expect(parseNotificationPayload({ id: '1' })).toBeNull();
  });

  it('parses type from type field', () => {
    expect(parseNotificationPayload({ type: 'booking', id: '9' })).toEqual({
      type: 'booking',
      id: '9',
    });
  });

  it('falls back to notification_type', () => {
    expect(
      parseNotificationPayload({ notification_type: 'task_update', id: '42' }),
    ).toEqual({ type: 'task_update', id: '42' });
  });
});

describe('navigateFromNotificationPayload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const cases: Array<{
    type: string;
    id?: string;
    route: string;
    params?: object;
  }> = [
    { type: 'booking', route: NavigationRoutes.APP_STACK.RESERVATION_CALENDAR },
    {
      type: 'direct_booking_received',
      id: '10',
      route: NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_DETAIL_SCREEN,
      params: { booking_id: 'L10' },
    },
    {
      type: 'booking_detail',
      id: '20',
      route: NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_DETAIL_SCREEN,
      params: { booking_id: 'O20' },
    },
    {
      type: 'booking_request',
      route: NavigationRoutes.APP_STACK.RESERVATION_CALENDAR,
      params: { activeFilter: 'booking_request' },
    },
    {
      type: 'chats_view',
      id: 'abc',
      route: NavigationRoutes.APP_STACK.CHAT_DETAIL,
      params: { conversation_id: 'abc' },
    },
    {
      type: 'task_update',
      id: '7',
      route: NavigationRoutes.APP_STACK.EDIT_TASK,
      params: { taskId: '7' },
    },
    {
      type: 'smart_lock',
      route: NavigationRoutes.APP_STACK.ACTIVE_CODES,
    },
    {
      type: 'review_recieved',
      id: '55',
      route: NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_DETAIL_SCREEN,
      params: { reviewId: '55', showActionSheet: true },
    },
    {
      type: 'profile_updated',
      route: NavigationRoutes.APP_STACK.PROFILE_SETTING,
    },
    {
      type: 'listing_added',
      id: '99',
      route: NavigationRoutes.APP_STACK.PROPERTY_DETAIL,
    },
    {
      type: 'user_invited',
      route: NavigationRoutes.APP_STACK.USER_MANAGEMENT,
    },
  ];

  it.each(cases)('navigates for $type', ({ type, id, route, params }) => {
    navigateFromNotificationPayload({ type, id });
    if (params) {
      expect(navigate).toHaveBeenCalledWith(route, params);
    } else {
      expect(navigate).toHaveBeenCalledWith(route);
    }
  });

  it('does not navigate for payment_received (removed billing screen)', () => {
    navigateFromNotificationPayload({ type: 'payment_received', id: '1' });
    expect(navigate).not.toHaveBeenCalled();
  });

  it('does not crash for unknown notification type', () => {
    expect(() =>
      navigateFromNotificationPayload({ type: 'totally_unknown_type' }),
    ).not.toThrow();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('does not crash when listing id is missing', () => {
    expect(() =>
      navigateFromNotificationPayload({ type: 'listing_added' }),
    ).not.toThrow();
    expect(navigate).toHaveBeenCalledWith(
      NavigationRoutes.APP_STACK.PROPERTY_DETAIL,
    );
  });

  it('sets listing id when present', () => {
    const setListingId = jest.fn();
    (useCreateListingStore.getState as jest.Mock).mockReturnValue({ setListingId });

    navigateFromNotificationPayload({ type: 'listing_mapped', id: '123' });

    expect(setListingId).toHaveBeenCalledWith('123');
  });

  it('records crashlytics error if navigation throws', () => {
    (navigate as jest.Mock).mockImplementationOnce(() => {
      throw new Error('navigation failed');
    });

    navigateFromNotificationPayload({ type: 'booking' });

    expect(CrashlyticsService.recordError).toHaveBeenCalled();
  });
});
