import React from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import usePoliciesContainer from './PoliciesContainer';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import BGImage from '@/components/molecules/BGImage/BGImage';
import DateTimeInputField from '@/components/molecules/Input/DateTimeInputField';
import { goBack } from '@/services/navigationService';
import Metrics from '@/utility/Metrics';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import ExportOtaSheet from '@/components/molecules/ExportOtaSheet/ExportOtaSheet';
import { useTranslation } from 'react-i18next';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import FormFooterActions from '@/components/molecules/FormFooterActions/FormFooterActions';

const SelectPropertyPoliciesScreen = () => {
  const { t } = useTranslation();

  const POLICY_DATA = [
    { id: 'smoking', label: t('app.property_policies.smoking'), icon: 'smokingIcon' },
    { id: 'parties', label: t('app.property_policies.parties'), icon: 'partyIcon' },
    { id: 'pets', label: t('app.property_policies.pets'), icon: 'petIcon' },
    { id: 'quiet_hours', label: t('app.property_policies.quiet_hours'), icon: 'quietHoursIcon' },
  ];
  const {
    control,
    errors,
    selectedPolicies,
    togglePolicy,
    showTimeModal,
    setShowTimeModal,
    handleSubmit,
    onNext,
    onSaveExit,
    isLoading,
    setSelectedPolicies,
    isPolicySelected,
    isEdit,
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
  } = usePoliciesContainer();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.headerRow}>
             <ButtonView onPress={() => goBack()}>
                        <Svgicons path="back" size={40} />
                      </ButtonView>
            {!isEdit && <CircularProgress percentage={50} size={48} strokeWidth={4} />}
          </View>

          <AppText text={t('app.property_policies.title')} fontSize={32} type="Bold" mt={30} pr={40} />
          <AppText
            text={t('app.property_policies.subtitle')}
            fontSize={12}
            color={Colors.DARK_CHARCOAL_OPACITY}
            mt={29}
            pr={50}
          />

          {/* Cards Grid */}
          <View style={styles.grid}>
            {POLICY_DATA.map((item) => {
              const isActive = selectedPolicies.includes(item.id);
              return (
                <GlassCard
                  key={item.id}
                  width={'48%'}
                  onPress={() => togglePolicy(item.id)}
                  style={[styles.card, isActive && styles.activeCard]}
                >
                  <Svgicons path={item.icon} size={22} color={isActive ? Colors.WHITE : Colors.BLACK} />
                  <AppText text={item.label} mt={15} fontSize={12} type="Medium" />
                </GlassCard>
              );
            })}
          </View>
        </ScrollView>

        {/* Footer */}
      <FormFooterActions
          // Primary: Export if Edit, otherwise Next
          primaryTitle={isEdit ? t('app.property_policies.export') : t('app.property_policies.next')}
          onPrimaryPress={isEdit ? handleExport : handleSubmit(onNext)}
          isPrimaryLoading={isLoading}
          isPrimaryDisabled={isLoading || !isPolicySelected}

          // Secondary: Save & Exit
          secondaryTitle={t('app.property_policies.save_exit')}
          onSecondaryPress={handleSubmit(onSaveExit)}
          isSecondaryLoading={isLoading}
          isSecondaryDisabled={isLoading || !isPolicySelected}
          containerStyle={styles.footerOverride}
        />

        {/* Quiet Hours Modal */}
        <Modal visible={showTimeModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <AppText text={t('app.property_policies.select_quiet_hours')} fontSize={20} type="Bold" />
                <TouchableOpacity onPress={() => setShowTimeModal(false)}>
                  <Svgicons path="closeIcon" size={24} color={Colors.BLACK} />
                </TouchableOpacity>
              </View>
              <View style={styles.modalBody}>
                <DateTimeInputField
                  name="quiet_hours_start" label={t('app.property_policies.start_time')} mode="time"
                  control={control as any} errors={errors} placeholder="09:00 am"
                  rightIcon={<Svgicons path="ChevronDownIcon" size={14} />}
                />
                <DateTimeInputField
                  name="quiet_hours_end" label={t('app.property_policies.end_time')} mode="time"
                  control={control as any} errors={errors} placeholder="09:00 am"
                  rightIcon={<Svgicons path="ChevronDownIcon" size={14} />}
                />
                <AppButton
                  title={t('app.property_policies.save_quiet_hours')}
                  mt={10}
                  onPress={() => {
                    setSelectedPolicies(prev => [...new Set([...prev, 'quiet_hours'])]);
                    setShowTimeModal(false);
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>

        {/* ✅ Export Modal */}
        <ExportOtaSheet
          visible={bottomSheetVisible}
          onClose={() => setBottomSheetVisible(false)}
          title={t('app.property_policies.select_ota')}
          placeholder={t('app.property_policies.select_account')}
          buttonText={t('app.property_policies.export')}
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
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: Metrics.baseMargin, paddingTop: 10, paddingBottom: 150 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  backBtnWrapper: { width: 35, height: 35, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 30 },
  card: {
    width: '48%',
    height: 100,
    backgroundColor: Colors.TRANSPARENT,
    borderRadius: 11,
    marginBottom: Metrics.verticalScale(23),
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  activeCard: {
    backgroundColor: Colors.WHITE,
    borderColor: Colors.WHITE,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 15 },
      android: { elevation: 3 },
    }),
  },
  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 25, backgroundColor: 'white', paddingBottom: 40 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingBottom: 50 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  modalBody: { width: '100%' },
  footerOverride: { 
    // position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    padding: 25, 
    // backgroundColor: 'white', 
    paddingBottom: 40 
  },
});

export default SelectPropertyPoliciesScreen;