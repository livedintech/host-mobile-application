import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import { useNavigation } from '@react-navigation/native';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

const NoChatScreen = () => {
  const navigation = useNavigation<any>();

  const handleNavigate = () => {
    // navigate(NavigationRoutes.APP_STACK.LISTING)
  };

  return (
    <View style={styles.container}>
      <AppText
        text="No Messages Found"
        type="Bold"
        fontSize={28}
        textAlign="center"
        color={Colors.BLACK}
        mb={16}
      />
      
      <AppText
        text="Create a new listing or import one from your OTA platform to get started."
        fontSize={14}
        textAlign="center"
        color={Colors.DARK_CHARCOAL_OPACITY}
        px={40}
        mb={40}
        lineHeight={22}
      />

      <AppButton
        title="Add New Listing"
        backgroundColor="transparent"
        borderColor={Colors.WHITE_OPACITY_60}
        color={Colors.MIDNIGHT}
        onPress={handleNavigate}
        mx={40}
        mb={15}
        type="SemiBold"
      />

      <AppButton
        title="Create New Listing"
        backgroundColor={Colors.TEAL_PRIMARY_ALT}
        borderColor={Colors.TEAL_PRIMARY_ALT}
        onPress={handleNavigate}
        mx={40}
        type="SemiBold"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    paddingHorizontal: Metrics.scale(20),
  },
});

export default NoChatScreen;