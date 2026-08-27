import React, { useRef, useState, useCallback } from 'react';
import { FlatList, View, StyleSheet, ScrollView, Platform, Dimensions } from 'react-native';
import AppImage from '@/components/atoms/AppImage/AppImage';
import { vs, ms, s } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';

import BGImage from '@/components/molecules/BGImage/BGImage';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import Pagination from '@/components/molecules/Pagination/Pagination';
import DropdownField from '@/components/molecules/Input/DropdownField';
import PropertyAreaChart from '@/components/organisms/PropertyAreaChart/PropertyAreaChart';

import usePropertyCanEarnContainer from '@/screens/auth/PropertyCanEarn/PropertyCanEarnContainer';
import Metrics from '@/utility/Metrics';
import { bedroomOptions } from '@/constants/dropdownOptions';
import { Colors } from '@/theme/colors';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';


const IntroSlidesScreen = () => {
  const { t } = useTranslation();
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToSlide = useCallback((index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setActiveIndex(index);
  }, []);

  const {
    control, errors, handleSubmit, showResults, isLoading,
    availableCityItems, availableDistrictItems,
    selectedcity, chartPoints, roundedMax, yAxisLabels, xAxisLabels, chartData,
    availableBedroomItems
  } = usePropertyCanEarnContainer();

  const handleMomentumScrollEnd = useCallback((e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / Metrics.screenWidth);
    setActiveIndex(index);
  }, []);

  const renderSlide1 = () => (
    <ScrollView
      style={styles.slide}
      contentContainerStyle={styles.slide1Content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.titleSection}>
        <AppText text={t('auth.property_can_earn.title_1')} fontSize={30} textAlign="left" color={Colors.BLACK} mt={20} />
        <View style={styles.titleRow}>
          <AppText text={t('auth.property_can_earn.title_2') + ' '} fontSize={30} color={Colors.PRIMARY_TEAL} type="Bold" />
          <AppText text={t('auth.property_can_earn.title_3')} fontSize={30} color={Colors.BLACK} />
        </View>
        <AppText text={t('auth.property_can_earn.description')} textAlign="left" color="#1C1C1C" mt={vs(29)} mb={vs(25)} fontSize={15} lineHeight={22} />
      </View>

      <View style={styles.card}>
        {!showResults ? (
          <View>
            <AppText text={t('auth.property_can_earn.where_located')} fontSize={18} type="Medium" color="#000000" mb={vs(15)} textAlign="center" />
            <View>
              <AppText text={t('auth.property_can_earn.city')} type="SemiBold" color="#1C1C1C" mb={8} fontSize={14} />
              <DropdownField name="city" label="" control={control} errors={errors} data={availableCityItems} placeholder={t('auth.property_can_earn.city_placeholder')} mode={Platform.OS === 'ios' ? 'modal' : 'default'} listContainerStyle={Platform.OS === 'ios' ? styles.iosDropdownList : undefined} />
            </View>
            <View>
              <AppText text={t('auth.property_can_earn.district')} type="SemiBold" color="#1C1C1C" mb={8} fontSize={14} />
              <DropdownField name="district" label="" control={control} errors={errors} data={availableDistrictItems} placeholder={t('auth.property_can_earn.district_placeholder')} disabled={!selectedcity?.length} mode={Platform.OS === 'ios' ? 'modal' : 'default'} listContainerStyle={Platform.OS === 'ios' ? styles.iosDropdownList : undefined} />
            </View>
            <View>
              <AppText text={t('auth.property_can_earn.bedrooms')} type="SemiBold" color="#1C1C1C" mb={8} fontSize={14} />
              <DropdownField name="bedrooms" label="" control={control} errors={errors} data={availableBedroomItems} placeholder={t('auth.property_can_earn.bedrooms_placeholder')} mode={Platform.OS === 'ios' ? 'modal' : 'default'} listContainerStyle={Platform.OS === 'ios' ? styles.iosDropdownList : undefined} />
            </View>
            <AppButton type='Bold' onPress={handleSubmit} title={t('auth.property_can_earn.next')} loading={isLoading} style={styles.nextBtn} color="#FFFFFF" />
          </View>
        ) : (
          <View style={styles.resultContainer}>
            <AppText text={t('auth.property_can_earn.estimate_earnings')} fontSize={20} textAlign="center" color={Colors.BLACK} type='Medium' />
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <AppText text={t('auth.property_can_earn.monthly_income')} fontSize={12} color={Colors.BLACK} />
                <AppText text={`SAR ${chartData?.data?.monthly}`} color={Colors.BLACK} />
              </View>
              <View style={styles.statBox}>
                <AppText text={t('auth.property_can_earn.yearly_income')} fontSize={12} color={Colors.BLACK} />
                <AppText text={`SAR ${chartData?.data?.yearly}`} color={Colors.BLACK} />
              </View>
            </View>
            <PropertyAreaChart chartPoints={chartPoints} roundedMax={roundedMax} yAxisLabels={yAxisLabels} xAxisLabels={xAxisLabels} />
            <AppButton title={t('auth.property_can_earn.unlock')} style={styles.unlockBtn} textStyle={{ color: '#FFFFFF' }} onPress={() => scrollToSlide(1)} color='#FFFFFF' />
          </View>
        )}
      </View>
    </ScrollView>
  );

  const renderSlide2 = () => (
    <View style={styles.slide}>
      <View style={styles.calendarMainContent}>
        <View style={styles.calendarCardContainer}>
          <AppImage source={require('@/assets/img/calendar_view.png')} style={styles.calendarImg} resizeMode="contain" />
        </View>
        <View style={styles.calendarTitleSection}>
          <AppText text={t('auth.connect_calendars.title_1')} fontSize={26} type="Regular" textAlign="center" color="#000000" />
          <AppText text={t('auth.connect_calendars.title_2')} fontSize={26} type="Regular" textAlign="center" color="#000000" mt={-5} />
          <AppText text={t('auth.connect_calendars.title_3')} fontSize={26} type="SemiBold" color={Colors.PRIMARY_TEAL} textAlign="center" mt={-5} />
          <AppText text={t('auth.connect_calendars.description')} textAlign="center" color="#1c1c1c" mt={vs(20)} fontSize={15} lineHeight={17} type='Regular' px={20}/>
        </View>
        <View style={styles.calendarFooter}>
          <AppButton title={t('auth.connect_calendars.connect_account')} onPress={() => navigate(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE)} style={styles.connectBtn} color="#FFFFFF" type="Bold" />
        </View>
      </View>
    </View>
  );

  const renderSlide3 = () => (
    <ScrollView style={styles.slide} contentContainerStyle={styles.agentScrollContent} showsVerticalScrollIndicator={false}>
      <View style={[styles.agentIntroSection, { alignItems: 'flex-start' }]}>
        <View style={styles.agentTitleRow}>
          <AppText text={t('auth.agent_intro.greeting_1')} fontSize={32} type="Regular" color={Colors.BLACK} />
          <AppText text={t('auth.agent_intro.agent_name')} fontSize={32} type="SemiBold" color={Colors.PRIMARY_TEAL} />
        </View>
        <AppText text={t('auth.agent_intro.subtitle')} fontSize={32} type="Regular" color={Colors.BLACK} textAlign="left" />
        <AppText text={t('auth.agent_intro.description')} textAlign="left" color={Colors.DARK_1C} mt={29} fontSize={12} lineHeight={17} />
      </View>
      <View style={styles.agentGraphicContainer}>
        <AppImage source={require('@/assets/img/agent_ali.png')} style={styles.agentSphereImage} resizeMode="contain" />
      </View>
      <AppButton
        mt={62}
        title={t('auth.agent_intro.start_setup')}
        style={styles.agentConnectBtn}
        onPress={() => navigate(NavigationRoutes.AUTH_STACK.LOGIN_WITH_PHONE)}
        color='#FFFFFF'
      />
    </ScrollView>
  );

  const renderItem = ({ item }: { item: number }) => {
    if (item === 0) return renderSlide1();
    if (item === 1) return renderSlide2();
    return renderSlide3();
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={[0, 1, 2]}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          keyExtractor={(item) => String(item)}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({ length: Metrics.screenWidth, offset: Metrics.screenWidth * index, index })}
        />
        <Pagination activeIndex={activeIndex} onDotPress={scrollToSlide} />
      </View>
    </BGImage>
  );
};

