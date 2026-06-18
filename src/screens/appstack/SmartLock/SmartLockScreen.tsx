import React from 'react';
import { StyleSheet, View } from 'react-native';
import { vs, s, ms } from 'react-native-size-matters';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import { useTranslation } from 'react-i18next';
import BGImage from '@/components/molecules/BGImage/BGImage';

const SmartLockScreen = () => {
  const { t } = useTranslation();

  const handleConnectAccount = () => {
    navigate(NavigationRoutes.APP_STACK.TT_LOCK_CREDENTIALS);
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>

    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Svgicons path="noTTLockScreen" size={320} />
        </View>

        <AppText
          text={t('app.smart_lock.title')}
          fontSize={32}
          type="Bold"
          color={Colors.BLACK}
          textAlign="center"
          mb={vs(10)}
        />

        <AppText
          text={t('app.smart_lock.description')}
          fontSize={16}
          color={Colors.SUPER_GREY}
          textAlign="center"
          lineHeight={24}
        />
      </View>

      <AppButton
        title={t('app.smart_lock.connect_btn')}
        backgroundColor={Colors.PRIMARY_TEAL}
        borderColor={Colors.PRIMARY_TEAL}
        color={Colors.WHITE}
        borderRadius={ms(25)}
        onPress={handleConnectAccount}
      />
    </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: s(30),
    paddingBottom: vs(40),
    paddingTop: vs(40),
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageContainer: {
    marginBottom: vs(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SmartLockScreen;