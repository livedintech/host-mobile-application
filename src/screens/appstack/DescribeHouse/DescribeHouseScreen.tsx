import React from 'react';
import { StyleSheet, View } from 'react-native';
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
import ExportOtaSheet from '@/components/molecules/ExportOtaSheet/ExportOtaSheet';
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
              />
              <AppButton
                title={t('app.describe_house.save_exit')}
                onPress={handleSubmit(onSaveExit)}
                mt={15}
                loading={isLoading}
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
        <ExportOtaSheet
          visible={bottomSheetVisible}
          onClose={() => setBottomSheetVisible(false)}
          title={t('app.describe_house.select_ota')}
          placeholder={t('app.describe_house.select_account')}
          buttonText={t('app.describe_house.export')}
          otaControl={otaControl}
          otaErrors={otaErrors}
          handleOtaSubmit={handleOtaSubmit}
          handleExportSubmit={handleExportSubmit}
          listingOptions={listingOptions}
          isPending={isPendingExporting}
        />

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
  footer: { bottom: 0, right: 0, width: '100%', paddingBottom: 35 },
});

export default DescribeHouseScreen;