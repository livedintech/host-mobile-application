import { Pressable, StyleSheet, View } from 'react-native';
import React, { useCallback } from 'react';
import AppText from '../AppText/AppText';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import ButtonView from '../AppButton/ButtonView';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';

interface HeaderApp {
  isGoBack?: boolean;
  isGoBackAfterLogo?: boolean;
  isGetStarted?: boolean;
  isLogo?: boolean;
  isLang?: boolean;
}

const HeaderApp = ({ isGoBack, isGetStarted, isLogo, isLang, isGoBackAfterLogo }: HeaderApp) => {
  const getStarted = useCallback(() => {
    navigate(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE)
  }, []);

  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        {isLogo && (
          <AppText
            text="Livedin"
            fontSize={32}
            type="Bold"
            color={Colors.BRUNSWICK_GREEN}
          />
        )}

        <View style={styles.headerRight}>
          {isLang && (
            <View style={styles.langBtn}>
              <AppText text="AR" fontSize={12} type="Medium" />
            </View>
          )}

          {isGoBack && (
            <ButtonView style={styles.getStartedBtn} onPress={() => goBack()}>
              <AppText text="Back" fontSize={12} type="Medium" />
            </ButtonView>
          )}
          {isGetStarted && (
            <ButtonView style={styles.getStartedBtn} onPress={getStarted}>
              <AppText text="Get Started" fontSize={12} type="Medium" />
            </ButtonView>
          )}

        </View>
      </View>
      {isGoBackAfterLogo && (
        <GradientBorder borderRadius={16} borderWidth={1} style={[styles.arrowCircleInner, { marginTop: Metrics.verticalScale(16) }]} >
          <Pressable style={styles.arrowCircleInner} onPress={() => goBack()}>
            <Svgicons path='arrowLeftIcon' size={24} />
          </Pressable>
        </GradientBorder>
      )}

    </View>

  );
};

export default HeaderApp;

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: Metrics.baseMargin,
    backgroundColor: Colors.WHITE,
    paddingTop: Metrics.verticalScale(15)
  },
  langBtn: {
    width: Metrics.scale(40),
    height: Metrics.scale(40),
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.SMOOTH_GREY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Metrics.scale(8),
  },
  getStartedBtn: {
    paddingHorizontal: Metrics.scale(33),
    paddingVertical: Metrics.scale(10),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.SMOOTH_GREY,
    justifyContent: 'center',
  },
  arrowCircleInner: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },

});
