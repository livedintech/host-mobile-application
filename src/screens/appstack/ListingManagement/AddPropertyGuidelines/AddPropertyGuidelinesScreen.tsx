import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Pressable, Modal } from 'react-native';
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

const AddPropertyGuidelinesScreen = () => {
  const {
    control,
    errors,
    handleSubmit,
    onNext,
    onSaveExit,
    isLoading,
    isEdit,
    hideWifiFields,
    lockOptions,
    // ✅ Export
    handleExport,
    handleExportSubmit,
    bottomSheetVisible,
    setBottomSheetVisible,
    otaControl,
    otaErrors,
    handleOtaSubmit,
    listingOptions,
    isPendingExporting,
  } = useGuidelinesContainer();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bottomOffset={120}
          scrollIndicatorInsets={{ bottom: 0 }}
          automaticallyAdjustKeyboardInsets={false}
          bounces={false}
        >
          <View style={styles.headerRow}>
            <GradientBorder borderRadius={16} borderWidth={1} style={styles.arrowCircleInner}>
              <Pressable style={styles.arrowCircleInner} onPress={() => goBack()}>
                <Svgicons path='arrowLeftIcon' size={24} />
              </Pressable>
            </GradientBorder>
            {!isEdit && <CircularProgress percentage={45} size={48} strokeWidth={4} />}
          </View>

          <AppText
            text={isEdit ? "Property Guidelines" : "Add Property Guidelines"}
            fontSize={28}
            type="Bold"
            mt={30}
          />
          <AppText
            text={`Fill these details so AI Auto Reply can assist guests \n on your behalf.`}
            fontSize={12}
            color={Colors.DARK_CHARCOAL_OPACITY}
            mt={10}
          />

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

          <View style={[styles.formGroup, isEdit && { marginTop: Metrics.verticalScale(20) }]}>
            <TextareaField
              name="arrival_guide"
              control={control as any}
              errors={errors}
              label="Arrival Guide"
              placeholder={"• Property Name: Olive Residency\n• Address: Building 12, Al Noor Street, City Center"}
              multiline
            />
            <View style={styles.fieldGap} />
            <TextareaField
              name="property_rules"
              control={control as any}
              errors={errors}
              label="Property Rules"
              placeholder={"• Please maintain a low noise level at all times."}
              multiline
            />
            <View style={styles.fieldGap} />
            <TextareaField
              name="checkout_instructions"
              control={control as any}
              errors={errors}
              label="Check-out Instructions"
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
        </KeyboardAwareScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {/* ✅ Export — sirf edit mode mein */}
          {isEdit && (
            <AppButton
              title="Export"
              onPress={handleExport}
              variant='secondary'
              mb={12}
            />
          )}
          {!isEdit && (
            <AppButton
              title="Next"
              variant="secondary"
              backgroundColor={Colors.WHITE}
              onPress={handleSubmit(onNext)}
              loading={isLoading}
            />
          )}
          <AppButton
            title="Save & Exit"
            mt={12}
            onPress={handleSubmit(onSaveExit)}
            disabled={isLoading}
          />
        </View>

        {/* ✅ Export Modal */}
        <Modal
          visible={bottomSheetVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setBottomSheetVisible(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setBottomSheetVisible(false)}>
            <Pressable style={styles.bottomSheet} onPress={(e) => e.stopPropagation()}>
              <View style={styles.handleBar} />
              <AppText
                text="Select OTA Account"
                fontSize={20}
                type="SemiBold"
                color={Colors.PINE_FOREST}
                mb={20}
              />
              <View style={{ paddingBottom: Metrics.verticalScale(30) }}>
                <DropdownField
                  name="ota_account"
                  control={otaControl}
                  errors={otaErrors}
                  label=""
                  data={listingOptions}
                  placeholder="Select Account"
                  dropdownPosition="top"
                />
              </View>
              <AppButton
                title="Export"
                onPress={handleOtaSubmit(handleExportSubmit)}
                mt={20}
                loading={isPendingExporting}
                backgroundColor="#00A68A"
                borderColor="transparent"
                color={Colors.WHITE}
              />
            </Pressable>
          </Pressable>
        </Modal>

      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container:        { flex: 1, paddingHorizontal: Metrics.baseMargin, paddingTop: 10 },
  content:          { paddingBottom: Metrics.verticalScale(120) },
  headerRow:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  arrowCircleInner: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },
  skipWrapper:      { alignItems: 'flex-end', marginVertical: 15 },
  skipBtn:          { backgroundColor: '#00A88E', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12 },
  formGroup:        { marginTop: 10 },
  fieldGap:         { height: 25 },
  bottomSection:    { marginTop: 10 },
  lockText:         { fontSize: 12, color: '#6B6B6B', marginTop: -5, lineHeight: 18 },
  linkText:         { color: '#00A88E', textDecorationLine: 'underline', fontWeight: 'bold' },
  footer:           { bottom: 0, width: '100%', padding: 25, paddingBottom: 40 },
  modalOverlay:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  bottomSheet: {
    backgroundColor:      Colors.WHITE,
    borderTopLeftRadius:  24,
    borderTopRightRadius: 24,
    paddingHorizontal:    24,
    paddingTop:           12,
    paddingBottom:        40,
  },
  handleBar: {
    width:           40,
    height:          5,
    backgroundColor: '#D4D4D4',
    borderRadius:    3,
    alignSelf:       'center',
    marginBottom:    25,
  },
});

export default AddPropertyGuidelinesScreen;