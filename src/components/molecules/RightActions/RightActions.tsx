import React from 'react';
import { View } from 'react-native';
import Reanimated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import { ChatMessage } from '@/types/chat';

interface RightActionsProps {
  item: ChatMessage;
  handleAction: (id: string, status: string) => void;
}

const RightActions: React.FC<RightActionsProps> = ({ item, handleAction }) => {
  // Optional animated effect (simple spring)
  const translateX = useSharedValue(0);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(translateX.value) }]
  }));

  return (
    <Reanimated.View style={[{ flexDirection: 'row', width: 160 }, style]}>
      <ButtonView
        style={{ flex: 1, backgroundColor: '#B0B5C1', justifyContent: 'center', alignItems: 'center' }}
        onPress={() => handleAction(item.id, 'Snoozed')}
      >
        <Svgicons path="snoozeIcon" size={24} color={Colors.WHITE} />
        <AppText text="Snooze" color={Colors.WHITE} fontSize={12} mt={5} type="Medium" />
      </ButtonView>
      <ButtonView
        style={{ flex: 1, backgroundColor: '#1A3D32', justifyContent: 'center', alignItems: 'center' }}
        onPress={() => handleAction(item.id, 'Archived')}
      >
        <Svgicons path="archiveIcon" size={24} color={Colors.WHITE} />
        <AppText text="Archive" color={Colors.WHITE} fontSize={12} mt={5} type="Medium" />
      </ButtonView>
    </Reanimated.View>
  );
};

export default RightActions;
