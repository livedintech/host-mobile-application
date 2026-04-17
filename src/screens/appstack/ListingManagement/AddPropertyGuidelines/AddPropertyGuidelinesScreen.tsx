import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import useGuidelinesContainer from './GuidelinesContainer';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import InputField from '@/components/molecules/Input/InputField';
import TextareaField from '@/components/molecules/Input/TextareaField';
import DropdownField from '@/components/molecules/Input/DropdownField';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import Metrics from '@/utility/Metrics';

const AddPropertyGuidelinesScreen = () => {
  const {
    control,
    errors,
    handleSubmit,
    onNext,
    onSaveExit,
    isLoading,
    arrivalGuideLength,
    houseRulesLength,
    checkoutInstructionsLength,
    isEdit,
    hideWifiFields,
    lockOptions
  } = useGuidelinesContainer();

  

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <View style={styles.headerRow}>
            <GradientBorder borderRadius={16} borderWidth={1} style={styles.backBtnWrapper}>
              <TouchableOpacity style={styles.backBtn} onPress={() => goBack()}>
                <Svgicons path='arrowLeftIcon' size={24} />
              </TouchableOpacity>
            </GradientBorder>
            {!isEdit && (
              <CircularProgress percentage={45} size={48} strokeWidth={4} />
            )}
          </View>

          <AppText text="Add property guidelines" fontSize={32} type="Bold" mt={30} />
          <AppText text="Fill these details so AI Auto Reply can assist guests on your behalf." fontSize={15} color="#6B6B6B" mt={10} />
          {!isEdit && (
            <View style={styles.skipWrapper}>
              <TouchableOpacity
                style={styles.skipBtn}
                onPress={() => navigate(NavigationRoutes.APP_STACK.SELECT_PROPERTY_POLICIES)}
              >
                <AppText text="Skip for now" color={Colors.WHITE} fontSize={14} type="Medium" />
              </TouchableOpacity>
            </View>
          )}


          <View style={[styles.formGroup, isEdit && { marginTop: Metrics.verticalScale(40) }]}>
            <TextareaField
              name="arrival_guide"
              control={control as any}
              errors={errors}
              label={`Arrival Guide`}
              placeholder={"• Property Name: Olive Residency\n• Address: Building 12, Al Noor Street, City Center"}
              multiline
            />
            <View style={styles.fieldGap} />
            <TextareaField
              name="property_rules"
              control={control as any}
              errors={errors}
              label={`Property Rules`}
              placeholder={"• Please maintain a low noise level at all times."}
              multiline
            />
            <View style={styles.fieldGap} />
            <TextareaField
              name="checkout_instructions"
              control={control as any}
              errors={errors}
              label={`Check-out Instructions`}
              placeholder={"• Please leave the apartment in a reasonable condition."}
              multiline
            />
          </View>

          <View style={styles.bottomSection}>
            {!hideWifiFields && (
              <>
                <InputField name="wifi_username" label="Wifi Username" control={control as any} errors={errors} placeholder="Wifi_Us" />
                <InputField name="wifi_password" label="Wifi Password" control={control as any} errors={errors} placeholder="Wifi123456" />

                <DropdownField
                  name="door_lock_code"
                  label="Door Lock Code"
                  control={control as any}
                  errors={errors}
                  placeholder="Select Lock"
                  data={lockOptions}
                />
              </>
            )}


            <Text style={styles.lockText}>
              Select a lock to continue. If no lock appears, set up your TTLock in More →{' '}
              <Text style={styles.linkText} onPress={() => navigate(NavigationRoutes.APP_STACK.YOUR_SMART_LOCKS)}>
                Smart Lock.
              </Text>
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {!isEdit && <AppButton title="Next" variant="secondary" onPress={handleSubmit(onNext)} loading={isLoading} />}
          <AppButton title="Save & Exit" mt={12} onPress={handleSubmit(onSaveExit)} disabled={isLoading} />
        </View>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 25, paddingTop: 10, paddingBottom: 220 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  backBtnWrapper: { width: 35, height: 35, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },
  backBtn: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  skipWrapper: { alignItems: 'flex-end', marginVertical: 15 },
  skipBtn: { backgroundColor: '#00A88E', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12 },
  formGroup: { marginTop: 10 },
  fieldGap: { height: 25 },
  bottomSection: { marginTop: 10 },
  lockText: { fontSize: 12, color: '#6B6B6B', marginTop: -5, lineHeight: 18 },
  linkText: { color: '#00A88E', textDecorationLine: 'underline', fontWeight: 'bold' },
  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 25, backgroundColor: 'rgba(255,255,255,0.95)', paddingBottom: 40 },
});

export default AddPropertyGuidelinesScreen;