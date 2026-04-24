import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { s, vs } from 'react-native-size-matters';

import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { Colors } from '@/theme/colors';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { useTranslation } from 'react-i18next';

const FIGMA_TEAL = '#09A389';

const ThankYouScreen = () => {
  const { t } = useTranslation();
  const handleClose = () => {
    navigate(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE)
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <SafeAreaView style={styles.container}>
        
        {/* --- Central Content --- */}
        <View style={styles.content}>
          
          <View style={styles.starIcon}>
             <Svgicons path="hubspot_thanks" size={100} />
          </View>

          <AppText type="Bold" fontSize={32} color={Colors.BLACK} textAlign="center" lineHeight={40}>
            {t('auth.hubspot_thankyou.message_1')}{'\n'}
            {t('auth.hubspot_thankyou.will')} <AppText type="Bold" fontSize={32} color={FIGMA_TEAL}>{t('auth.hubspot_thankyou.highlight')}</AppText>{'\n'}
            {t('auth.hubspot_thankyou.message_2')}
          </AppText>
        </View>

        {/* --- Footer Button --- */}
        <View style={styles.btnWrapper}>
          <AppButton
            title={t('auth.hubspot_thankyou.close')}
            onPress={handleClose}
            backgroundColor={FIGMA_TEAL}
            color={Colors.WHITE}
            borderRadius={100}
            type="Bold"
            fontSize={18}
          />
        </View>
      </SafeAreaView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(24),
  },
  starIcon: {
    marginBottom: vs(20),
    height: vs(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnWrapper: {
    paddingHorizontal: s(24),
    paddingBottom: vs(40),
  },
});

export default ThankYouScreen;