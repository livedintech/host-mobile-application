import React from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, ScrollView, Pressable, Platform } from 'react-native';
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

const POLICY_DATA = [
  { id: 'smoking', label: 'Smoking Allowed', icon: 'smokingIcon' },
  { id: 'parties', label: 'Parties Allowed', icon: 'partyIcon' },
  { id: 'pets', label: 'Pets Allowed', icon: 'petIcon' },
  { id: 'quiet_hours', label: 'Select Quiet Hours', icon: 'quietHoursIcon' },
];

const SelectPropertyPoliciesScreen = () => {
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
    isPolicySelected
  } = usePoliciesContainer();

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.headerRow}>
            <GradientBorder borderRadius={16} borderWidth={1} style={styles.backBtnWrapper}>
              <TouchableOpacity style={styles.backBtn} onPress={() => goBack()}>
                <Svgicons path='arrowLeftIcon' size={24} />
              </TouchableOpacity>
            </GradientBorder>
            <CircularProgress percentage={50} size={48} strokeWidth={4} />
          </View>

          <AppText text="Select property policies" fontSize={32} type="Bold" mt={30} pr={40}/>
          <AppText text="Choose which policies guests are permitted to follow for this listing." fontSize={12} color={Colors.DARK_CHARCOAL_OPACITY} mt={29} pr={50}/>

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
                  <Svgicons
                    path={item.icon}
                    size={22}
                    color={isActive ? Colors.WHITE : Colors.BLACK}
                  />
                  <AppText
                    text={item.label}
                    mt={15}
                    fontSize={12}
                    type="Medium"
                  />
                </GlassCard>

              );
            })}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <AppButton title="Next" variant="secondary" onPress={handleSubmit(onNext)} loading={isLoading} disabled={!isPolicySelected}/>
          <AppButton title="Save & Exit" mt={12} onPress={handleSubmit(onSaveExit)} disabled={isLoading || !isPolicySelected} />
        </View>

        {/* Quiet Hours Popup */}
        <Modal visible={showTimeModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <AppText text="Select Quiet Hours" fontSize={20} type="Bold" />
                <TouchableOpacity onPress={() => setShowTimeModal(false)}>
                  <Svgicons path="closeIcon" size={24} color={Colors.BLACK} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <DateTimeInputField
                  name="start_time" label="Start Time" mode="time"
                  control={control as any} errors={errors} placeholder="09:00 am"
                  rightIcon={<Svgicons path="ChevronDownIcon" size={14} />}
                />

                <DateTimeInputField
                  name="end_time" label="End Time" mode="time"
                  control={control as any} errors={errors} placeholder="09:00 am"
                  rightIcon={<Svgicons path="ChevronDownIcon" size={14} />}
                />

                <AppButton
                  title="Save Quiet Hours" mt={10}
                  onPress={() => {
                    setSelectedPolicies(prev => [...new Set([...prev, 'quiet_hours'])]);
                    setShowTimeModal(false);
                  }}
           
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: Metrics.baseMargin, paddingTop: 10, paddingBottom: 150 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  backBtnWrapper: { width: 35, height: 35, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center' },
  backBtn: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 30 },
  card: {
    width: '48%', height: 100
    , backgroundColor: Colors.TRANSPARENT, borderRadius: 11,
    marginBottom: Metrics.verticalScale(23), alignItems: 'flex-start', justifyContent: 'center',
  },
  activeCard: {
    backgroundColor: Colors.WHITE, borderColor: Colors.WHITE,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  iconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center' },
  activeIconCircle: { backgroundColor: 'rgba(255,255,255,0.2)' },
  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 25, backgroundColor: 'white', paddingBottom: 40 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingBottom: 50 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  modalBody: { width: '100%' }
});

export default SelectPropertyPoliciesScreen;