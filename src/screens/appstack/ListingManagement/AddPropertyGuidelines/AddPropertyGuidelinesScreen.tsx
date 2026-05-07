import AppPressable from '@/components/atoms/AppPressable/AppPressable';
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Modal } from 'react-native';
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
import { useTranslation } from 'react-i18next';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

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
    guidelinesSection,
    lockOptions,
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
  const { t } = useTranslation();

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
            <ButtonView onPress={() => goBack()}>
              <Svgicons path="back" size={40} />
            </ButtonView>
            {!isEdit && (
              <CircularProgress percentage={45} size={48} strokeWidth={4} />
            )}
          </View>

          <AppText
            text={
              isEdit
                ? t('app.property_guidelines.title_edit')
                : t('app.property_guidelines.title_new')
            }
            fontSize={28}
            type="Bold"
            mt={30}
          />
          <AppText
            text={t('app.property_guidelines.subtitle')}
            fontSize={12}
            color={Colors.DARK_CHARCOAL_OPACITY}
            mt={10}
          />

          {!isEdit && (
            <View style={styles.skipWrapper}>
              <TouchableOpacity
                style={styles.skipBtn}
                onPress={() =>
                  navigate(NavigationRoutes.APP_STACK.SELECT_PROPERTY_POLICIES)
                }
              >
                <AppText
                  text={t('app.property_guidelines.skip')}
                  color={Colors.WHITE}
                  fontSize={14}
                  type="Medium"
                />
              </TouchableOpacity>
            </View>
          )}

          <View
            style={[
              styles.formGroup,
              isEdit && { marginTop: Metrics.verticalScale(20) },
            ]}
          >
            {guidelinesSection !== 'guidelines' && (
              <>
                <TextareaField
                  name="arrival_guide"
                  control={control as any}
                  errors={errors}
                  label={t('app.property_guidelines.arrival_guide_label')}
                  placeholder={
                    '• Property Name: Olive Residency\n• Address: Building 12, Al Noor Street, City Center'
                  }
                  multiline
                />
                <View style={styles.fieldGap} />
              </>
            )}
            {guidelinesSection !== 'arrival' && (
              <>
                <TextareaField
                  name="property_rules"
                  control={control as any}
                  errors={errors}
                  label={t('app.property_guidelines.property_rules_label')}
                  placeholder={
                    '• Please maintain a low noise level at all times.'
                  }
                  multiline
                />
                <View style={styles.fieldGap} />
                <TextareaField
                  name="checkout_instructions"
                  control={control as any}
                  errors={errors}
                  label={t(
                    'app.property_guidelines.checkout_instructions_label',
                  )}
                  placeholder={
                    '• Please leave the apartment in a reasonable condition.'
                  }
                  multiline
                />
              </>
            )}
          </View>

          <View style={styles.bottomSection}>
            {!hideWifiFields && (
              <>
                <InputField
                  name="wifi_username"
                  label={t('app.property_guidelines.wifi_username_label')}
                  control={control as any}
                  errors={errors}
                  placeholder={t(
                    'app.property_guidelines.wifi_username_placeholder',
                  )}
                />
                <InputField
                  name="wifi_password"
                  label={t('app.property_guidelines.wifi_password_label')}
                  control={control as any}
                  errors={errors}
                  placeholder={t(
                    'app.property_guidelines.wifi_password_placeholder',
                  )}
                />
                <DropdownField
                  name="door_lock_code"
                  label={t('app.property_guidelines.door_lock_label')}
                  control={control as any}
                  errors={errors}
                  placeholder={t(
                    'app.property_guidelines.door_lock_placeholder',
                  )}
                  data={lockOptions}
                />
              </>
            )}
            <Text style={styles.lockText}>
              {t('app.property_guidelines.lock_hint')}{' '}
              <Text
                style={styles.linkText}
                onPress={() =>
                  navigate(NavigationRoutes.APP_STACK.YOUR_SMART_LOCKS)
                }
              >
                {t('app.property_guidelines.smart_lock_link')}
              </Text>
            </Text>
          </View>
        </KeyboardAwareScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {/* ✅ Export — sirf edit mode mein */}
          {isEdit && (
            <AppButton
              title={t('app.property_guidelines.export')}
              onPress={handleExport}
              variant="secondary"
              mb={12}
            />
          )}
          {!isEdit && (
            <AppButton
              title={t('app.property_guidelines.next')}
              variant="secondary"
              backgroundColor={Colors.WHITE}
              onPress={handleSubmit(onNext)}
              loading={isLoading}
            />
          )}
          <AppButton
            title={t('app.property_guidelines.save_exit')}
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
          <AppPressable
            style={styles.modalOverlay}
            onPress={() => setBottomSheetVisible(false)}
          >
            <AppPressable
              style={styles.bottomSheet}
              onPress={e => e.stopPropagation()}
            >
              <View style={styles.handleBar} />
              <AppText
                text={t('app.property_guidelines.select_ota')}
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
                  placeholder={t('app.property_guidelines.select_account')}
                  dropdownPosition="top"
                />
              </View>
              <AppButton
                title={t('app.property_guidelines.export')}
                onPress={handleOtaSubmit(handleExportSubmit)}
                mt={20}
                loading={isPendingExporting}
                backgroundColor="#00A68A"
                borderColor="transparent"
                color={Colors.WHITE}
              />
            </AppPressable>
          </AppPressable>
        </Modal>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Metrics.baseMargin, paddingTop: 10 },
  content: { paddingBottom: Metrics.verticalScale(120) },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  arrowCircleInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipWrapper: { alignItems: 'flex-end', marginVertical: 15 },
  skipBtn: {
    backgroundColor: '#00A88E',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  formGroup: { marginTop: 10 },
  fieldGap: { height: 25 },
  bottomSection: { marginTop: 10 },
  lockText: { fontSize: 12, color: '#6B6B6B', marginTop: -5, lineHeight: 18 },
  linkText: {
    color: '#00A88E',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  footer: { bottom: 0, width: '100%', padding: 25, paddingBottom: 40 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#D4D4D4',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 25,
  },
});

export default AddPropertyGuidelinesScreen;
