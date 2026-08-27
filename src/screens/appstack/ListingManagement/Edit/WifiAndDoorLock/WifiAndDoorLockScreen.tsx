import React from 'react';
import { StyleSheet, View, RefreshControl } from 'react-native';
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
import ExportOtaSheet from '@/components/molecules/ExportOtaSheet/ExportOtaSheet';
import { useTranslation } from 'react-i18next';

const WifiAndDoorLockScreen = () => {
  const {
    control,
    errors,
    handleSubmit,
    onSaveExit,
    isLoading,
    lockOptions,
    handleSmartLockPress,
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
    onRefresh,
    isRefetching,
  } = useWifiAndDoorLockContainer();
  const { t } = useTranslation();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor={Colors.MEDIUM_JUNGLE_GREEN} colors={[Colors.MEDIUM_JUNGLE_GREEN]} />
        }
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
        <AppText text={t('app.wifi_door_lock.title')} fontSize={32} type="Bold" color={Colors.BLACK} mt={41} mb={15} />
        <AppText
          text={t('app.wifi_door_lock.subtitle')}
          fontSize={12}
          color={Colors.DARK_CHARCOAL_OPACITY}
          lineHeight={22}
          mb={30}
        />

        {/* Form */}
        <View style={styles.form}>
          <InputField name="wifi_username" label={t('app.wifi_door_lock.wifi_username_label')} control={control} errors={errors} placeholder={t('app.wifi_door_lock.wifi_username_placeholder')} />
          <View style={{ marginTop: 20 }}>
            <InputField name="wifi_password" label={t('app.wifi_door_lock.wifi_password_label')} control={control} errors={errors} placeholder={t('app.wifi_door_lock.wifi_password_placeholder')} />
          </View>
          <View style={{ marginTop: 20 }}>
            <DropdownField name="door_lock_code" label={t('app.wifi_door_lock.door_lock_label')} control={control} errors={errors} data={lockOptions} placeholder={t('app.wifi_door_lock.door_lock_placeholder')} />
          </View>

          <View style={styles.helperTextRow}>
            <AppText text={t('app.wifi_door_lock.lock_hint') + ' '} fontSize={13} color={Colors.DARK_CHARCOAL_OPACITY} lineHeight={20} />
            <ButtonView onPress={handleSmartLockPress}>
              <AppText text={t('app.wifi_door_lock.smart_lock_link')} fontSize={13} color={Colors.EMERALD_TEAL} type="Medium" style={styles.smartLockLink} />
            </ButtonView>
          </View>
        </View>

      </KeyboardAwareScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {/* ✅ Export button */}
        <AppButton
          title={t('app.wifi_door_lock.export')}
          onPress={handleExport}
          variant='secondary'
          mb={12}
        />
        <AppButton
          title={t('app.wifi_door_lock.save_exit')}
          onPress={handleSubmit(onSaveExit)}
          loading={isLoading}
        />
      </View>

      {/* ✅ Export Modal */}
      <ExportOtaSheet
        visible={bottomSheetVisible}
        onClose={() => setBottomSheetVisible(false)}
        title={t('app.wifi_door_lock.select_ota')}
        placeholder={t('app.wifi_door_lock.select_account')}
        buttonText={t('app.wifi_door_lock.export')}
        otaControl={otaControl}
        otaErrors={otaErrors}
        handleOtaSubmit={handleOtaSubmit}
        handleExportSubmit={handleExportSubmit}
        listingOptions={listingOptions}
        isPending={isPendingExporting}
      />

    </BGImage>
  );
};

const styles = StyleSheet.create({
  container:        { flex: 1 },
  scrollContent:    { paddingHorizontal: 25, paddingBottom: 160 },
  headerRow:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  arrowCircleInner: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },
  form:             { flex: 1 },
  helperTextRow:    { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  smartLockLink:    { textDecorationLine: 'underline' },
  footer:           { position: 'absolute', bottom: 40, left: 22, right: 22 },
});

export default WifiAndDoorLockScreen;