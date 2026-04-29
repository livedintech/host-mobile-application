import AppPressable from '@/components/atoms/AppPressable/AppPressable';
import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { useTranslation } from 'react-i18next';

const MakePropertyStandOutScreen = () => {
  const { t } = useTranslation();
  const onNext = () => {
    navigate(NavigationRoutes.APP_STACK.INTERIOR_PHOTOS_VIDEOS); 
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        
        {/* Header with Back Button */}
        <View style={styles.header}>
          <GradientBorder borderRadius={16} borderWidth={1} style={styles.backBtn}>
            <AppPressable style={styles.backBtn} onPress={() => goBack()}>
              <Svgicons path='arrowLeftIcon' size={24} />
            </AppPressable>
          </GradientBorder>
        </View>

        <View style={styles.content}>
          {/* Main Illustration */}
          <Svgicons path='house_outline' size={326} />

          {/* Text Content */}
          <AppText text={t('app.make_standout.step_label')} fontSize={18} type="Medium" mt={40} />
          <AppText
            text={t('app.make_standout.title')}
            fontSize={32}
            type="Bold"
            lineHeight={40}
            mt={10}
          />
          <AppText
            text={t('app.make_standout.description')}
            fontSize={15} 
            color={Colors.DARK_CHARCOAL_OPACITY} 
            mt={25}
            lineHeight={22}
          />
        </View>

        {/* Footer Button */}
        <View style={styles.footer}>
          <AppButton 
            title={t('app.make_standout.next')}
            onPress={onNext}
          />
        </View>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    paddingHorizontal: 25, 
    paddingTop: 10 
  },
  backBtn: { 
    width: 32, 
    height: 32, 
    backgroundColor: Colors.WHITE, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  content: { 
    flex: 1, 
    paddingHorizontal: 30, 
    justifyContent: 'center',
    marginTop: -50 // Image ko thora upar center karne ke liye
  },
  image: {
    width: '100%',
    height: 250,
  },
  footer: { 
    paddingHorizontal: 25, 
    paddingBottom: 40 
  },
});

export default MakePropertyStandOutScreen;