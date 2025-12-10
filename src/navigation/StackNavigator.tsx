import React, { useEffect } from 'react';
import AppStack from './AppStack';
import { useAuthStore } from '@/store/useAuthStore';
import AuthStack from './AuthStack';

const StackNavigator = () => {
  const { isLoggedIn, user, setUser } = useAuthStore();
  
//   const shouldFetchUser = isLoggedIn && !user;
//   const { currentUser } = useStartupContainer(shouldFetchUser);

//   useEffect(() => {
//     if (currentUser?.user && !user) {
//       setUser(currentUser.user);
//     }
//   }, [currentUser, user, setUser]);

  return isLoggedIn ? <AppStack /> : <AuthStack />;
};

export default StackNavigator;