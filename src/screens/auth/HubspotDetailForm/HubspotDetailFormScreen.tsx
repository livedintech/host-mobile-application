import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { vs } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';

import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import InputField from '@/components/molecules/Input/InputField';
import BGImage from '@/components/molecules/BGImage/BGImage';
import DropdownField from '@/components/molecules/Input/DropdownField';

import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import useHubspotDetailFormContainer from './HubspotDetailFormContainer';

const FIGMA_TEAL = '#09A389';

const HubspotDetailFormScreen = () => {
  const { t } = useTranslation();
  const {
    control,
    errors,
    handleSubmit,
    onSubmit,
    selectedCountryId,
    selectedStateId,
    selectedCityId,
    countriesOptions,
    statesOptions,
    citiesOptions,
    districtsOptions,
    onCountrySelect,
    onStateSelect,
    onCitySelect,
  } = useHubspotDetailFormContainer();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.headerSection}>
            <AppText type="Bold" fontSize={32} color={Colors.BLACK} lineHeight={40}>
              {t('auth.hubspot_form.title_1')}{'\n'}
              <AppText type="Bold" fontSize={32} color={FIGMA_TEAL}>
                {t('auth.hubspot_form.title_highlight')}
              </AppText>
            </AppText>
            <AppText
              text={t('auth.hubspot_form.subtitle')}
              fontSize={16}
              color={Colors.BLACK}
              mt={vs(10)}
              lineHeight={22}
            />
          </View>

          <View style={styles.formContainer}>
            <InputField
              name="fullName"
              control={control}
              errors={errors}
              label={t('auth.hubspot_form.full_name_label')}
              placeholder={t('auth.hubspot_form.full_name_placeholder')}
            />

            <InputField
              name="email"
              control={control}
              errors={errors}
              label={t('auth.hubspot_form.email_label')}
              placeholder={t('auth.hubspot_form.email_placeholder')}
              keyboardType="email-address"
            />

            <DropdownField
              name="country"
              control={control}
              errors={errors}
              label={t('auth.hubspot_form.country_label')}
              placeholder={t('auth.hubspot_form.country_placeholder')}
              data={countriesOptions}
              onSelect={onCountrySelect}
            />

            <DropdownField
              key={`state-${selectedCountryId}`}
              name="state"
              control={control}
              errors={errors}
              label={t('auth.hubspot_form.state_label')}
              placeholder={t('auth.hubspot_form.state_placeholder')}
              data={statesOptions}
              disabled={!selectedCountryId}
              onSelect={onStateSelect}
            />

            <DropdownField
              key={`city-${selectedStateId}`}
              name="city"
              control={control}
              errors={errors}
              label={t('auth.hubspot_form.city_label')}
              placeholder={t('auth.hubspot_form.city_placeholder')}
              data={citiesOptions}
              disabled={!selectedStateId}
              onSelect={onCitySelect}
              dropdownPosition="top"
            />

            <DropdownField
              key={`district-${selectedCityId}`}
              name="district"
              control={control}
              errors={errors}
              label={t('auth.hubspot_form.district_label')}
              placeholder={t('auth.hubspot_form.district_placeholder')}
              data={districtsOptions}
              disabled={!selectedCityId}
              dropdownPosition="top"
            />
          </View>

          <AppButton
            title={t('auth.hubspot_form.next')}
            onPress={handleSubmit(onSubmit)}
            backgroundColor={FIGMA_TEAL}
            color={Colors.WHITE}
            borderRadius={100}
            type="Bold"
            fontSize={18}
            mt={vs(30)}
            mb={vs(20)}
          />
        </View>
      </KeyboardAwareScrollView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Metrics.baseMargin,
    paddingTop: Platform.OS === 'ios' ? vs(60) : vs(40),
    paddingBottom: vs(20),
  },
  headerSection: {
    marginBottom: vs(25),
  },
  formContainer: {
    gap: vs(5),
  },
});

export default HubspotDetailFormScreen;
