import React from 'react';
import { StyleSheet, View, Pressable, Modal } from 'react-native';
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

  const showTitle       = !editType || editType === 'title';
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
            <GradientBorder borderRadius={16} borderWidth={1} style={styles.backBtnWrapper}>
              <Pressable style={styles.backBtnWrapper} onPress={() => goBack()}>
                <Svgicons path='arrowLeftIcon' size={24} />
              </Pressable>
            </GradientBorder>
            {!isEdit && <CircularProgress percentage={40} size={48} strokeWidth={4} />}
          </View>

          <AppText text="Describe your property" fontSize={32} type="Bold" mt={35} mb={28} pr={60} />
          <AppText
            text="Short descriptions work best. You can always change it later"
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
              label="Property Title *"
              placeholder='"Cozy Villa with Pool in Riyadh"'
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
                label="Property Description *"
                placeholder='"Kick back and relax in this calm and stylish space."'
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
                title="Next"
                onPress={handleSubmit(onNext)}
                loading={isLoading}
                variant='secondary'
                backgroundColor={Colors.WHITE}
              />
              <AppButton
                title="Save & Exit"
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
                title="Export"
                onPress={handleExport}
                variant='secondary'
                mb={12}
                disabled={isLoading}
              />
              <AppButton
                title="Save & Exit"
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
  container:          { flex: 1, paddingHorizontal: Metrics.baseMargin },
  headerRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginTop:      10,
  },
  backBtnWrapper: {
    width:           35,
    height:          35,
    backgroundColor: Colors.WHITE,
    justifyContent:  'center',
    alignItems:      'center',
  },
  descriptionWrapper: { marginTop: 25 },
  footer: { bottom: 0, right: 0, width: '100%', padding: 25, paddingBottom: 35 },
  modalOverlay: {
    flex:            1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent:  'flex-end',
  },
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

export default DescribeHouseScreen;