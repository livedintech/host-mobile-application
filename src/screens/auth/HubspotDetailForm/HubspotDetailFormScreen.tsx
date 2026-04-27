import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { vs } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';

import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import InputField from '@/components/molecules/Input/InputField';
import BGImage from '@/components/molecules/BGImage/BGImage';
import CountryPickerField from '@/components/molecules/Input/CountryPickerField';
import DropdownField from '@/components/molecules/Input/DropdownField';

import { Colors } from '@/theme/colors';
import useHubspotDetailFormContainer from './HubspotDetailFormContainer';

const FIGMA_TEAL = '#09A389';

const HubspotDetailFormScreen = () => {
  const { t } = useTranslation();
  const {
    control,
    errors,
    handleSubmit,
    onSubmit,
    selectedCountry,
    selectedCity,
    selectedDistrict,
    cities,
    districts,
    onCountrySelect,
    onCitySelect,
  } = useHubspotDetailFormContainer();

  const cityData = (cities || []).map((city) => ({ label: city, value: city }));
  const districtData = (districts || []).map((d) => ({ label: d, value: d }));

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
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

                <CountryPickerField
                  name="country"
                  control={control}
                  errors={errors}
                  label={t('auth.hubspot_form.country_label')}
                  placeholder={t('auth.hubspot_form.country_placeholder')}
                 onSelect={(country) => onCountrySelect(country)}
                />

                <DropdownField
                  key={`city-dropdown-${selectedCountry}`} // Forces refresh when country changes
                  name="city"
                  control={control}
                  errors={errors}
                  label={t('auth.hubspot_form.city_label')}
                  placeholder={t('auth.hubspot_form.city_placeholder')}
                  data={cityData}
                  disabled={!selectedCountry}
                  onSelect={(item) => onCitySelect(item.value)}
                  dropdownPosition='top'
                />

                {selectedCity === 'Other' && (
                  <InputField
                    name="otherCity"
                    control={control}
                    errors={errors}
                    label={t('auth.hubspot_form.specify_city_label')}
                    placeholder={t('auth.hubspot_form.specify_city_placeholder')}
                  />
                )}

                <DropdownField
                  key={`district-dropdown-${selectedCity}`} // Forces refresh when city changes
                  name="district"
                  control={control}
                  errors={errors}
                  label={t('auth.hubspot_form.district_label')}
                  placeholder={t('auth.hubspot_form.district_placeholder')}
                  data={districtData}
                  disabled={!selectedCity}
                  dropdownPosition='top'
                />

                {selectedDistrict === 'Other' && (
                  <InputField
                    name="otherDistrict"
                    control={control}
                    errors={errors}
                    label={t('auth.hubspot_form.specify_district_label')}
                    placeholder={t('auth.hubspot_form.specify_district_placeholder')}
                  />
                )}
              </View>

              <View style={styles.btnWrapper}>
                <AppButton
                  title={t('auth.hubspot_form.next')}
                  onPress={handleSubmit(onSubmit)}
                  backgroundColor={FIGMA_TEAL}
                  color={Colors.WHITE}
                  borderRadius={100}
                  type="Bold"
                  fontSize={18}
                />
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  headerSection: { marginBottom: 30 },
  formContainer: { gap: 5 },
  btnWrapper: { marginTop: 30 },
});

export default HubspotDetailFormScreen;