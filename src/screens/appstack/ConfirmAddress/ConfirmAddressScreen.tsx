import React from 'react';
import { StyleSheet, View, ScrollView, Pressable, SafeAreaView } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import InputField from '@/components/molecules/Input/InputField'; // Aapka custom component
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useConfirmAddressContainer from './ConfirmAddressContainer';
import CountryPickerField from '@/components/molecules/Input/CountryPickerField';

const ConfirmAddressScreen = () => {
  const { control, errors, handleSubmit, onNext, onSaveExit,isLoading } = useConfirmAddressContainer();

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title Section with Map Icon */}
        <View style={styles.titleContainer}>
          <AppText text="Confirm Address " fontSize={22} type="Medium" color={Colors.BRUNSWICK_GREEN} />
          <Svgicons path="mapIcon" size={25} />
        </View>
        <View style={styles.form}>
         
          <CountryPickerField
            name="country_code"
            label="Country"
            control={control}
            errors={errors}
            placeholder="Select Country"
          />

          <InputField
            name="state"
            label="State"
            control={control}
            errors={errors}
            placeholder="Riyadh"
          />

          <InputField
            name="city"
            label="City"
            control={control}
            errors={errors}
            placeholder="Riyadh"
          />

          <InputField
            name="street"
            label="Street"
            control={control}
            errors={errors}
            placeholder="King Fahd Road"
          />

          <InputField
            name="apt"
            label="Apartment / Unit"
            control={control}
            errors={errors}
            placeholder="Unit 4B"
          />

          <View style={styles.footer}>
            <AppButton title="Next" onPress={handleSubmit(onNext)} loading={isLoading}/>
            <AppButton title="Save & Exit" onPress={onSaveExit} mt={15} disabled={isLoading}/>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  bgCircle: {
    position: 'absolute',
    top: -100,
    alignSelf: 'center',
    width: 600,
    height: 600,
    borderRadius: 300,
    borderWidth: 1,
    borderColor: '#F8F8F8',
    zIndex: -1
  },
  header: { paddingHorizontal: 22, paddingTop: 10 },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30
  },
  form: { flex: 1 },
  footer: { marginTop: 30, paddingBottom: 20 }
});

export default ConfirmAddressScreen;