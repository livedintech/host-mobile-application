import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { s, vs, ms } from 'react-native-size-matters';

import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import InputField from '@/components/molecules/Input/InputField';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { Colors } from '@/theme/colors';
import useHubspotDetailFormContainer, { COUNTRIES, COUNTRY_FLAGS } from './HubspotDetailFormContainer';

const FIGMA_TEAL = '#20957B';

const HubspotDetailFormScreen = () => {
  const {
    control,
    errors,
    handleSubmit,
    onSubmit,
    selectedCountry,
    cities,
    onCountrySelect,
    onCitySelect,
  } = useHubspotDetailFormContainer();

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* --- Header Section --- */}
          <View style={styles.headerSection}>
            <AppText type="Bold" fontSize={32} color={Colors.BLACK} lineHeight={40}>
              Please enter your {'\n'}
              <AppText type="Bold" fontSize={32} color={FIGMA_TEAL}>Information</AppText>
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
              name="phone"
              control={control}
              errors={errors}
              label="Phone Number *"
              placeholder="+966 5XX XXX XXXX"
              keyboardType="phone-pad"
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
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setShowCountryPicker(true);
                setShowCityPicker(false);
              }}
            >
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
                      <AppText 
                        text={COUNTRY_FLAGS[selectedCountry] || '🏳️'} 
                        fontSize={22} 
                        ml={10} 
                      />
                    ) : null
                  }
                />
              </View>
            </TouchableOpacity>

            {/* City Picker Trigger */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                if (!selectedCountry) {
                  Alert.alert('Select Country First', 'Please select a country before selecting a city.');
                  return;
                }
                setShowCityPicker(true);
                setShowCountryPicker(false);
              }}
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

        {/* --- Country Picker Bottom Sheet --- */}
        {showCountryPicker && (
          <View style={styles.pickerOverlay}>
            <TouchableOpacity style={styles.pickerBackdrop} onPress={() => setShowCountryPicker(false)} />
            <View style={styles.pickerSheet}>
              <View style={styles.pickerHandle} />
              <View style={styles.pickerHeader}>
                <AppText text="Select Country" fontSize={17} type="Bold" />
                <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                  <AppText text="Done" fontSize={16} color={FIGMA_TEAL} type="Bold" />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {COUNTRIES.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.pickerItem, selectedCountry === c && styles.pickerItemSelected]}
                    onPress={() => {
                      onCountrySelect(c);
                      setShowCountryPicker(false);
                    }}
                  >
                    <View style={styles.countryRow}>
                      <AppText text={COUNTRY_FLAGS[c] || '🏳️'} fontSize={22} mr={12} />
                      <AppText
                        text={c}
                        fontSize={16}
                        color={selectedCountry === c ? FIGMA_TEAL : '#222'}
                        type={selectedCountry === c ? 'Bold' : 'Regular'}
                      />
                    </View>
                    {selectedCountry === c && <AppText text="✓" fontSize={16} color={FIGMA_TEAL} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        {/* --- City Picker Bottom Sheet --- */}
        {showCityPicker && (
          <View style={styles.pickerOverlay}>
            <TouchableOpacity style={styles.pickerBackdrop} onPress={() => setShowCityPicker(false)} />
            <View style={styles.pickerSheet}>
              <View style={styles.pickerHandle} />
              <View style={styles.pickerHeader}>
                <AppText text="Select City" fontSize={17} type="Bold" />
                <TouchableOpacity onPress={() => setShowCityPicker(false)}>
                  <AppText text="Done" fontSize={16} color={FIGMA_TEAL} type="Bold" />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {cities.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={styles.pickerItem}
                    onPress={() => {
                      onCitySelect(c);
                      setShowCityPicker(false);
                    }}
                  >
                    <AppText text={c} fontSize={15} color={Colors.BLACK} />
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
    paddingBottom: vs(32) 
  },
  pickerHandle: { 
    width: s(40), 
    height: vs(4), 
    backgroundColor: '#ddd', 
    borderRadius: 2, 
    alignSelf: 'center', 
    marginTop: 10, 
    marginBottom: 4 
  },
  pickerHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 14, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
  },
  pickerItem: { 
    paddingHorizontal: 20, 
    paddingVertical: 14, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  pickerItemSelected: { backgroundColor: '#F0F7F4' },
});

export default HubspotDetailFormScreen;