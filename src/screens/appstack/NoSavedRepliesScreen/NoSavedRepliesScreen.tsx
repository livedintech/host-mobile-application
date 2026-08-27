import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Metrics from '@/utility/Metrics';
import { useTranslation } from 'react-i18next';

interface NoSavedRepliesProps {
  onCreatePress: () => void;
}

const NoSavedRepliesScreen = ({ onCreatePress }: NoSavedRepliesProps) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Fallback Illustration using Svgicons */}
        <Svgicons 
          path="noSavedReplies" 
          width={280} 
          height={240} 
          mb={30} 
        />

        {/* Title */}
        <AppText
          text={t('app.no_saved_replies.title')}
          fontSize={28}
          type="Bold"
          textAlign="center"
          color={Colors.BLACK}
          mb={15}
        />

        {/* Description */}
        <AppText
          text={t('app.no_saved_replies.description')}
          fontSize={16}
          textAlign="center"
          color={Colors.DARK_CHARCOAL_OPACITY}
          px={50}
          lineHeight={18}
        />
      </View>

      {/* Footer Action Button */}
      {/* <View style={styles.footer}>
        <AppButton
          title="Create New Saved Reply"
          backgroundColor={Colors.TEAL_PRIMARY_ALT}
          borderColor={Colors.TEAL_PRIMARY_ALT}
          onPress={onCreatePress}
        />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Ensure it fills the available height in the FlatListHandler
    minHeight: Metrics.screenHeight * 0.7, 
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Metrics.verticalScale(40),
  },
  footer: {
    paddingHorizontal: Metrics.scale(22),
    paddingBottom: Metrics.verticalScale(20),
  },
});

export default NoSavedRepliesScreen;