// screens/HubspotMeeting/DetailsScreen/DetailsScreen.tsx

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import InputField from '@/components/molecules/Input/InputField';
import Metrics from '@/utility/Metrics';
import useHubspotDetailFormContainer, { COUNTRIES } from './HubspotDetailFormContainer';

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
    <SafeAreaView style={styles.container}>
      {/* Background circles */}
      <View style={styles.circleContainer} pointerEvents="none">
        <View style={styles.circleLarge} />
        <View style={styles.circleMedium} />
        <View style={styles.circleSmall} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Header ──────────────────────────────────────────────────────── */}
        <AppText
          text="Please enter your information"
          textAlign="center"
          fontSize={28}
          px={20}
          mt={24}
          mb={8}
        />
        <AppText
          text="Welcome to livedin. Let's build a brighter hosting journey together."
          textAlign="center"
          fontSize={15}
          px={20}
          mb={32}
        />

        {/* ─── Full Name ───────────────────────────────────────────────────── */}
        <InputField
          name="fullName"
          control={control}
          errors={errors}
          label="Full Name *"
          placeholder="Enter Legal Name"
          keyboardType="default"
        />

        {/* ─── Phone Number ────────────────────────────────────────────────── */}
        <InputField
          name="phone"
          control={control}
          errors={errors}
          label="Phone Number *"
          placeholder="+966 5XX XXX XXXX"
          keyboardType="phone-pad"
        />

        {/* ─── Email ───────────────────────────────────────────────────────── */}
        <InputField
          name="email"
          control={control}
          errors={errors}
          label="Email *"
          placeholder="example@email.com"
          keyboardType="email-address"
        />

        {/* ─── Country ─────────────────────────────────────────────────────── */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setShowCountryPicker(true);
            setShowCityPicker(false);
          }}
        >
          <InputField
            name="country"
            control={control}
            errors={errors}
            label="Country *"
            placeholder="Select Country"
            editable={false}
          />
        </TouchableOpacity>

        {/* ─── City ────────────────────────────────────────────────────────── */}
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
          <InputField
            name="city"
            control={control}
            errors={errors}
            label="City *"
            placeholder="Select City"
            editable={false}
          />
        </TouchableOpacity>

        {/* ─── Next Button ─────────────────────────────────────────────────── */}
        <View style={styles.btnWrapper}>
          <AppButton
            title="Next"
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>

      {/* ─── Country Picker Bottom Sheet ─────────────────────────────────────── */}
      {showCountryPicker && (
        <View style={styles.pickerOverlay}>
          <TouchableOpacity
            style={styles.pickerBackdrop}
            onPress={() => setShowCountryPicker(false)}
          />
          <View style={styles.pickerSheet}>
            <View style={styles.pickerHandle} />
            <View style={styles.pickerHeader}>
              <AppText text="Select Country" fontSize={17}  />
              <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                <AppText text="Done" fontSize={16} color="#1B4D3E" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {COUNTRIES.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.pickerItem,
                    selectedCountry === c && styles.pickerItemSelected,
                  ]}
                  onPress={() => {
                    onCountrySelect(c);
                    setShowCountryPicker(false);
                  }}
                >
                  <AppText
                    text={c}
                    fontSize={15}
                    color={selectedCountry === c ? '#1B4D3E' : '#222'}
                    // fontWeight={selectedCountry === c ? '600' : '400'}
                  />
                  {selectedCountry === c && (
                    <AppText text="✓" fontSize={16} color="#1B4D3E" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* ─── City Picker Bottom Sheet ─────────────────────────────────────────── */}
      {showCityPicker && (
        <View style={styles.pickerOverlay}>
          <TouchableOpacity
            style={styles.pickerBackdrop}
            onPress={() => setShowCityPicker(false)}
          />
          <View style={styles.pickerSheet}>
            <View style={styles.pickerHandle} />
            <View style={styles.pickerHeader}>
              <AppText text="Select City" fontSize={17}  />
              <TouchableOpacity onPress={() => setShowCityPicker(false)}>
                <AppText text="Done" fontSize={16} color="#1B4D3E" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {cities.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.pickerItem, styles.pickerItemBorder]}
                  onPress={() => {
                    onCitySelect(c);
                    setShowCityPicker(false);
                  }}
                >
                  <AppText text={c} fontSize={15} color="#222" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default HubspotDetailFormScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },

  btnWrapper: {
    marginTop: 32,
  },

  // Picker
  pickerOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    justifyContent: 'flex-end',
  },
  pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  pickerSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
    paddingBottom: 32,
  },
  pickerHandle: {
    width: 40,
    height: 4,
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
  pickerItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  pickerItemSelected: {
    backgroundColor: '#F0F7F4',
  },

  // Background circles
  circleContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  circleLarge: {
    width: Metrics.screenWidth * 1.5,
    height: Metrics.screenWidth * 1.5,
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: '#F8F8F8',
    position: 'absolute',
  },
  circleMedium: {
    width: Metrics.screenWidth * 1.1,
    height: Metrics.screenWidth * 1.1,
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: '#F4F4F4',
    position: 'absolute',
  },
  circleSmall: {
    width: Metrics.screenWidth * 0.7,
    height: Metrics.screenWidth * 0.7,
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    position: 'absolute',
  },
});