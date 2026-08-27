jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  return {
    GestureHandlerRootView: ({ children }) => children,
    Swipeable: ({ children }) => children,
    State: {},
    PanGestureHandler: ({ children }) => children,
  };
});

jest.mock('react-native-mmkv', () => ({
  createMMKV: jest.fn(() => ({
    getString: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
    clearAll: jest.fn(),
  })),
}));

jest.mock('@/store/useAuthStore', () => ({
  useAuthStore: Object.assign(
    jest.fn(() => ({ isLoggedIn: true, token: 't', user: { id: 1 } })),
    { getState: jest.fn(() => ({ isLoggedIn: true })) },
  ),
}));

jest.mock('@/store/useCreateListingStore', () => ({
  useCreateListingStore: {
    getState: jest.fn(() => ({ setListingId: jest.fn() })),
  },
}));

jest.mock('@react-native-firebase/messaging', () => ({
  getMessaging: jest.fn(() => ({})),
  getToken: jest.fn(async () => 'test-token'),
  onTokenRefresh: jest.fn(() => jest.fn()),
  deleteToken: jest.fn(async () => undefined),
  onMessage: jest.fn(() => jest.fn()),
  onNotificationOpenedApp: jest.fn(() => jest.fn()),
  getInitialNotification: jest.fn(async () => null),
  requestPermission: jest.fn(async () => 1),
  hasPermission: jest.fn(async () => 1),
  AuthorizationStatus: { AUTHORIZED: 1, PROVISIONAL: 2 },
}));

jest.mock('@react-native-firebase/crashlytics', () => () => ({
  log: jest.fn(),
  recordError: jest.fn(),
  setUserId: jest.fn(),
}));

jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    setBadgeCount: jest.fn(),
    decrementBadgeCount: jest.fn(),
    getBadgeCount: jest.fn(async () => 0),
    createChannel: jest.fn(async () => 'default'),
    displayNotification: jest.fn(),
    onForegroundEvent: jest.fn(),
    getInitialNotification: jest.fn(async () => null),
  },
  AndroidImportance: { HIGH: 4 },
  EventType: { PRESS: 1 },
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: { configure: jest.fn() },
}));

jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(() => '1.0.0'),
  getBuildNumber: jest.fn(() => '1'),
}));

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
}));

jest.mock('react-native-keyboard-controller', () => ({
  KeyboardProvider: ({ children }) => children,
}));

jest.mock('@/services/crashlytics.service', () => ({
  CrashlyticsService: {
    init: jest.fn(async () => undefined),
    log: jest.fn(),
    recordError: jest.fn(),
    setUserId: jest.fn(),
  },
}));

jest.mock('@/services/userEventService', () => ({
  userEventService: {
    init: jest.fn(async () => undefined),
    logEvent: jest.fn(),
  },
}));

jest.mock('@/services/googleConfig', () => ({
  configureGoogleSignIn: jest.fn(),
}));

jest.mock('@/components/molecules/AppUpdateCheck/AppUpdateCheck', () => () => null);
jest.mock('@/components/molecules/NoInternet/NoInternet', () => () => null);
jest.mock('@/components/molecules/AirbnbExportPopup/AirbnbExportPopup', () => {
  const React = require('react');
  return React.forwardRef(() => null);
});
