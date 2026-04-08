import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { processColor, StatusBar, View, StyleSheet, Linking } from 'react-native';
import StackNavigator from './src/navigation/StackNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/services/api';
import Toast, { BaseToastProps } from 'react-native-toast-message';
import { Colors } from '@/theme/colors';
import { navigationRef } from '@/services/navigationService';
import { CustomSuccessToast } from '@/components/molecules/CustomToast/CustomSuccessToast';
import { CustomErrorToast } from '@/components/molecules/CustomToast/CustomErrorToast';
import { MFSDK } from 'myfatoorah-reactnative';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import myFatoorahConfig, {
  validateConfig,
  getEnvironmentName,
  isProduction,
} from '@/config/myfatoorah.config';
import linking from '@/navigation/linkingConfig';
import { MenuProvider } from 'react-native-popup-menu';
import { configureGoogleSignIn } from '@/services/googleConfig';
import NavigationRoutes from './src/navigation/NavigationRoutes';
import SpinnerLoader from '@/components/molecules/SmallLoader';

const App = () => {
  const [isSDKInitialized, setIsSDKInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [safeAreaBg, setSafeAreaBg] = useState(Colors.BLACK); // Splash/Onboarding ke liye pehle BLACK

  useEffect(() => {
    initializeApp();
    configureGoogleSignIn();
  }, []);

  useEffect(() => {
    // App BAND tha, link se khula
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    // App BACKGROUND mein tha
    const sub = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => sub.remove();
  }, []);

  // ✅ NAYA — URL parse karke navigate karo
  const handleDeepLink = (url: string) => {
    try {
      const clean = url.replace('livedinapp://', 'https://x.com/');
      const parsed = new URL(clean);

      if (parsed.pathname.includes('signup')) {
        const params = {
          ref:   parsed.searchParams.get('ref')   || '',
          name:  parsed.searchParams.get('name')  || '',
          email: parsed.searchParams.get('email') || '',
          phone: parsed.searchParams.get('phone') || '',
        };

        // Thodi delay — navigation ready hone do
        setTimeout(() => {
          navigationRef.current?.navigate(
            NavigationRoutes.AUTH_STACK.CREATE_ACCOUNT as never,
            params as never,
          );
        }, 500);
      }
    } catch (e) {
      console.log('Deep link error:', e);
    }
  };

  const getActiveRouteName = (state: any): string => {
  const route = state.routes[state.index];

  if (route.state) {
    return getActiveRouteName(route.state);
  }

  return route.name;
};

 const handleNavigationStateChange = (state: any) => {
  try {
    const currentRouteName = getActiveRouteName(state);

    const onboardingRoute = NavigationRoutes.AUTH_STACK.ON_BOARDING;

    if (currentRouteName === onboardingRoute) {
      setSafeAreaBg(Colors.BLACK);
    } else {
      setSafeAreaBg(Colors.WHITE);
    }
  } catch (e) {}
};

  const initializeApp = async () => {
    try {
      const { isValid, errors } = validateConfig();

      if (!isValid) {
        console.error('❌ Configuration validation failed:', errors);
        throw new Error(`Configuration Error: ${errors.join(', ')}`);
      }

      await configureMyFatoorah();
      await setUpActionBar();

      setIsSDKInitialized(true);

      console.log('✅ App initialized successfully');
      console.log(`📱 Environment: ${getEnvironmentName()}`);
      console.log(`🌍 Country: Saudi Arabia`);
    } catch (error: any) {
      console.error('❌ App initialization failed:', error);
      setInitializationError(error.message || 'Initialization failed');
      setIsSDKInitialized(true);
    }
  };

  const configureMyFatoorah = async () => {
    try {
      const success = await MFSDK.init(
        myFatoorahConfig.apiKey,
        myFatoorahConfig.country,
        myFatoorahConfig.environment,
      );

      console.log('✅ MyFatoorah SDK initialized:', success);

      if (isProduction() && __DEV__) {
        console.warn('⚠️ WARNING: Using PRODUCTION environment in development mode!');
      }

      return success;
    } catch (error: any) {
      console.error('❌ MyFatoorah SDK initialization error:', error);
      throw new Error('Failed to initialize payment system');
    }
  };

  const setUpActionBar = async () => {
    try {
      const success = await MFSDK.setUpActionBar(
        myFatoorahConfig.actionBarTitle,
        processColor(myFatoorahConfig.actionBarTitleColor),
        processColor(myFatoorahConfig.actionBarBackgroundColor),
        true,
      );

      console.log('✅ MyFatoorah ActionBar configured:', success);
      return success;
    } catch (error: any) {
      console.error('⚠️ ActionBar setup error:', error);
      return null;
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
    console.warn('⚠️ Payment system may not work properly:', initializationError);
  }

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Colors.WHITE,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <KeyboardProvider>
            <BottomSheetModalProvider>
              <NavigationContainer
                ref={navigationRef}
                theme={MyTheme}
                linking={linking}
                onStateChange={handleNavigationStateChange} // ✅ route change listener
              >
                <SafeAreaView style={{ flex: 1, backgroundColor: safeAreaBg }}>
                  {/* ✅ dynamic background */}
                  <StatusBar
                    barStyle={safeAreaBg === Colors.BLACK ? 'light-content' : 'dark-content'}
                    backgroundColor={safeAreaBg} // ✅ Android ke liye
                    translucent={safeAreaBg === Colors.BLACK} // ✅ Onboarding par translucent
                  />
                  <MenuProvider skipInstanceCheck>
                    <StackNavigator />
                  </MenuProvider>
                  <Toast config={toastConfig} />
                </SafeAreaView>
              </NavigationContainer>
            </BottomSheetModalProvider>
          </KeyboardProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
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