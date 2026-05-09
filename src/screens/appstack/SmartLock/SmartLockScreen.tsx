import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { useTranslation } from 'react-i18next';

const SmartLockScreen = () => {
  const { t } = useTranslation();
  const handleConnectAccount = () => {
    navigate(NavigationRoutes.APP_STACK.TT_LOCK_CREDENTIALS);
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Main Illustration using the requested path */}
          <View style={styles.svgContainer}>
            <Svgicons path="noTTLockScreen" size={Metrics.scale(320)} />
          </View>

          {/* Title - Updated to Black per design */}
          <AppText
            text={t('app.smart_lock.title')}
            fontSize={32}
            type="Bold"
            color={Colors.BLACK}
            textAlign="center"
            mb={15}
          />

          {/* Subtitle - Grayish text with specific line height */}
          <AppText
            text={t('app.smart_lock.description')}
            fontSize={16}
            color={Colors.SUPER_GREY}
            textAlign="center"
            lineHeight={24}
            style={styles.subtitle}
          />
        </View>

        {/* Footer Button - Fixed at bottom */}
        <View style={styles.footer}>
          <AppButton
            title={t('app.smart_lock.connect_btn')}
            onPress={handleConnectAccount}
            backgroundColor={Colors.PRIMARY_TEAL}
            color={Colors.WHITE}
            borderRadius={25}
          />
        </View>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Metrics.scale(25),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Metrics.verticalScale(80), // Offset to keep illustration centered
  },
  svgContainer: {
    marginBottom: Metrics.verticalScale(40),
  },
  subtitle: {
    paddingHorizontal: Metrics.scale(20),
  },
  footer: {
    marginBottom: Metrics.verticalScale(40),
  },
});

export default SmartLockScreen;