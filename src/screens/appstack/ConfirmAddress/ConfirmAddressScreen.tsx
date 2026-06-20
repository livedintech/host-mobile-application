import AppPressable from '@/components/atoms/AppPressable/AppPressable';
import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import InputField from '@/components/molecules/Input/InputField';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useConfirmAddressContainer from './ConfirmAddressContainer';
import DropdownField from '@/components/molecules/Input/DropdownField';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { goBack } from '@/services/navigationService';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useTranslation } from 'react-i18next';
import FormFooterActions from '@/components/molecules/FormFooterActions/FormFooterActions';

const ConfirmAddressScreen = () => {
  const {
    control: controlTyped,
    errors,
    handleSubmit,
    onNext,
    onSaveExit,
    isLoading,
    isEdit,
    countriesOptions,
    statesOptions,
    citiesOptions,
    districtsOptions,
  } = useConfirmAddressContainer();
  const control = controlTyped as any;
  const { t } = useTranslation();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        
        {/* ── Header Row (Cloned from AboutThePlace) ── */}
        <View style={styles.headerRow}>
          <GradientBorder borderRadius={16} borderWidth={1} style={styles.arrowCircleInner}>
            <AppPressable style={styles.arrowCircleInner} onPress={() => goBack()}>
              <Svgicons path="arrowLeftIcon" size={24} />
            </AppPressable>
          </GradientBorder>
          {!isEdit && <CircularProgress percentage={10} size={48} strokeWidth={4} />}
        </View>

        {/* ── Scroll Content Form fields ── */}
        <KeyboardAwareScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleContainer}>
            {isEdit ? (
              <AppText
                text={t('app.confirm_address.edit_title')}
                fontSize={28}
                type="Medium"
              />
            ) : (
              <AppText
                text={t('app.confirm_address.title')}
                fontSize={28} // Updated to match AboutThePlace screen standard size
                type="Bold"
                color={Colors.BLACK}
                mb={30}
              />
            )}
          </View>

          <View style={styles.form}>
            <DropdownField
              name="country_code"
              label={t('app.confirm_address.country_label')}
              control={control}
              errors={countriesOptions.length > 0 ? errors : {}}
              placeholder={t('app.confirm_address.country_placeholder')}
              data={countriesOptions}
            />

            <DropdownField
              name="state"
              label={t('app.confirm_address.state_label')}
              control={control}
              errors={statesOptions.length > 0 ? errors : {}}
              placeholder={t('app.confirm_address.state_placeholder')}
              data={statesOptions}
            />

            <DropdownField
              name="city"
              label={t('app.confirm_address.city_label')}
              control={control}
              errors={citiesOptions.length > 0 ? errors : {}}
              placeholder={t('app.confirm_address.city_placeholder')}
              data={citiesOptions}
            />

            <DropdownField
              name="district"
              label={t('app.confirm_address.district_label')}
              control={control}
              errors={districtsOptions.length > 0 ? errors : {}}
              placeholder={t('app.confirm_address.district_placeholder')}
              data={districtsOptions}
            />

            <InputField
              name="address"
              label={t('app.confirm_address.address_label')}
              control={control}
              errors={errors}
              placeholder={t('app.confirm_address.address_placeholder')}
              maxLength={255}
            />

            <InputField
              name="postalAddress"
              label={t('app.confirm_address.postal_label')}
              control={control}
              errors={errors}
              placeholder={t('app.confirm_address.postal_placeholder')}
              maxLength={255}
            />
          </View>
        </KeyboardAwareScrollView>

        {/* ── Footer Actions Section ── */}
       <FormFooterActions
          // Primary Button (Next) is only shown if not in edit mode
          primaryTitle={t('app.confirm_address.next')}
          onPrimaryPress={handleSubmit(onNext)}
          isPrimaryLoading={isLoading}
          showPrimaryButton={!isEdit}

          // Secondary Button (Save & Exit)
          secondaryTitle={t('app.confirm_address.save_exit')}
          onSecondaryPress={handleSubmit(onSaveExit)}
          isSecondaryLoading={isLoading}
          // Remove default bottom padding from molecule if you need to align specifically
          containerStyle={styles.footerOverride} 
        />

      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 25, 
    paddingTop: 10 
  },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  titleContainer: {
    marginTop: 20,
  },
  form: { flex: 1 },
  footer: { 
    paddingHorizontal: 25, 
    paddingBottom: 30 
  },
  arrowCircleInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerOverride: { 
    paddingHorizontal: 25, 
    paddingBottom: 30 
  },
});

export default ConfirmAddressScreen;