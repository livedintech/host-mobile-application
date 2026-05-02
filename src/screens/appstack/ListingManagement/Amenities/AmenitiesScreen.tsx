import AppPressable from '@/components/atoms/AppPressable/AppPressable';
import React from 'react';
import { StyleSheet, View, FlatList, Modal } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useAmenitiesContainer from './AmenitiesContainer';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import CircularProgress from '@/components/molecules/CircularProgress/CircularProgress';
import { goBack } from '@/services/navigationService';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import DropdownField from '@/components/molecules/Input/DropdownField';
import Metrics from '@/utility/Metrics';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import { useTranslation } from 'react-i18next';

const AMENITY_ICON_MAP: Record<string, string> = {
  ac: 'airConditioner', pool: 'pool', tv: 'tv', oven: 'oven',
  gym: 'gymEquipment', washer: 'washingMachine', wireless_internet: 'wifi',
  fire_extinguisher: 'fireExtinguisher', smoke_detector: 'smokeDetector',
  first_aid_kit: 'medicalBag', free_parking: 'parkingSign', paid_parking: 'parkingSign',
  laptop_friendly_workspace: 'workspace', alfresco_dining: 'outdoorDining',
  outdoor_seating: 'outdoorDining', patio_or_belcony: 'outdoorDining',
  dining_table: 'outdoorDining', breakfast: 'chickenGrilledStream',
  cooking_basics: 'chickenGrilledStream', kitchen: 'chickenGrilledStream',
  kitchenette: 'chickenGrilledStream', coffee_maker: 'chickenGrilledStream',
  coffee: 'chickenGrilledStream', hot_water_kettle: 'chickenGrilledStream',
  microwave: 'chickenGrilledStream', stove: 'chickenGrilledStream',
  blender: 'chickenGrilledStream', bread_maker: 'chickenGrilledStream',
  refrigerator: 'chickenGrilledStream', dishes_and_silverware: 'chickenGrilledStream',
  wine_glasses: 'chickenGrilledStream', hot_water: 'hotTub',
  wirelessinternet: 'wirelessinternet',wirelessinternet:'wirelessinternet',
};

const DEFAULT_ICON = 'heartIcon';

const AmenitiesScreen = () => {
  const {
    amenitiesList,
    selectedAmenities,
    toggleAmenity,
    onNext,
    isLoading,
    onSaveExit,
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
    isLoadingAmenities,
    refetch
  } = useAmenitiesContainer();
  const { t } = useTranslation();

  const renderAmenity = ({ item }: any) => {
    const isSelected = selectedAmenities.includes(item.key);
    const iconPath   = AMENITY_ICON_MAP[item.key] || DEFAULT_ICON;

    return (
      <GlassCard
        onPress={() => toggleAmenity(item.key)}
        style={[styles.card, isSelected && styles.selectedCard]}
      >
        <View style={styles.iconContainer}>
          <Svgicons path={iconPath} size={30} color={isSelected ? Colors.EMERALD_TEAL : Colors.BLACK} />
        </View>
        <AppText text={item.label || 'Name Here'} fontSize={12} type="Medium" textAlign="center" mt={8} />
      </GlassCard>
    );
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.headerRow}>
          <GradientBorder borderRadius={16} borderWidth={1} style={styles.backBtn}>
            <AppPressable style={styles.backBtn} onPress={() => goBack()}>
              <Svgicons path="arrowLeftIcon" size={24} />
            </AppPressable>
          </GradientBorder>
          {!isEdit && <CircularProgress percentage={30} size={48} strokeWidth={4} />}
        </View>

        <View style={styles.content}>
          <AppText text={t('app.amenities.title')} fontSize={26} type="Bold" />
          <AppText
            text={t('app.amenities.description')}
            fontSize={14}
            color="#6B6B6B"
            mt={10}
            mb={20}
          />
          <FlatListSimpleHandler
          onRefresh={refetch}
            isLoading={isLoadingAmenities}
            data={amenitiesList}
            renderItem={renderAmenity}
            keyExtractor={(item) => item.key}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.row}
            contentContainerStyle={{ paddingBottom: 160 }}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {/* ✅ Export — sirf edit mode mein */}
          {isEdit && (
            <AppButton
              title={t('app.amenities.export')}
              onPress={handleExport}
              variant='secondary'
              mb={12}
              backgroundColor={Colors.WHITE}
            />
          )}
          {!isEdit && (
            <AppButton
              title={t('app.amenities.next')}
              onPress={onNext}
              loading={isLoading}
              disabled={isLoading || selectedAmenities.length === 0}
              variant="secondary"
              backgroundColor={Colors.WHITE}
            />
          )}
          <AppButton
            title={t('app.amenities.save_exit')}
            mt={!isEdit ? 15 : 0}
            onPress={onSaveExit}
            loading={false}
            disabled={isLoading || selectedAmenities.length === 0}
          />
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
                text={t('app.amenities.select_ota')}
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
  container:  { flex: 1 },
  headerRow: {
    flexDirection:    'row',
    justifyContent:   'space-between',
    paddingHorizontal: 25,
    paddingTop:        10,
    alignItems:        'center',
  },
  backBtn: {
    width:           32,
    height:          32,
    borderRadius:    16,
    backgroundColor: Colors.WHITE,
    justifyContent:  'center',
    alignItems:      'center',
  },
  content:       { flex: 1, paddingHorizontal: 25, marginTop: 20 },
  row:           { justifyContent: 'space-between' },
  card: {
    width:           '48%',
    borderRadius:    16,
    paddingVertical: 20,
    alignItems:      'center',
    marginBottom:    15,
    borderWidth:     1.5,
    borderColor:     'rgba(255, 255, 255, 0.5)',
  },
  selectedCard:  { borderColor: Colors.WHITE, backgroundColor: Colors.WHITE },
  iconContainer: { height: 40, justifyContent: 'center' },
  footer: {
    position:        'absolute',
    bottom:          0,
    width:           '100%',
    padding:         25,
    paddingBottom:   35,
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
});

export default AmenitiesScreen;