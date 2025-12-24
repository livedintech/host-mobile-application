import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { processColor, StatusBar } from 'react-native';
import StackNavigator from './src/navigation/StackNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/services/api';
import Toast, { BaseToastProps } from 'react-native-toast-message';
import { Colors } from '@/theme/colors';
import { navigationRef } from '@/services/navigationService';
import { CustomSuccessToast } from '@/components/molecules/CustomToast/CustomSuccessToast';
import { CustomErrorToast } from '@/components/molecules/CustomToast/CustomErrorToast';
import { MFCountry, MFEnvironment, MFSDK } from 'myfatoorah-reactnative';
import { MY_FATOORAH_API } from '@env';



const App = () => {

   useEffect(() => {
    configure();
    setUpActionBar();
  }, []);
  
  const toastConfig = {
    success: (props: BaseToastProps) => (
      <CustomSuccessToast {...props} />
    ),
    error: (props: BaseToastProps) => (
      <CustomErrorToast {...props} />
    ),
  };
   const configure = async () => {
    await MFSDK.init(MY_FATOORAH_API, MFCountry.SAUDIARABIA, MFEnvironment.LIVE)
      .then(success => console.log(success))
      .catch(error => console.log(error));
  };
  const setUpActionBar = async () => {
    await MFSDK.setUpActionBar(
      'My App Payments',
      processColor('#FFFFFF'),
      processColor('#000000'),
      true,
    )
      .then(success => console.log(success))
      .catch(error => console.log(error));
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
