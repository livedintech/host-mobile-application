import AppPressable from '@/components/atoms/AppPressable/AppPressable';
// PropertyDetailScreen.tsx
import React, { useState } from 'react';
import { Modal, StyleSheet, View, Image, Platform } from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import { useTranslation } from 'react-i18next';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import usePropertyDetailContainer from './PropertyDetailContainer';
import Metrics from '@/utility/Metrics';
import RefreshableScrollView from '@/components/organisms/RefreshableScrollView/RefreshableScrollView';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import AppButton from '@/components/molecules/AppButton/AppButton';
import DropdownField from '@/components/molecules/Input/DropdownField';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import { goBack } from '@/services/navigationService';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';

const PropertyDetailScreen = () => {
  const { t } = useTranslation();
  const {
    propertyData,
    handleEditSection,
    handleMenuAction,
    refetch,
    isLoading,
    handleEditPhotosVideos,
    UserPermission,
    handleExportSubmit,
    handleOtaSubmit,
    listingOptions,
    bottomSheetVisible,
    otaControl,
    otaErrors,
    handleExport,
    setBottomSheetVisible,
    isPendingExporting,
    data,
    firstCategoryImages,
  } = usePropertyDetailContainer();

  const isSupervisor = UserPermission?.role_key === 'supervisor';
  const [activeTab, setActiveTab] = useState<'Your Space' | 'Pricing'>('Your Space');

  const latitude = parseFloat(data?.data?.listing?.lat) || 24.7136;
  const longitude = parseFloat(data?.data?.listing?.lng) || 46.6753;

  // ── Amenities preview ─────────────────────────────────────────────────────
  const getAmenitiesPreview = () => {
    const features = propertyData.placeInfo?.features || '';
    const arr = features.split(', ').filter(Boolean);
    if (arr.length <= 3) return features;
    return `${arr.slice(0, 3).join(', ')}, + ${arr.length - 3} More`;
  };

  // ── Dynamic tour subtitle ─────────────────────────────────────────────────
  const photoCategories = Object.keys(propertyData?.photos || {});
  const dynamicTourSubtitle = photoCategories.length > 0
    ? photoCategories.join(', ')
    : 'No photos available';

  // ── Sub-components ────────────────────────────────────────────────────────
  const BasicCard = ({ title, subtitle, children, onPress }: any) => (
    <GlassCard width={'100%'} style={styles.cardContainer}>
      <ButtonView onPress={onPress} disabled={isSupervisor}>
        <View style={styles.basicCardContent}>
          <AppText text={title} fontSize={16} type="Bold" color={Colors.BLACK} mb={8} />
          {subtitle ? (
            <AppText text={subtitle} fontSize={14} color={Colors.DARK_CHARCOAL_OPACITY} lineHeight={20} />
          ) : null}
          {children}
        </View>
      </ButtonView>
    </GlassCard>
  );

  const IconCard = ({ title, subtitle, icon, onPress }: any) => (
    <ButtonView style={styles.iconCardContainer} onPress={onPress} disabled={isSupervisor}>
      <GlassCard style={styles.iconBox}>
        <Svgicons path={icon} size={20} />
      </GlassCard>
      <View style={styles.iconCardTextCol}>
        <AppText text={title} fontSize={17} type="Medium" color={Colors.BLACK} />
        {subtitle ? (
          <AppText text={subtitle} fontSize={13} color={Colors.DARK_CHARCOAL_OPACITY} mt={4} numberOfLines={2} />
        ) : null}
      </View>
    </ButtonView>
  );

  const OverlappingImages = ({ images }: any) => {
    const getHighResImage = (url: string) => url ? url.split('?')[0] : null;
    const img1 = getHighResImage(images?.[0]?.url);
    const img2 = getHighResImage(images?.[1]?.url);
    const img3 = getHighResImage(images?.[2]?.url);

    return (
      <View style={styles.overlapWrapper}>
        {img2 && <Image source={{ uri: img2 }} style={[styles.tourImg, styles.tourImgLeft]} />}
        {img3 && <Image source={{ uri: img3 }} style={[styles.tourImg, styles.tourImgRight]} />}
        {img1 && <Image source={{ uri: img1 }} style={[styles.tourImg, styles.tourImgCenter]} />}
      </View>
    );
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')} style={styles.bgContainer}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <ButtonView onPress={() => goBack()}>
            <Svgicons path="back" size={40} />
          </ButtonView>
          <Menu>
            <MenuTrigger>
              <View style={styles.menuTriggerBtn}>
                <Svgicons path="menuVerticalDotsIcon" size={24} color={Colors.BLACK} />
              </View>
            </MenuTrigger>
            <MenuOptions customStyles={optionsStyles}>
              <MenuOption
                disabled={isSupervisor}
                onSelect={() => handleMenuAction('channel')}
                style={[styles.menuItem, isSupervisor && styles.disabledMenuItem]}
              >
                <AppText text={t('app.property_detail.channel')} fontSize={16} color={isSupervisor ? Colors.DISABLED_GREY : Colors.BLACK} style={styles.menuText} />
                <Svgicons path="channelIcon" size={20} color={isSupervisor ? Colors.DISABLED_GREY : Colors.BLACK} />
              </MenuOption>

              <MenuOption onSelect={() => handleMenuAction('task')} style={styles.menuItem}>
                <AppText text={t('app.property_detail.task')} fontSize={16} color={Colors.BLACK} style={styles.menuText} />
                <Svgicons path="taskIcon" size={20} />
              </MenuOption>

              <MenuOption
                disabled={isSupervisor}
                onSelect={() => handleMenuAction('calendar')}
                style={[styles.menuItem, isSupervisor && styles.disabledMenuItem]}
              >
                <AppText text={t('app.property_detail.calendar')} fontSize={16} color={isSupervisor ? Colors.DISABLED_GREY : Colors.BLACK} style={styles.menuText} />
                <Svgicons path="calendarGridIcon" size={20} color={isSupervisor ? Colors.DISABLED_GREY : Colors.BRUNSWICK_GREEN} />
              </MenuOption>

              <MenuOption
                disabled={isSupervisor}
                onSelect={() => handleMenuAction('delete')}
                style={[styles.menuItem, isSupervisor && styles.disabledMenuItem]}
              >
                <AppText text={t('app.property_detail.delete_listing')} fontSize={16} color={isSupervisor ? Colors.DISABLED_GREY : Colors.BLACK} style={styles.menuText} />
                <Svgicons path="TrashFull" size={20} color={isSupervisor ? Colors.DISABLED_GREY : Colors.BLACK} />
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <AppText text={t('app.property_detail.listing_editor')} fontSize={32} type="Bold" color={Colors.BLACK} />
        </View>

        {/* Tab Switcher */}
        <View style={{ marginHorizontal: Metrics.scale(33) }}>
          <GlassCard width={'100%'} style={styles.tabSwitcher}>
            <ButtonView
              style={[
                styles.tabBtn,
                activeTab === 'Your Space' && styles.activeTabBtn,
                { backgroundColor: activeTab === 'Your Space' ? Colors.EMERALD_TEAL : Colors.WHITE_OPACITY_90 },
              ]}
              onPress={() => setActiveTab('Your Space')}
            >
              <Svgicons
                path={activeTab === 'Your Space' ? 'houseRoofShelterWhite' : 'houseRoofShelterBlack'}
                size={16}
                stroke={activeTab === 'Your Space' ? Colors.WHITE : Colors.BLACK}
              />
              <AppText text={t('app.property_detail.your_space')} fontSize={14} type="Medium" color={activeTab === 'Your Space' ? Colors.WHITE : Colors.BLACK} ml={8} />
            </ButtonView>

            <ButtonView
              style={[
                styles.tabBtn,
                activeTab === 'Pricing' && styles.activeTabBtn,
                { backgroundColor: activeTab === 'Pricing' ? Colors.EMERALD_TEAL : Colors.WHITE_OPACITY_90 },
              ]}
              onPress={() => setActiveTab('Pricing')}
            >
              <Svgicons
                path={activeTab === 'Pricing' ? 'adWhite' : 'adr'}
                size={16}
                stroke={activeTab === 'Pricing' ? Colors.WHITE : Colors.BLACK}
              />
              <AppText text={t('app.property_detail.pricing')} fontSize={14} type="Medium" color={activeTab === 'Pricing' ? Colors.WHITE : Colors.BLACK} ml={8} />
            </ButtonView>
          </GlassCard>
        </View>

        {/* Scrollable Content */}
        <RefreshableScrollView
          isLoading={isLoading}
          onRefresh={refetch}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'Your Space' ? (
            <>
              <AppText
                text={t('app.property_detail.export_desc')}
                fontSize={12}
                color={Colors.DARK_CHARCOAL_OPACITY}
                lineHeight={22}
                mb={25}
                px={25}
              />

              {/* Export Button */}
              <View style={styles.exportRow}>
                <AppButton
                  borderRadius={10}
                  fontSize={14}
                  style={styles.exportPill}
                  title={t('app.property_detail.export')}
                  variant="primary"
                  onPress={handleExport}
                  disabled={isSupervisor}
                />
              </View>

              {/* Property Tour */}
              <BasicCard title={t('app.property_detail.property_tour')} onPress={() => handleEditPhotosVideos()}>
                <View style={{ marginBottom: 15 }}>
                  <OverlappingImages images={firstCategoryImages} />
                </View>
                <AppText text={dynamicTourSubtitle} />
              </BasicCard>

              {/* Property Title */}
              <BasicCard
                title={t('app.property_detail.property_title')}
                subtitle={propertyData.title || 'Untitled'}
                onPress={() => handleEditSection('HouseDetails', 'title')} // ✅
              />

              {/* Property Description */}
              <BasicCard
                title={t('app.property_detail.property_description')}
                subtitle={propertyData.houseDetails?.description || 'No description provided.'}
                onPress={() => handleEditSection('HouseDetails', 'description')} // ✅
              />

              {/* Location */}
              <BasicCard title={t('app.property_detail.location')} onPress={() => handleEditSection('Location')}>
                <View style={styles.mapContainer} pointerEvents="none">
                  <MapView
                    provider={Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={{
                      latitude,
                      longitude,
                      latitudeDelta: 0.05,
                      longitudeDelta: 0.05,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                    loadingEnabled
                  >
                    <Marker coordinate={{ latitude, longitude }} />
                  </MapView>
                </View>
                <AppText text={propertyData.address} color={Colors.DARK_CHARCOAL} fontSize={13} mt={20} />
              </BasicCard>

              {/* Property Information */}
              <IconCard
                title={t('app.property_detail.property_info')}
                subtitle={(() => {
                  const parts = [
                    propertyData.placeInfo?.size && `${propertyData.placeInfo.size} SQM`,
                    propertyData.placeInfo?.bedrooms && `${propertyData.placeInfo.bedrooms} Bedrooms`,
                    propertyData.placeInfo?.beds && `${propertyData.placeInfo.beds} Beds`,
                    propertyData.placeInfo?.bathrooms && `${propertyData.placeInfo.bathrooms} Bathrooms`,
                  ].filter(Boolean);

                  if (parts.length === 0) return 'Not set';
                  if (parts.length <= 2) return parts.join(', ');
                  return `${parts[0]}, + ${parts.length - 1} More`;
                })()}
                icon="infoIcon"
                onPress={() => handleEditSection('PlaceInfo')} // ✅
              />

              {/* Amenities */}
              <IconCard
                title={t('app.property_detail.amenities')}
                subtitle={getAmenitiesPreview() || 'None added'}
                icon="heart"
                onPress={() => handleEditSection('Amenities')} // ✅
              />

              {/* Property Policies */}
              <IconCard
                title={t('app.property_detail.property_policies')}
                subtitle={t('app.property_detail.policies_subtitle')}
                icon="alarmLight"
                onPress={() => handleEditSection('Policies')} // ✅
              />

              {/* Arrival Guide */}
              <IconCard
                title={t('app.property_detail.arrival_guide')}
                subtitle={propertyData.guidelines?.arrivalGuide || 'Not provided'}
                icon="wavingHand"
                onPress={() => handleEditSection('ArrivalGuide')}
              />

              {/* Property Guidelines */}
              <IconCard
                title={t('app.property_detail.property_guidelines')}
                subtitle={t('app.property_detail.guidelines_subtitle')}
                icon="clipboardCheck"
                onPress={() => handleEditSection('Guidelines')}
              />

              {/* Booking Details */}
              <IconCard
                title={t('app.property_detail.booking_details')}
                subtitle={`Booking Type: ${propertyData.bookingDetails?.bookingType || 'N/A'}, Check-in: ${propertyData.bookingDetails?.checkIn || 'N/A'}`}
                icon="calendarDate"
                onPress={() => handleEditSection('BookingDetails')}
              />

              {/* Booking Rules */}
              <IconCard
                title={t('app.property_detail.booking_rules')}
                subtitle={`Min Nights: ${propertyData.placeInfo?.minNights || 'N/A'}`}
                icon="direct"
                onPress={() => handleEditSection('BookingRules')} // ✅
              />

              {/* Cancel Policies */}
              <IconCard
                title={t('app.property_detail.cancel_policies')}
                subtitle={
                  [
                    propertyData.cancelPolicies?.airbnb && 'Airbnb',
                    propertyData.cancelPolicies?.gathern && 'Gathern',
                    propertyData.cancelPolicies?.booking && 'Booking.com',
                  ].filter(Boolean).join(', ') || 'Not set'
                }
                icon="closeCircle"
                onPress={() => handleEditSection('CancelPolicies')}
              />

              {/* Wifi & Door Lock */}
              <IconCard
                title={t('app.property_detail.wifi_door_lock')}
                subtitle={t('app.property_detail.wifi_subtitle')}
                icon="deviceDatabaseEncryption"
                onPress={() => handleEditSection('WifiAndDoorLock')}
              />

              {/* Property Disclosure */}
              <IconCard
                title={t('app.property_detail.disclosure_title')}
                subtitle={t('app.property_detail.disclosure_subtitle')}
                icon="cctvCamera"
                onPress={() => handleEditSection('Disclosure')}
              />

              {/* Documents ✅ dynamic subtitle */}
              <IconCard
                title={t('app.property_detail.ownership_title')}
                subtitle={
                  [
                    propertyData.documents?.ownership && 'Ownership',
                    propertyData.documents?.authorityLicense && 'Authority License',
                    propertyData.documents?.nationalId && 'National ID',
                  ].filter(Boolean).join(', ') || 'No documents uploaded'
                }
                icon="fileDoc"
                onPress={() => handleEditSection('Documents')}
              />
            </>
          ) : (
            <>
              {/* Pricing */}
              <IconCard
                title={t('app.property_detail.pricing')}
                subtitle={t('app.property_detail.pricing_subtitle')}
                icon="adr"
                onPress={() => handleEditSection('Pricing')}
              />

              {/* Discounts */}
              <IconCard
                title={t('app.property_detail.discounts')}
                subtitle={
                  propertyData?.pricing?.weekday
                    ? 'Weekly, Monthly, + 2 More '
                    : 'Not set'
                }
                icon="discountPercentCoupon"
                onPress={() => handleEditSection('discounts')}
              />
            </>
          )}
        </RefreshableScrollView>

        {/* Export Modal */}
        <Modal
          visible={bottomSheetVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setBottomSheetVisible(false)}
        >
          <AppPressable style={styles.modalOverlay} onPress={() => setBottomSheetVisible(false)}>
            <AppPressable style={styles.bottomSheet} onPress={(e) => e.stopPropagation()}>
              <View style={styles.handleBar} />
              <AppText text={t('app.property_detail.select_ota')} fontSize={20} type="SemiBold" color={Colors.PINE_FOREST} mb={20} />
              <View style={{ paddingBottom: Metrics.verticalScale(30) }}>
                <DropdownField
                  name="ota_account"
                  control={otaControl}
                  errors={otaErrors}
                  label=""
                  data={listingOptions}
                  placeholder={t('app.property_detail.select_account')}
                  dropdownPosition="top"
                />
              </View>
              <AppButton
                title={t('app.property_detail.export')}
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

const optionsStyles = {
  optionsContainer: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    width: 250,
    paddingVertical: 8,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginTop: 40,
  },
};

const styles = StyleSheet.create({
  bgContainer: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  menuTriggerBtn: { padding: 10 },
  titleSection: { paddingHorizontal: 20, marginTop: 10, marginBottom: 20 },
  tabSwitcher: {
    flexDirection: 'row',
    padding: 6,
    borderRadius: 30,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    gap: 15,
    paddingHorizontal: Metrics.scale(18),
    paddingVertical: Metrics.verticalScale(14),
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    height: Metrics.verticalScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  activeTabBtn: {
    backgroundColor: Colors.EMERALD_TEAL,
    shadowColor: Colors.EMERALD_TEAL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 50 },
  exportRow: { alignItems: 'flex-end', marginBottom: 20 },
  exportPill: {
    paddingHorizontal: Metrics.scale(24),
    paddingVertical: 0,
    width: Metrics.scale(114),
    height: Metrics.verticalScale(40),
  },
  cardContainer: {
    backgroundColor: Colors.TRANSPARENT,
    borderRadius: 20,
    padding: Metrics.scale(20),
    marginBottom: Metrics.verticalScale(22),
  },
  basicCardContent: { width: '100%' },
  iconCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 0,
  },
  iconCardTextCol: { flex: 1 },
  overlapWrapper: {
    height: 180,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 10,
  },
  tourImg: {
    width: '55%',
    height: 130,
    borderRadius: 16,
    position: 'absolute',
  },
  tourImgLeft: {
    left: '5%',
    transform: [{ rotate: '-8deg' }],
    zIndex: 1,
    opacity: 0.9,
  },
  tourImgRight: {
    right: '5%',
    transform: [{ rotate: '8deg' }],
    zIndex: 1,
    opacity: 0.9,
  },
  tourImgCenter: {
    width: '60%',
    height: 150,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  menuText: { flex: 1 },
  disabledMenuItem: { backgroundColor: '#FAFAFA', opacity: 0.6 },
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#D4D4D4',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 25,
  },
  map: { ...StyleSheet.absoluteFillObject },
  mapContainer: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    marginTop: 15,
    marginBottom: 10,
    overflow: 'hidden',
  },
});

export default PropertyDetailScreen;