import React from 'react';
import { View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import UserForm from '../components/UserForm';
import NavigationRoutes from '@/navigation/NavigationRoutes';

type UserFormRouteParams = {
  mode: 'create' | 'edit';
  userId?: string;
};

const UserFormScreen = () => {
  const route = useRoute<RouteProp<
    Record<string, UserFormRouteParams>,
    typeof NavigationRoutes.APP_STACK.USER_MANAGEMENT_FORM
  >>();

  const { mode, userId } = route.params ?? {};

  console.log('mode from route:', mode);

  return <UserForm mode={mode} userId={userId} />;
};

export default UserFormScreen;
