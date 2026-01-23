import React from 'react';
import { StyleSheet, View, SafeAreaView, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import DropdownField from '@/components/molecules/Input/DropdownField';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useCreateListingStepOneContainer from './CreateListingStepOneContainer';

const CreateListingStepOneScreen = () => {
  const { control, errors, propertyOptions, handleSubmit, onNext, onSaveExit, isLoading } = useCreateListingStepOneContainer();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Step Indicator & Icon */}
        <View style={styles.stepHeader}>
          <AppText text="Step 1 " fontSize={40} type="Bold" color={Colors.BRUNSWICK_GREEN} />
          <Svgicons path="property" size={40} />
        </View>

        <View style={styles.titleSection}>
          <AppText
            text="Select the type of place you own"
            fontSize={22}
            type="SemiBold"
            color={Colors.BRUNSWICK_GREEN}
            textAlign="center"
          />
        </View>

        <View style={styles.form}>
          <DropdownField
            name="propertyType"
            control={control}
            errors={errors}
            label=""
            data={propertyOptions}
            placeholder="Select.."
          />

          <View style={styles.footer}>
            <AppButton
              loading={isLoading}
              title="Next"
              onPress={handleSubmit(onNext)}
              mt={20}
            />
            <AppButton
              title="Save & Exit"
              onPress={onSaveExit}
              mt={15}
              disabled={isLoading}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  bgCircle: {
    position: 'absolute',
    top: -50,
    alignSelf: 'center',
    width: 650,
    height: 650,
    borderRadius: 325,
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
  content: { flex: 1, paddingHorizontal: 25, justifyContent: 'center' },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40
  },
  titleSection: { marginBottom: 20 },
  form: { width: '100%' },
  footer: { marginTop: 80 }
});

export default CreateListingStepOneScreen;