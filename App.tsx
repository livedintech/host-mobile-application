import 'react-native-gesture-handler';
import React, { useEffect, useRef, useState } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  StatusBar,
  View,
  StyleSheet,
  AppState,
  AppStateStatus,
  BackHandler,
} from 'react-native';
import StackNavigator from './src/navigation/StackNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/services/api';
import Toast, { BaseToastProps } from 'react-native-toast-message';
import { Colors } from '@/theme/colors';
import { navigationRef } from '@/services/navigationService';
import { CustomSuccessToast } from '@/components/molecules/CustomToast/CustomSuccessToast';
import { CustomErrorToast } from '@/components/molecules/CustomToast/CustomErrorToast';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import linking from '@/navigation/linkingConfig';
import { MenuProvider } from 'react-native-popup-menu';
import { configureGoogleSignIn } from '@/services/googleConfig';
import NavigationRoutes from './src/navigation/NavigationRoutes';
import SpinnerLoader from '@/components/molecules/SmallLoader';
import AppUpdateCheck from '@/components/molecules/AppUpdateCheck/AppUpdateCheck';
import NoInternet from '@/components/molecules/NoInternet/NoInternet';
import i18n from '@/locales/i18n/i18n';
import { I18nextProvider } from 'react-i18next';
import { NotificationService } from '@/services/notification.service';
import { CrashlyticsService } from '@/services/crashlytics.service';
import { userEventService } from '@/services/userEventService';
import AirbnbExportPopup from '@/components/molecules/AirbnbExportPopup/AirbnbExportPopup';
import { airbnbExportPopupRef } from '@/services/airbnbExportPopupService';

const App = () => {
  const [isSDKInitialized, setIsSDKInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(
    null,
  );
  const [safeAreaBg, setSafeAreaBg] = useState(Colors.WHITE);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const navStateRef = useRef<any>(null);

  useEffect(() => {
    const bootstrap = async () => {
      await CrashlyticsService.init();
      CrashlyticsService.log('App Started');

      await initializeApp();
      configureGoogleSignIn();

      const token = await setupNotifications();
      if (token)
        CrashlyticsService.log(
          `FCM Token registered: ${token.slice(0, 20)}...`,
        );

      userEventService.logEvent('app_open', 'app');
    };

    bootstrap();

    const subscription = AppState.addEventListener(
      'change',
      (nextState: AppStateStatus) => {
        if (appState.current === 'active' && nextState === 'background') {
          userEventService.logEvent('app_background', 'app');
          CrashlyticsService.log('App moved to background');
        } else if (appState.current !== 'active' && nextState === 'active') {
          userEventService.logEvent('app_open', 'app');
          CrashlyticsService.log('App resumed to foreground');
        }
        appState.current = nextState;
      },
    );

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (navigationRef.current?.canGoBack()) {
          navigationRef.current?.goBack();
          return true;
        }
        return false;
      },
    );

    return () => {
      subscription.remove();
      backHandler.remove();
    };
  }, []);

  const setupNotifications = async (): Promise<string | null> => {
    await NotificationService.requestUserPermission();
    await NotificationService.createNotificationListeners();
    const token = await NotificationService.getToken();
    console.log('🔔 FCM Token:', token);
    return token;
  };

  const getActiveRouteName = (state: any): string => {
    const route = state.routes[state.index];

    if (route.state) {
      return getActiveRouteName(route.state);
    }

    return route.name;
  };

  const handleNavigationStateChange = (state: any) => {
    navStateRef.current = state;

    try {
      const currentRouteName = getActiveRouteName(state);

      const onboardingRoute = NavigationRoutes.AUTH_STACK.ON_BOARDING;

      if (currentRouteName === onboardingRoute) {
        setSafeAreaBg(Colors.GRAY_HINT);
      } else {
        setSafeAreaBg(Colors.WHITE);
      }

      if (currentRouteName) {
        CrashlyticsService.log(`Screen opened: ${currentRouteName}`);

        userEventService.logEvent('screen_view', currentRouteName);
      }
    } catch (e) {
      CrashlyticsService.recordError(e as Error, 'NavigationStateChangeError');
    }
  };

  const initializeApp = async () => {
    try {
      await userEventService.init();
      setIsSDKInitialized(true);
      console.log('✅ App initialized successfully');
    } catch (error: any) {
      console.error('❌ App initialization failed:', error);
      CrashlyticsService.recordError(error, 'AppInitializationError');
      setInitializationError(error.message || 'Initialization failed');
      setIsSDKInitialized(true);
    }
  };

  const toastConfig = {
    success: (props: BaseToastProps) => <CustomSuccessToast {...props} />,
    error: (props: BaseToastProps) => <CustomErrorToast {...props} />,
  };

  if (!isSDKInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <SpinnerLoader size={'large'} />
      </View>
    );
  }

  if (initializationError) {
    console.warn('⚠️ App initialization warning:', initializationError);
  }

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Colors.WHITE,
    },
  };

  return (
    <I18nextProvider i18n={i18n}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <KeyboardProvider>
              <BottomSheetModalProvider>
                <NavigationContainer
                  ref={navigationRef}
                  theme={MyTheme}
                  linking={linking}
                  onReady={() => {
                    const state = navigationRef.current?.getRootState();
                    navStateRef.current = state ?? null;

                    // Sync safe area color on first load
                    if (state) {
                      const currentRouteName = getActiveRouteName(state);
                      setSafeAreaBg(
                        currentRouteName ===
                          NavigationRoutes.AUTH_STACK.ON_BOARDING
                          ? Colors.GRAY_HINT
                          : Colors.WHITE,
                      );
                    }
                  }}
                  onStateChange={handleNavigationStateChange}
                >
                  <SafeAreaView
                    style={{ flex: 1, backgroundColor: safeAreaBg }}
                  >
                    <StatusBar
                      barStyle={
                        safeAreaBg === Colors.BLACK
                          ? 'light-content'
                          : 'dark-content'
                      }
                      backgroundColor={safeAreaBg}
                      translucent={safeAreaBg === Colors.BLACK}
                    />
                    <MenuProvider skipInstanceCheck>
                      <StackNavigator />
                      <AppUpdateCheck />
                    </MenuProvider>
                    <Toast config={toastConfig} />
                    <AirbnbExportPopup ref={airbnbExportPopupRef} />
                    <NoInternet />
                  </SafeAreaView>
                </NavigationContainer>
              </BottomSheetModalProvider>
            </KeyboardProvider>
          </QueryClientProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </I18nextProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE || '#FFFFFF',
  },
});

export default App;
