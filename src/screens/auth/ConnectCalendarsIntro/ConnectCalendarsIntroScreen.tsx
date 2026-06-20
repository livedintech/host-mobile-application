import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import AppImage from '@/components/atoms/AppImage/AppImage';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Pagination from '@/components/molecules/Pagination/Pagination';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { s, vs } from 'react-native-size-matters';
import { Colors } from '@/theme/colors';
import { useTranslation } from 'react-i18next';

const ConnectCalendarsIntroScreen = () => {
  const { t } = useTranslation();
  const getStarted = useCallback(() => {
    navigate(NavigationRoutes.AUTH_STACK.AGENT_INTRO);
  }, []);

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      {/* SafeAreaView ensures content doesn't hit the notch/status bar */}
      <SafeAreaView style={styles.container}>
        <View style={styles.mainContent}>

          {/* Calendar Card Area - Reduced height slightly to fit all screens */}
          <View style={styles.cardContainer}>
            <AppImage
              source={require('@/assets/img/calendar_view.png')}
              style={styles.img}
              resizeMode="contain"
            />
          </View>

          <View style={styles.titleSection}>
            <AppText
              text={t('auth.connect_calendars.title_1')}
              fontSize={26}
              type="Regular"
              textAlign="center"
              color="#000000"
            />
            <AppText
              text={t('auth.connect_calendars.title_2')}
              fontSize={26}
              type="Regular"
              textAlign="center"
              color="#000000"
              mt={-5}
            />
            <AppText
              text={t('auth.connect_calendars.title_3')}
              fontSize={26}
              type="SemiBold"
              color={Colors.PRIMARY_TEAL}
              textAlign="center"
              mt={-5}
            />

            <AppText
              text={t('auth.connect_calendars.description')}
              textAlign="center"
              color="#1c1c1c"
              mt={vs(20)}
              fontSize={15}
              lineHeight={17}
              type='Regular'
            />
          </View>

          {/* Footer Action Area */}
          <View style={styles.footer}>
            <AppButton
              title={t('auth.connect_calendars.connect_account')}
              onPress={getStarted}
              style={styles.connectBtn}
              color="#FFFFFF" 
              type="Bold"
            />
            <Pagination activeIndex={1} />
          </View>

        </View>
      </SafeAreaView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'space-around', // Distributes space between components
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: vs(5),
  },
  arrowCircleInner: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: Colors.WHITE, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  cardContainer: { 
    alignItems: 'center',
    height: vs(210), // Reduced slightly to create more gap for text
    width: '100%',
    marginVertical: vs(10),
  },
  img: { 
    width: '100%', 
    height: '100%' 
  },
  titleSection: { 
    alignItems: 'center',
    width: '100%',
    marginVertical: vs(15),
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    marginTop: vs(10),
  },
  connectBtn: {
    backgroundColor: '#21AA8F',
    borderRadius: 100,
    width: s(240),
    height: vs(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    marginBottom: vs(20),
  },
});
export default ConnectCalendarsIntroScreen;