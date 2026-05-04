import AppPressable from '@/components/atoms/AppPressable/AppPressable';
import React from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useDescribeHouseContainer from './DescribeHouseContainer';
import TextareaField from '@/components/molecules/Input/TextareaField';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import { goBack } from '@/services/navigationService';
import BGImage from '@/components/molecules/BGImage/BGImage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Metrics from '@/utility/Metrics';
import DropdownField from '@/components/molecules/Input/DropdownField';
import { useTranslation } from 'react-i18next';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

const DescribeHouseScreen = () => {
  const {
    control,
    errors,
    handleSubmit,
    onNext,
    isLoading,
    descriptionLength,
    titleLength,
    onSaveExit,
    isEdit,
    editType,
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
  } = useDescribeHouseContainer();
  const { t } = useTranslation();

  const showTitle = !editType || editType === 'title';
  const showDescription = !editType || editType === 'description';

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bottomOffset={80}
          scrollIndicatorInsets={{ bottom: 0 }}
          automaticallyAdjustKeyboardInsets={false}
        >
          {/* Header Row */}
          <View style={styles.headerRow}>
            <ButtonView onPress={() => goBack()}>
              <Svgicons path="back" size={40} />
            </ButtonView>
            {!isEdit && <CircularProgress percentage={40} size={48} strokeWidth={4} />}
          </View>

          <AppText text={t('app.describe_house.title')} fontSize={32} type="Bold" mt={35} mb={28} pr={60} />
          <AppText
            text={t('app.describe_house.subtitle')}
            fontSize={12}
            color={Colors.DARK_CHARCOAL_OPACITY}
            mt={12}
            mb={35}
          />

          {showTitle && (
            <TextareaField
              name="name"
              control={control}
              errors={errors}
              label={t('app.describe_house.title_label')}
              placeholder={t('app.describe_house.title_placeholder')}
              multiline={true}
              numberOfLines={2}
              wordLimit={50}
              descriptionLength={titleLength}
              sparkleIcon
              height={65}
            />
          )}

          {showDescription && (
            <View style={styles.descriptionWrapper}>
              <TextareaField
                name="listing_descriptions"
                control={control}
                errors={errors}
                label={t('app.describe_house.description_label')}
                placeholder={t('app.describe_house.description_placeholder')}
                multiline={true}
                numberOfLines={6}
                wordLimit={500}
                descriptionLength={descriptionLength}
                sparkleIcon
              />
            </View>
          )}
        </KeyboardAwareScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {!isEdit && (
            <>
              <AppButton
                title={t('app.describe_house.next')}
                onPress={handleSubmit(onNext)}
                loading={isLoading}
                variant='secondary'
                backgroundColor={Colors.WHITE}
              />
              <AppButton
                title={t('app.describe_house.save_exit')}
                onPress={handleSubmit(onSaveExit)}
                mt={15}
                disabled={isLoading}
              />
            </>
          )}

          {isEdit && (
            <>
              {/* ✅ Export button — sirf edit mode mein */}
              <AppButton
                title={t('app.describe_house.export')}
                onPress={handleExport}
                variant='secondary'
                mb={12}
                disabled={isLoading}
              />
              <AppButton
                title={t('app.describe_house.save_exit')}
                onPress={handleSubmit(onSaveExit)}
                loading={isLoading}
              />
            </>
          )}
        </View>

        {/* ✅ Export Modal */}
        <Modal
          visible={bottomSheetVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setBottomSheetVisible(false)}
        >
          <AppPressable style={styles.modalOverlay} onPress={() => setBottomSheetVisible(false)}>
            <AppPressable style={styles.bottomSheet} onPress={(e) => e.stopPropagation()}>
              <View style={styles.handleBar} />
              <AppText
                text={t('app.describe_house.select_ota')}
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
                  placeholder={t('app.describe_house.select_account')}
                  dropdownPosition="top"
                />
              </View>
              <AppButton
                title={t('app.describe_house.export')}
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
  container: { flex: 1, paddingHorizontal: Metrics.baseMargin },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  backBtnWrapper: {
    width: 35,
    height: 35,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionWrapper: { marginTop: 25 },
  footer: { bottom: 0, right: 0, width: '100%', padding: 25, paddingBottom: 35 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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

export default DescribeHouseScreen;