import React from 'react';
import { StyleSheet, View, ScrollView, Pressable, Platform } from 'react-native';
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

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* <CircularProgress percentage={10} size={48} strokeWidth={4} /> */}
        <View style={styles.headerRow}>
          <GradientBorder borderRadius={16} borderWidth={1} style={styles.arrowCircleInner} >
            <Pressable style={styles.arrowCircleInner} onPress={() => goBack()}>
              <Svgicons path='arrowLeftIcon' size={24} />
            </Pressable>
          </GradientBorder>
          <CircularProgress percentage={10} size={48} strokeWidth={4} />
        </View>
        <View style={styles.titleContainer}>
          <AppText
            text="Confirm Address "
            fontSize={22}
            type="Medium"
            color={Colors.BRUNSWICK_GREEN}
          />
          <Svgicons path="mapIcon" size={25} />
        </View>

        <View style={styles.form}>

          {/* All dropdowns work identically — value is primitive id */}
          <DropdownField
            name="country_code"
            label="Country"
            control={control}
            errors={errors}
            placeholder="Select country"
            disabled={isEdit}
            data={countriesOptions}
          />

          <DropdownField
            name="state"
            label="State / Province"
            control={control}
            errors={errors}
            placeholder="Select state"
            data={statesOptions}
          />

          <DropdownField
            name="city"
            label="City"
            control={control}
            errors={errors}
            placeholder="Select city"
            data={citiesOptions}
          />

          <DropdownField
            name="district"
            label="District"
            control={control}
            errors={errors}
            placeholder="Select district"
            data={districtsOptions}
          />

          <InputField
            name="address"
            label="Address"
            control={control}
            errors={errors}
            placeholder="e.g. 123 King Fahad Rd"
          />

          <InputField
            name="postalAddress"
            label="Postal Address"
            control={control}
            errors={errors}
            placeholder="e.g. 12345"
          />

          <View style={styles.footer}>
            {!isEdit && (
              <>
                <AppButton
                  title="Next"
                  onPress={handleSubmit(onNext)}
                  loading={isLoading}
                  variant='secondary'
                />
                <AppButton
                  title="Save & Exit"
                  onPress={handleSubmit(onSaveExit)}
                  mt={15}
                  disabled={isLoading}
                />
              </>
            )}
            {isEdit && (
              <AppButton
                title="Save & Exit"
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