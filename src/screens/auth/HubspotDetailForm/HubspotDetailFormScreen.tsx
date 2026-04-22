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

const FIGMA_TEAL = '#09A389';

const HubspotDetailFormScreen = () => {
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
                  Please enter your {'\n'}
                  <AppText type="Bold" fontSize={32} color={FIGMA_TEAL}>
                    Information
                  </AppText>
                </AppText>
                <AppText
                  text="Welcome to livedin. Let's build a brighter hosting journey together."
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
                  label="Full Name *"
                  placeholder="Enter Legal Name"
                />

                <InputField
                  name="email"
                  control={control}
                  errors={errors}
                  label="Email *"
                  placeholder="example@email.com"
                  keyboardType="email-address"
                />

                {/* Country Picker Trigger */}
                <TouchableOpacity activeOpacity={0.7} onPress={() => setPickerType('country')}>
                  <View pointerEvents="none">
                    <InputField
                      name="country"
                      control={control}
                      errors={errors}
                      label="Country *"
                      placeholder="Select Country"
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
                  onPress={() => (selectedCountry ? setPickerType('city') : Alert.alert('Error', 'Select country first'))}
                >
                  <View pointerEvents="none">
                    <InputField
                      name="city"
                      control={control}
                      errors={errors}
                      label="City *"
                      placeholder="Select City"
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
                    label="Specify City *"
                    placeholder="Enter your city name"
                  />
                )}

                {/* District Picker Trigger */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => (selectedCity ? setPickerType('district') : Alert.alert('Error', 'Select city first'))}
                >
                  <View pointerEvents="none">
                    <InputField
                      name="district"
                      control={control}
                      errors={errors}
                      label="District *"
                      placeholder="Select District"
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
                    label="Specify District *"
                    placeholder="Enter your district name"
                  />
                )}
              </View>

              {/* Next Button Section */}
              <View style={styles.btnWrapper}>
                <AppButton
                  title="Next"
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
        {pickerType && (
          <View style={styles.pickerOverlay}>
            <TouchableOpacity style={styles.pickerBackdrop} onPress={() => setPickerType(null)} />
            <View style={styles.pickerSheet}>
              <View style={styles.pickerHandle} />
              <View style={styles.pickerHeader}>
                <AppText text={`Select ${pickerType.charAt(0).toUpperCase() + pickerType.slice(1)}`} fontSize={17} type="Bold" />
                <TouchableOpacity onPress={() => setPickerType(null)}>
                  <AppText text="Done" fontSize={16} color={FIGMA_TEAL} type="Bold" />
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
  pickerOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 999, justifyContent: 'flex-end' },
  pickerBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  pickerSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: ms(28),
    borderTopRightRadius: ms(28),
    maxHeight: '60%',
    paddingBottom: vs(32),
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