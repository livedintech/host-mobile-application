import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { s, vs, ms } from 'react-native-size-matters';

import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import InputField from '@/components/molecules/Input/InputField';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { Colors } from '@/theme/colors';
import useHubspotDetailFormContainer, {
  COUNTRIES,
  COUNTRY_FLAGS,
} from './HubspotDetailFormContainer';
import { useTranslation } from 'react-i18next';

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
    onDistrictSelect,
  } = useHubspotDetailFormContainer();

  const [pickerType, setPickerType] = useState<null | 'country' | 'city' | 'district'>(null);

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
              {/* --- Header Section --- */}
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

              {/* --- Form Section --- */}
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

                {/* Country Picker Trigger */}
                <TouchableOpacity activeOpacity={0.7} onPress={() => setPickerType('country')}>
                  <View pointerEvents="none">
                    <InputField
                      name="country"
                      control={control}
                      errors={errors}
                      label={t('auth.hubspot_form.country_label')}
                      placeholder={t('auth.hubspot_form.country_placeholder')}
                      editable={false}
                      leftIcon={
                        selectedCountry ? (
                          <AppText text={COUNTRY_FLAGS[selectedCountry] || '🏳️'} fontSize={22} ml={10} />
                        ) : null
                      }
                    />
                  </View>
                </TouchableOpacity>

                {/* City Picker Trigger */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => (selectedCountry ? setPickerType('city') : Alert.alert(t('auth.hubspot_form.error'), t('auth.hubspot_form.error_select_country')))}
                >
                  <View pointerEvents="none">
                    <InputField
                      name="city"
                      control={control}
                      errors={errors}
                      label={t('auth.hubspot_form.city_label')}
                      placeholder={t('auth.hubspot_form.city_placeholder')}
                      editable={false}
                    />
                  </View>
                </TouchableOpacity>

                {/* Conditional Other City Input */}
                {selectedCity === 'Other' && (
                  <InputField
                    name="otherCity"
                    control={control}
                    errors={errors}
                    label={t('auth.hubspot_form.specify_city_label')}
                    placeholder={t('auth.hubspot_form.specify_city_placeholder')}
                  />
                )}

                {/* District Picker Trigger */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => (selectedCity ? setPickerType('district') : Alert.alert(t('auth.hubspot_form.error'), t('auth.hubspot_form.error_select_city')))}
                >
                  <View pointerEvents="none">
                    <InputField
                      name="district"
                      control={control}
                      errors={errors}
                      label={t('auth.hubspot_form.district_label')}
                      placeholder={t('auth.hubspot_form.district_placeholder')}
                      editable={false}
                    />
                  </View>
                </TouchableOpacity>

                {/* Conditional Other District Input */}
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

              {/* Next Button Section */}
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

        {/* --- Unified Picker Bottom Sheet --- */}
        {/* --- Unified Picker Bottom Sheet --- */}
        {pickerType && (
          <View style={styles.pickerOverlay}>
            {/* Backdrop ab poori screen cover karega */}
            <TouchableOpacity 
              style={styles.pickerBackdrop} 
              activeOpacity={1} 
              onPress={() => setPickerType(null)} 
            />
            
            <View style={styles.pickerSheet}>
              <View style={styles.pickerHandle} />
              <View style={styles.pickerHeader}>
                <AppText 
                  text={t('auth.hubspot_form.select_picker', { type: pickerType.charAt(0).toUpperCase() + pickerType.slice(1) })} 
                  fontSize={17} 
                  type="Bold" 
                />
                <TouchableOpacity onPress={() => setPickerType(null)}>
                  <AppText text={t('auth.hubspot_form.done')} fontSize={16} color={FIGMA_TEAL} type="Bold" />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {(pickerType === 'country' ? COUNTRIES : pickerType === 'city' ? cities : districts).map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.pickerItem}
                    onPress={() => {
                      if (pickerType === 'country') onCountrySelect(item);
                      if (pickerType === 'city') onCitySelect(item);
                      if (pickerType === 'district') onDistrictSelect(item);
                      setPickerType(null);
                    }}
                  >
                    <View style={styles.countryRow}>
                      {pickerType === 'country' && <AppText text={COUNTRY_FLAGS[item] || '🏳️'} fontSize={22} mr={12} />}
                      <AppText text={item} fontSize={16} color={Colors.BLACK} />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
      </SafeAreaView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: s(24),
    paddingBottom: vs(40),
    flexGrow: 1,
  },
  headerSection: {
    marginTop: vs(40),
    marginBottom: vs(30),
  },
  formContainer: {
    gap: vs(12),
  },
  btnWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: vs(40),
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
pickerOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    zIndex: 999, 
    justifyContent: 'flex-end' 
  },
   pickerBackdrop: { 
    ...StyleSheet.absoluteFillObject, // flex: 1 ki jagah absoluteFill use kiya hai
    backgroundColor: 'rgba(0,0,0,0.4)' 
  },
  pickerSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: ms(24), // Radius thoda refine kiya design ke mutabiq
    borderTopRightRadius: ms(24),
    maxHeight: '60%',
    paddingBottom: vs(32),
    overflow: 'hidden', // Extra safety taake koi child view corner se bahar na nikle
  },
  pickerHandle: {
    width: s(40),
    height: vs(4),
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pickerItem: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default HubspotDetailFormScreen;