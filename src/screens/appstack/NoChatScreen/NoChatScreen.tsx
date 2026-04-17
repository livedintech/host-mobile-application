import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
interface Props {
  showFirstButton?: boolean;
  showSecondButton?: boolean;
  descriptionText?: string;
  headingText?: string;

}

const NoChatScreen = ({
  showFirstButton,
  showSecondButton,
  headingText,
  descriptionText,
}: Props) => {

  const handleNavigate = useCallback(() => {
    console.log('');

  }, []);

  return (
    <View style={styles.container}>
      {headingText && (
        <AppText
          text={headingText}
          type="Bold"
          fontSize={28}
          textAlign="center"
          color={Colors.BLACK}
          mb={16}
        />
      )}
      {descriptionText && (
        <AppText
          text={descriptionText}
          fontSize={14}
          textAlign="center"
          color={Colors.DARK_CHARCOAL_OPACITY}
          px={40}
          mb={40}
          lineHeight={22}
        />
      )}

      {/* {showFirstButton && (

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
      )}
      {showSecondButton && (
        <AppButton
          title="Create New Listing"
          backgroundColor={Colors.TEAL_PRIMARY_ALT}
          borderColor={Colors.TEAL_PRIMARY_ALT}
          onPress={handleNavigate}
          mx={40}
          type="SemiBold"
        />
      )} */}
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