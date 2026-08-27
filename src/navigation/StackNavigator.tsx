import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AppStack from './AppStack';
import { useAuthStore } from '@/store/useAuthStore';
import AuthStack from './AuthStack';
import SplashScreen from '@/screens/splash/SplashScreen';
import NavigationRoutes from './NavigationRoutes';

const StackNavigator = () => {
  const { isLoggedIn, user } = useAuthStore();
  const [showSplash, setShowSplash] = useState(true);

  // const isPendingPayment = isLoggedIn && user?.sub_plan_id === null;
  // const appInitialRoute = isPendingPayment
  //   ? NavigationRoutes.APP_STACK.PAYMENT
  //   : NavigationRoutes.APP_STACK.ROOT_STACK;

  const appInitialRoute = NavigationRoutes.APP_STACK.ROOT_STACK

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoggedIn
        ? <AppStack key={appInitialRoute} initialRouteName={appInitialRoute} />
        : <AuthStack />}
      {showSplash && (
        <View style={StyleSheet.absoluteFill}>
          <SplashScreen />
        </View>
      )}
    </>
  );
};

export default StackNavigator;
