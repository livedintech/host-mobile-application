import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import InputField from '@/components/molecules/Input/InputField';
import DropdownField from '@/components/molecules/Input/DropdownField';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { goBack } from '@/services/navigationService';
import useDiscountsContainer from './DiscountsContainer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useTranslation } from 'react-i18next';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import ExportOtaSheet from '@/components/molecules/ExportOtaSheet/ExportOtaSheet';
import FormFooterActions from '@/components/molecules/FormFooterActions/FormFooterActions';

const AddDiscountsScreen = () => {
  const {
    control,
    errors,
    handleSubmit,
    onSubmit,
    isLoading,
    isModalVisible,
    setModalVisible,
    isEdit,
    bottomSheetVisible,
    handleExport,
    handleExportSubmit,
    handleOtaSubmit,
    isExporting,
    listingOptions,
    otaControl,
    otaErrors,
    setBottomSheetVisible,
  } = useDiscountsContainer();
  const { t } = useTranslation();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>

           <View style={styles.headerRow}>
            <ButtonView onPress={() => goBack()}>
              <Svgicons path="back" size={40} />
            </ButtonView>
            {!isEdit && (
              <CircularProgress percentage={85} size={48} strokeWidth={4} />
            )}
          </View>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bottomOffset={0}
          automaticallyAdjustKeyboardInsets={false}
        >
       

          <AppText
            text={
              isEdit
                ? t('app.discounts.title_edit')
                : t('app.discounts.title_new')
            }
            fontSize={32}
            type="Bold"
            mt={30}
          />
          <AppText
            text={t('app.discounts.subtitle')}
            fontSize={12}
            color={Colors.DARK_CHARCOAL_OPACITY}
            mt={10}
            mb={15}
            pr={40}
          />

          <View style={styles.formGroup}>
            <InputField
              name="weekly_discount"
              label={t('app.discounts.weekly_label')}
              control={control as any}
              errors={errors}
              placeholder={t('app.discounts.weekly_placeholder')}
              keyboardType="numeric"
            />
            <View style={styles.gap} />
            <InputField
              name="monthly_discount"
              label={t('app.discounts.monthly_label')}
              control={control as any}
              errors={errors}
              placeholder={t('app.discounts.monthly_placeholder')}
              keyboardType="numeric"
            />
            <View style={styles.gap} />
            <InputField
              name="last_minute_discount"
              label={t('app.discounts.last_minute_label')}
              control={control as any}
              errors={errors}
              placeholder={t('app.discounts.last_minute_placeholder')}
              keyboardType="numeric"
            />
            <InputField
              name="early_bird_discount"
              label={t('app.discounts.early_bird_label')}
              control={control as any}
              errors={errors}
              placeholder={t('app.discounts.early_bird_placeholder')}
              keyboardType="numeric"
            />
          </View>
        </KeyboardAwareScrollView>

      <FormFooterActions
          // Primary Action: Export if edit mode, Next if creation mode
          primaryTitle={isEdit ? t('app.set_pricing.export') : t('app.discounts.next')}
          onPrimaryPress={isEdit ? handleExport : handleSubmit(d => onSubmit(d, false))}
          isPrimaryLoading={isLoading}
          isPrimaryDisabled={isLoading}

          // Secondary Action
          secondaryTitle={t('app.discounts.save_exit')}
          onSecondaryPress={handleSubmit(d => onSubmit(d, true))}
          isSecondaryLoading={isLoading}
          isSecondaryDisabled={isLoading}
          containerStyle={styles.footerOverride}
        />

        {/* Add Discount Modal (Screenshot 2 & 5) */}
        <Modal
          visible={isModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setBottomSheetVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <AppText
                  text={t('app.discounts.add_discount_title')}
                  fontSize={24}
                  type="Bold"
                />
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Svgicons path="closeIcon" size={24} />
                </TouchableOpacity>
              </View>
              <DropdownField
                errors={errors}
                name="temp_discount"
                label={t('app.discounts.select_discount_label')}
                control={control as any}
                data={[
                  {
                    label: t('app.discounts.last_minute_option'),
                    value: 'lmd',
                  },
                ]}
                placeholder={t('app.discounts.last_minute_option')}
              />
              <AppButton
                title={t('app.discounts.save')}
                mt={30}
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </Modal>
      </View>
      <ExportOtaSheet
        visible={bottomSheetVisible}
        onClose={() => setBottomSheetVisible(false)}
        title={t('app.set_pricing.select_ota')}
        placeholder={t('app.set_pricing.select_account')}
        buttonText={t('app.set_pricing.export')}
        otaControl={otaControl}
        otaErrors={otaErrors}
        handleOtaSubmit={handleOtaSubmit}
        handleExportSubmit={handleExportSubmit}
        listingOptions={listingOptions}
        isPending={isExporting}
      />
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 25, paddingTop: 10, paddingBottom: 220 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 10,
  },
  backBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  addBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#00A684',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 13,
    marginTop: 10,
  },
  formGroup: { marginTop: 20 },
  gap: { height: 15 },
footerOverride: {
    bottom: 0,
    width: '100%',
    padding: 25,
    // backgroundColor: 'white',
    paddingBottom: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

export default AddDiscountsScreen;
