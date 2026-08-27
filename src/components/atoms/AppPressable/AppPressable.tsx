import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import { navigationRef } from '@/services/navigationService';
import { userEventService } from '@/services/userEventService';

const AppPressable = ({ onPress, ...props }: PressableProps) => {
  const handlePress = (e: any) => {
    if (onPress) {
      const currentScreen = navigationRef.current?.getCurrentRoute()?.name;
      if (currentScreen) {
        userEventService.logEvent('button_tap', currentScreen);
      }
      onPress(e);
    }
  };

  return <Pressable {...props} onPress={handlePress} />;
};

export default AppPressable;