const { height: SCREEN_H } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  // Slide base
  slide: {
    width: Metrics.screenWidth,
    flex: 1,
  },
  iosDropdownList: {
    height: Metrics.verticalScale(250),
    marginTop: SCREEN_H - 250,
    width: Metrics.screenWidth,
    marginHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowOpacity: 0,
    elevation: 0,
    paddingHorizontal: Metrics.baseMargin,
    paddingTop: Metrics.verticalScale(16)
  },

  // Slide 1 - PropertyCanEarn
  slide1Content: {
    paddingHorizontal: s(20),
    paddingBottom: vs(20),
    paddingTop: vs(15),
  },
  titleSection: {
    alignItems: 'flex-start',
    width: '100%',
    paddingLeft: Metrics.verticalScale(20),
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: ms(24),
    padding: s(20),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  nextBtn: {
    backgroundColor: '#21AA8F',
    marginTop: vs(10),
    borderRadius: 100,
    width: s(150),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  resultContainer: {
    width: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: vs(15),
    marginBottom: vs(10),
  },
  statBox: {
    alignItems: 'center',
  },
  unlockBtn: {
    backgroundColor: '#21AA8F',
    borderRadius: 100,
    width: s(220),
    marginTop: vs(15),
    borderWidth: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Slide 2 - ConnectCalendarsIntro
  calendarMainContent: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  calendarCardContainer: {
    alignItems: 'center',
    height: vs(210),
    width: '100%',
    marginVertical: vs(10),
  },
  calendarImg: {
    width: '100%',
    height: '100%',
  },
  calendarTitleSection: {
    alignItems: 'center',
    width: '100%',
    marginVertical: vs(15),
  },
  calendarFooter: {
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

  // Slide 3 - AgentIntro
  agentScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: vs(10),
  },
  agentIntroSection: {
    marginTop: vs(20),
    marginBottom: vs(20),
    alignItems: 'center',
    paddingLeft: Metrics.verticalScale(20),
  },
  agentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentGraphicContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  agentSphereImage: {
    width: Metrics.scale(230),
    height: Metrics.scale(230),
  },
  agentConnectBtn: {
    backgroundColor: '#21AA8F',
    borderRadius: 100,
    height: vs(48),
    width: s(240),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
});

export default IntroSlidesScreen;
