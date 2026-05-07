import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AppStack from './AppStack';
import { useAuthStore } from '@/store/useAuthStore';
import AuthStack from './AuthStack';
import SplashScreen from '@/screens/splash/SplashScreen';

const StackNavigator = () => {
  const { isLoggedIn } = useAuthStore();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoggedIn ? <AppStack /> : <AuthStack />}
      {showSplash && (
        <View style={StyleSheet.absoluteFill}>
          <SplashScreen />
        </View>
      )}
    </>
  );
};

export default StackNavigator;
