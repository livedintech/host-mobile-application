import AppPressable from '@/components/atoms/AppPressable/AppPressable';
import React from 'react';
import { StyleSheet, View, ScrollView, Platform } from 'react-native';
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
import ButtonView from '@/components/molecules/AppButton/ButtonView';

const ConfirmAddressScreen = () => {
  const {
    control,
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
  const { t } = useTranslation();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* <CircularProgress percentage={10} size={48} strokeWidth={4} /> */}
        <View style={styles.headerRow}>
          <ButtonView onPress={() => goBack()}>
            <Svgicons path="back" size={40} />
          </ButtonView>
          {!isEdit && <CircularProgress percentage={10} size={48} strokeWidth={4} />}
        </View>
        <View style={styles.titleContainer}>
          {isEdit ? (
            <AppText
              text={t('app.confirm_address.edit_title')}
              fontSize={28}
              type="Medium"
            />
          ) : (
            <>
              <AppText
                text={t('app.confirm_address.title')}
                fontSize={22}
                type="Medium"
              />
              <Svgicons path="mapIcon" size={25} />
            </>
          )}
        </View>

        <View style={styles.form}>

          {/* All dropdowns work identically — value is primitive id */}
          <DropdownField
            name="country_code"
            label={t('app.confirm_address.country_label')}
            control={control}
            errors={errors}
            placeholder={t('app.confirm_address.country_placeholder')}
            disabled={isEdit}
            data={countriesOptions}
          />

          <DropdownField
            name="state"
            label={t('app.confirm_address.state_label')}
            control={control}
            errors={errors}
            placeholder={t('app.confirm_address.state_placeholder')}
            data={statesOptions}
          />

          <DropdownField
            name="city"
            label={t('app.confirm_address.city_label')}
            control={control}
            errors={errors}
            placeholder={t('app.confirm_address.city_placeholder')}
            data={citiesOptions}
          />

          <DropdownField
            name="district"
            label={t('app.confirm_address.district_label')}
            control={control}
            errors={errors}
            placeholder={t('app.confirm_address.district_placeholder')}
            data={districtsOptions}
          />

          <InputField
            name="address"
            label={t('app.confirm_address.address_label')}
            control={control}
            errors={errors}
            placeholder={t('app.confirm_address.address_placeholder')}
          />

          <InputField
            name="postalAddress"
            label={t('app.confirm_address.postal_label')}
            control={control}
            errors={errors}
            placeholder={t('app.confirm_address.postal_placeholder')}
          />

          <View style={styles.footer}>
            {!isEdit && (
              <>
                <AppButton
                  title={t('app.confirm_address.next')}
                  onPress={handleSubmit(onNext)}
                  loading={isLoading}
                  variant='secondary'
                />
                <AppButton
                  title={t('app.confirm_address.save_exit')}
                  onPress={handleSubmit(onSaveExit)}
                  mt={15}
                  disabled={isLoading}
                />
              </>
            )}
            {isEdit && (
              <AppButton
                title={t('app.confirm_address.save_exit')}
                onPress={handleSubmit(onSaveExit)}
                loading={isLoading}
              />
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  form: { flex: 1 },
  footer: { marginTop: 30, paddingBottom: 20 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrowCircleInner: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },
});

export default ConfirmAddressScreen;