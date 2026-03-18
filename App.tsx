import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  processColor,
  StatusBar,
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
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
import { MFSDK } from 'myfatoorah-reactnative';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

// Import MyFatoorah configuration
import myFatoorahConfig, {
  validateConfig,
  getEnvironmentName,
  isProduction,
} from '@/config/myfatoorah.config';
import linking from '@/navigation/linkingConfig';
import { MenuProvider } from 'react-native-popup-menu';
import { configureGoogleSignIn } from '@/services/googleConfig';

const App = () => {
  const [isSDKInitialized, setIsSDKInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    initializeApp();
    configureGoogleSignIn();
  }, []);

  const initializeApp = async () => {
    try {
      // Validate configuration first
      const { isValid, errors } = validateConfig();

      if (!isValid) {
        console.error('❌ Configuration validation failed:', errors);
        throw new Error(`Configuration Error: ${errors.join(', ')}`);
      }

      // Initialize MyFatoorah SDK
      await configureMyFatoorah();

      // Setup ActionBar (optional)
      await setUpActionBar();

      setIsSDKInitialized(true);

      console.log('✅ App initialized successfully');
      console.log(`📱 Environment: ${getEnvironmentName()}`);
      console.log(`🌍 Country: Saudi Arabia`);
    } catch (error: any) {
      console.error('❌ App initialization failed:', error);
      setInitializationError(error.message || 'Initialization failed');
      // Allow app to load even if payment SDK fails
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

      // Warn if using production in development
      if (isProduction() && __DEV__) {
        console.warn(
          '⚠️ WARNING: Using PRODUCTION environment in development mode!',
        );
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
        true, // Show back button
      );

      console.log('✅ MyFatoorah ActionBar configured:', success);
      return success;
    } catch (error: any) {
      console.error('⚠️ ActionBar setup error:', error);
      // ActionBar is optional, don't throw error
      return null;
    }
  };

  const toastConfig = {
    success: (props: BaseToastProps) => <CustomSuccessToast {...props} />,
    error: (props: BaseToastProps) => <CustomErrorToast {...props} />,
  };

  // Loading screen while initializing
  if (!isSDKInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={Colors.INDIAN_RED || '#FF0000'}
        />
      </View>
    );
  }

  // Show warning if initialization failed
  if (initializationError) {
    console.warn(
      '⚠️ Payment system may not work properly:',
      initializationError,
    );
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
      <BottomSheetModalProvider>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer
              ref={navigationRef}
              theme={MyTheme}
              linking={linking}
            >
              <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
                <StatusBar
                  barStyle="dark-content"
                  backgroundColor={Colors.WHITE}
                />
                <MenuProvider skipInstanceCheck>
                  <StackNavigator />
                </MenuProvider>
                <Toast config={toastConfig} />
              </SafeAreaView>
            </NavigationContainer>
          </QueryClientProvider>
        </SafeAreaProvider>
      </BottomSheetModalProvider>
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
