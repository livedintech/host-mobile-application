import { View, Text } from 'react-native';
import React from 'react';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

const NoTaskContainer = () => {
  const handleCreateTask = () => {
    navigate(NavigationRoutes.APP_STACK.CREATE_TASK);
  };
  return {
    handleCreateTask,
  };
};

export default NoTaskContainer;
