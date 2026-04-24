import React, { useCallback } from 'react';
import { StyleSheet, View, ScrollView, Image, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Pagination from '@/components/molecules/Pagination/Pagination';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { s, vs } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';

const AgentIntroScreen = () => {
  const { t } = useTranslation();
  const goToLoginViaPhoneNumber = useCallback(() => {
    navigate(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE);
  }, []);

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* --- ADDED BACK BUTTON --- */}
          {/* <View style={styles.headerRow}>
            <GradientBorder borderRadius={16} borderWidth={1} style={styles.arrowCircleInner} >
              <Pressable style={styles.arrowCircleInner} onPress={() => goBack()}>
                <Svgicons path='arrowLeftIcon' size={24} />
              </Pressable>
            </GradientBorder>
          </View> */}
          {/* ------------------------ */}

          {/* Title Section */}
          <View style={[styles.introSection, { alignItems: 'flex-start' }]}>
            <View style={styles.titleRow}>
              <AppText
                text={t('auth.agent_intro.greeting_1')}
                fontSize={32}
                type="Regular"
                color={Colors.BLACK}
              />
              <AppText
                text={t('auth.agent_intro.agent_name')}
                fontSize={32}
                type="SemiBold"
                color={Colors.PRIMARY_TEAL}
              />
            </View>
            <AppText
              text={t('auth.agent_intro.subtitle')}
              fontSize={32}
              type="Regular"
              color={Colors.BLACK}
              textAlign="left"
            />

            <AppText
              text={t('auth.agent_intro.description')}
              textAlign="left"
              color={Colors.DARK_1C}
              mt={29}
              fontSize={12}
              lineHeight={17}
            />
          </View>

          {/* Agent/Sphere Graphic */}
          <View style={styles.graphicContainer}>
            <Image
              source={require('@/assets/img/agent_ali.png')}
              style={styles.sphereImage}
              resizeMode="contain"
            />
          </View>

          {/* Action Button */}
          <AppButton
            mt={62}
            title={t('auth.agent_intro.start_setup')}
            style={styles.connectBtn}
            onPress={goToLoginViaPhoneNumber}
            color='#FFFFFF'
          />
        </ScrollView>

      <Pagination activeIndex={2} />
    </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // ADDED HEADER STYLES
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: vs(10),
    marginBottom: vs(10),
  },
  arrowCircleInner: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: Colors.WHITE, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  // ------------------
  connectBtn: {
    backgroundColor: '#21AA8F',
    borderRadius: 100,
    height: vs(48), // Increased height for better UX
    width: s(240),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: vs(10),
  },
  introSection: {
    marginTop: vs(20),
    marginBottom: vs(20),
    alignItems: 'center',
    paddingLeft: Metrics.verticalScale(20)
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  graphicContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  sphereImage: {
    width: Metrics.scale(280),
    height: Metrics.scale(280),
  },
});

export default AgentIntroScreen;