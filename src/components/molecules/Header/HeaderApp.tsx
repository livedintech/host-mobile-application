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
  addIconAfterisGoBack?: string;
}

const HeaderApp = ({
  isGoBack,
  isGetStarted,
  isLogo,
  isLang,
  isGoBackAfterLogo,
  addIconAfterisGoBack,
}: HeaderApp) => {
  const getStarted = useCallback(() => {
    navigate(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE);
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
        {isGoBack && (
          <ButtonView onPress={() => goBack()}>
            <Svgicons path="back" size={40} />
          </ButtonView>
        )}
        <View style={styles.headerRight}>
          {false && (
            <GradientBorder
              borderRadius={16}
              borderWidth={1}
              style={[styles.langBtn, { marginRight: Metrics.scale(5) }]}
            >
              <Pressable style={styles.langBtn}>
                <AppText text="العربية" fontSize={12} type="Medium" />
              </Pressable>
            </GradientBorder>
          )}
          {isGetStarted && (
            <GradientBorder style={styles.getStartedBtn} borderRadius={20}>
              <Pressable style={styles.getStartedBtn} onPress={getStarted}>
                <AppText text="Get Started" fontSize={12} type="Medium" />
              </Pressable>
            </GradientBorder>
          )}
        </View>
      </View>
      {isGoBackAfterLogo && (
        <View style={styles.headerRow}>
          <View
            borderRadius={16}
            borderWidth={1}
            style={styles.arrowCircleInner}
          >
            <Pressable style={styles.arrowCircleInner} onPress={() => goBack()}>
              <Svgicons path="arrowLeftIcon" size={24} />
            </Pressable>
          </View>
          {addIconAfterisGoBack && <Svgicons path="mapIcon" size={35} />}
        </View>
      )}
    </View>
  );
};

export default HeaderApp;

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: Metrics.baseMargin,
    backgroundColor: Colors.WHITE,
    paddingTop: Metrics.verticalScale(15),
  },
  langBtn: {
    width: Metrics.scale(60),
    height: Metrics.scale(36),
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  getStartedBtn: {
    width: Metrics.scale(110),
    height: Metrics.scale(36),
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowCircleInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});
