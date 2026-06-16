import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  Modal,
} from 'react-native';
import useCheckoutInstructionContainer, {
  TASK_KEYS,
  TaskKey,
} from './CheckoutInstructionContainer';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import Metrics from '@/utility/Metrics';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useTranslation } from 'react-i18next';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import AppPressable from '@/components/atoms/AppPressable/AppPressable';
import DropdownField from '@/components/molecules/Input/DropdownField';

const TASK_LABEL_KEYS: Record<TaskKey, string> = {
  return_keys: 'app.checkoutInstruction.taskReturnKeys',
  turn_things_off: 'app.checkoutInstruction.taskTurnThingsOff',
  throw_trash: 'app.checkoutInstruction.taskThrowTrash',
  lock_up: 'app.checkoutInstruction.taskLockUp',
  gather_towels: 'app.checkoutInstruction.taskGatherTowels',
  additional_requests: 'app.checkoutInstruction.taskAdditionalRequests',
};

const CheckoutInstructionScreen = () => {
  const {
    tasks,
    setTaskChecked,
    setTaskDetail,
    onNext,
    onSaveExit,
    isLoading,
    isEdit,
    handleExport,
    handleExportSubmit,
    bottomSheetVisible,
    setBottomSheetVisible,
    otaControl,
    otaErrors,
    handleOtaSubmit,
    listingOptions,
    isPendingExporting
  } = useCheckoutInstructionContainer();
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
              <CircularProgress percentage={47} size={48} strokeWidth={4} />
            )}
          </View>

          <AppText
            text={t('app.checkoutInstruction.title')}
            fontSize={28}
            type="Bold"
            mt={30}
          />
          <AppText
            text={t('app.checkoutInstruction.subtitle')}
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
                  text={t('app.checkoutInstruction.skip')}
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
            {TASK_KEYS.map(key => {
              const task = tasks[key];
              return (
                <View key={key}>
                  <TouchableOpacity
                    style={styles.taskRow}
                    onPress={() => setTaskChecked(key, !task.checked)}
                    activeOpacity={0.7}
                  >
                    <Svgicons
                      path={
                        task.checked
                          ? 'CheckboxCheckedIcon'
                          : 'CheckboxUncheckedIcon'
                      }
                      size={22}
                    />
                    <AppText
                      text={t(TASK_LABEL_KEYS[key])}
                      fontSize={14}
                      type="Regular"
                      style={styles.taskLabel}
                    />
                  </TouchableOpacity>

                  {task.checked && (
                    <View style={styles.textareaContainer}>
                      <TextInput
                        style={styles.textarea}
                        value={task.detail}
                        onChangeText={val => setTaskDetail(key, val)}
                        placeholder={t(
                          'app.checkoutInstruction.taskDetailPlaceholder',
                        )}
                        placeholderTextColor="rgba(0, 0, 0, 0.3)"
                        multiline
                        selectionColor={Colors.BOTTLE_GREEN}
                      />
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </KeyboardAwareScrollView>

        <View style={styles.footer}>
          {!isEdit && (
            <AppButton
              title={t('app.checkoutInstruction.next')}
              variant="secondary"
              onPress={onNext}
              loading={isLoading}
            />
          )}
          {isEdit && (
            <AppButton
              title={t('app.amenities.export')}
              onPress={handleExport}
              variant="secondary"
              mb={12}
            />
          )}
          <AppButton
            title={t('app.checkoutInstruction.saveExit')}
            mt={12}
            onPress={onSaveExit}
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
                text={t('app.amenities.select_ota')}
                fontSize={20}
                type="SemiBold"
                color={Colors.PINE_FOREST}
                mb={20}
              />
              <View style={{ paddingBottom: Metrics.verticalScale(30) }}>
                <DropdownField
                  name="ota_account"
                  control={otaControl as any}
                  errors={otaErrors}
                  label=""
                  data={listingOptions}
                  placeholder={t('app.amenities.select_account')}
                  dropdownPosition="top"
                />
              </View>
              <AppButton
                title={t('app.amenities.export')}
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
  skipWrapper: { alignItems: 'flex-end', marginVertical: 15 },
  skipBtn: {
    backgroundColor: '#00A88E',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  formGroup: { marginTop: 10 },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Metrics.verticalScale(12),
    gap: 12,
  },
  taskLabel: {
    flex: 1,
    color: Colors.PINE_FOREST,
  },
  textareaContainer: {
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginBottom: Metrics.verticalScale(8),
    minHeight: Metrics.verticalScale(100),
  },
  textarea: {
    flex: 1,
    paddingHorizontal: Metrics.scale(16),
    paddingTop:
      Platform.OS === 'ios'
        ? Metrics.verticalScale(12)
        : Metrics.verticalScale(10),
    paddingBottom: Metrics.verticalScale(12),
    color: Colors.PINE_FOREST,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: Metrics.verticalScale(100),
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
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
  footer: { bottom: 0, width: '100%',paddingBottom: 40 },
});

export default CheckoutInstructionScreen;
