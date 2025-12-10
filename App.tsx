import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import StackNavigator from './src/navigation/StackNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/services/api';
import Toast, { BaseToastProps } from 'react-native-toast-message';
import { Colors } from '@/theme/colors';
import { navigationRef } from '@/services/navigationService';
import { CustomSuccessToast } from '@/components/molecules/CustomToast/CustomSuccessToast';
import { CustomErrorToast } from '@/components/molecules/CustomToast/CustomErrorToast';

const App = () => {
  const toastConfig = {
    success: (props: BaseToastProps) => (
      <CustomSuccessToast {...props} />
    ),
    error: (props: BaseToastProps) => (
      <CustomErrorToast {...props} />
    ),
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer ref={navigationRef}>
            <SafeAreaView style={{ flex: 1 }}>
              <StatusBar
                barStyle={'dark-content'}
                backgroundColor={Colors.WHITE}
              />
              <StackNavigator />
              <Toast config={toastConfig} />
            </SafeAreaView>
          </NavigationContainer>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
