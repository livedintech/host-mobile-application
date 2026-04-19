// WifiAndDoorLockScreen.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import InputField from '@/components/molecules/Input/InputField';
import DropdownField from '@/components/molecules/Input/DropdownField';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { goBack } from '@/services/navigationService';
import BGImage from '@/components/molecules/BGImage/BGImage';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import useWifiAndDoorLockContainer from './WifiAndDoorLockContainer';

const WifiAndDoorLockScreen = () => {
  const {
    control,
    errors,
    handleSubmit,
    onSaveExit,
    isLoading,
    lockOptions,
    handleSmartLockPress,
  } = useWifiAndDoorLockContainer();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <GradientBorder borderRadius={16} borderWidth={1} style={styles.arrowCircleInner}>
            <ButtonView style={styles.arrowCircleInner} onPress={() => goBack()}>
              <Svgicons path="arrowLeftIcon" size={24} />
            </ButtonView>
          </GradientBorder>
        </View>

        {/* Title */}
        <AppText
          text="Wifi & Door Lock"
          fontSize={32}
          type="Bold"
          color={Colors.BLACK}
          mt={41}
          mb={15}
        />
        <AppText
          text="Fill these details so AI Auto Reply can assist guests on your behalf."
          fontSize={12}
          color={Colors.DARK_CHARCOAL_OPACITY}
          lineHeight={22}
          mb={30}
        />

        {/* Form */}
        <View style={styles.form}>
          <InputField
            name="wifi_username"
            label="Wifi Username"
            control={control}
            errors={errors}
            placeholder="Wifi_Us"
          />

          <View style={{ marginTop: 20 }}>
            <InputField
              name="wifi_password"
              label="Wifi Password"
              control={control}
              errors={errors}
              placeholder="Wifi123456"
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <DropdownField
              name="door_lock_code"
              label="Door Lock Code"
              control={control}
              errors={errors}
              data={lockOptions}
              placeholder="Select Lock"
            />
          </View>

          {/* Helper text with Smart Lock link */}
          <View style={styles.helperTextRow}>
            <AppText
              text="Select a lock to continue. If no lock appears, set up your TTLock in More → "
              fontSize={13}
              color={Colors.DARK_CHARCOAL_OPACITY}
              lineHeight={20}
            />
            <ButtonView onPress={handleSmartLockPress}>
              <AppText
                text="Smart Lock."
                fontSize={13}
                color={Colors.EMERALD_TEAL}
                type="Medium"
                style={styles.smartLockLink}
              />
            </ButtonView>
          </View>
        </View>

       
      </KeyboardAwareScrollView>
       {/* Footer — sirf Save & Exit */}
        <View style={styles.footer}>
          <AppButton
            title="Save & Exit"
            onPress={handleSubmit(onSaveExit)}
            loading={isLoading}
          />
        </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container:      { flex: 1 },
  scrollContent:  { paddingHorizontal: 25, paddingBottom: 40 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  arrowCircleInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: { flex: 1 },
  helperTextRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  smartLockLink: {
    textDecorationLine: 'underline',
  },
   footer: {
    position: 'absolute',
    bottom: 40,
    left: 22,
    right: 22,
  },
});

export default WifiAndDoorLockScreen;