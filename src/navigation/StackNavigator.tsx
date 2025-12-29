import React, { useEffect, useState } from 'react';
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
    }, 3000); // 3 seconds tak splash dikhayein

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return isLoggedIn ? <AppStack /> : <AuthStack />;
};

export default StackNavigator;