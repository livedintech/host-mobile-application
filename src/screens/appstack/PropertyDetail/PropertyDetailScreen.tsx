import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, View, Image, Dimensions } from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
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
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const PropertyDetailScreen = () => {
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
    firstCategoryImages
  } = usePropertyDetailContainer();

  const isSupervisor = UserPermission?.role_key === 'supervisor';
  const [activeTab, setActiveTab] = useState<'Your Space' | 'Pricing'>('Your Space');

  const getAmenitiesPreview = () => {
    const features = propertyData.placeInfo?.features || '';
    const arr = features.split(', ').filter(Boolean);
    if (arr.length <= 3) return features;
    return `${arr.slice(0, 3).join(', ')}, + ${arr.length - 3} More`;
  };

  const latitude = parseFloat(data?.data?.listing?.lat) || 24.7136;
  const longitude = parseFloat(data?.data?.listing?.lng) || 46.6753;

  // DYNAMIC PROPERTY TOUR LOGIC
  const photoCategories = Object.keys(propertyData?.photos || {});
  const dynamicTourSubtitle = photoCategories.length > 0
    ? photoCategories.join(', ')
    : 'No photos available';

  const BasicCard = ({ title, subtitle, children, onPress }: any) => (
    <GlassCard width={'100%'} style={styles.cardContainer} >
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
          <AppText text={subtitle} fontSize={13} color={Colors.DARK_CHARCOAL_OPACITY} mt={4} />
        ) : null}
      </View>
    </ButtonView>
  );

  const OverlappingImages = ({ images }: any) => {
    const getHighResImage = (url: string) => {
      if (!url) return null;
      return url.split('?')[0];
    };

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
              <MenuOption disabled={isSupervisor} onSelect={() => handleMenuAction('channel')} style={[styles.menuItem, isSupervisor && styles.disabledMenuItem]}>
                <AppText text="Channel" fontSize={16} color={isSupervisor ? Colors.DISABLED_GREY : Colors.BLACK} style={styles.menuText} />
                <Svgicons path="channelIcon" size={20} color={isSupervisor ? Colors.DISABLED_GREY : Colors.BRUNSWICK_GREEN} />
              </MenuOption>

              <MenuOption onSelect={() => handleMenuAction('task')} style={styles.menuItem}>
                <AppText text="Task" fontSize={16} color={Colors.BLACK} style={styles.menuText} />
                <Svgicons path="taskIcon" size={20} color={Colors.BRUNSWICK_GREEN} />
              </MenuOption>

              <MenuOption disabled={isSupervisor} onSelect={() => handleMenuAction('calendar')} style={[styles.menuItem, isSupervisor && styles.disabledMenuItem]}>
                <AppText text="Calendar" fontSize={16} color={isSupervisor ? Colors.DISABLED_GREY : Colors.BLACK} style={styles.menuText} />
                <Svgicons path="calendarGridIcon" size={20} color={isSupervisor ? Colors.DISABLED_GREY : Colors.BRUNSWICK_GREEN} />
              </MenuOption>

              <MenuOption disabled={isSupervisor} onSelect={() => handleMenuAction('delete')} style={[styles.menuItem, isSupervisor && styles.disabledMenuItem]}>
                <AppText text="Delete Property" fontSize={16} color={isSupervisor ? Colors.DISABLED_GREY : Colors.INDIAN_RED} style={styles.menuText} />
                <Svgicons path="deleteIcon" size={20} color={isSupervisor ? Colors.DISABLED_GREY : Colors.INDIAN_RED} />
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>

        <View style={styles.titleSection}>
          <AppText text="Listing Editor" fontSize={32} type="Bold" color={Colors.BLACK} />
        </View>
        <View style={{
          marginHorizontal: Metrics.scale(33)
        }}>
          <GlassCard width={'100%'} style={styles.tabSwitcher}>
            <ButtonView
              style={[styles.tabBtn, activeTab === 'Your Space' && styles.activeTabBtn, { backgroundColor: activeTab === 'Your Space' ? Colors.EMERALD_TEAL : Colors.WHITE_OPACITY_90 }]}
              onPress={() => setActiveTab('Your Space')}
            >
              <Svgicons path={activeTab === 'Your Space' ? 'houseRoofShelterWhite' : "houseRoofShelterBlack"} size={16} stroke={activeTab === 'Your Space' ? Colors.WHITE : Colors.BLACK} />
              <AppText text="Your Space" fontSize={14} type="Medium" color={activeTab === 'Your Space' ? Colors.WHITE : Colors.BLACK} ml={8} />
            </ButtonView>

            <ButtonView
              style={[styles.tabBtn, activeTab === 'Pricing' && styles.activeTabBtn, { backgroundColor: activeTab === 'Pricing' ? Colors.EMERALD_TEAL : Colors.WHITE_OPACITY_90 }]}
              onPress={() => setActiveTab('Pricing')}
            >
              <Svgicons path={activeTab === 'Pricing' ? 'adWhite' : "adr"} size={16} stroke={activeTab === 'Pricing' ? Colors.WHITE : Colors.BLACK} />
              <AppText text="Pricing" fontSize={14} type="Medium" color={activeTab === 'Pricing' ? Colors.WHITE : Colors.BLACK} ml={8} />
            </ButtonView>
          </GlassCard>
        </View>

        <RefreshableScrollView
          isLoading={isLoading}
          onRefresh={refetch}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'Your Space' ? (
            <>
              <AppText
                text="Export your listing to automatically sync and apply all updates across your connected OTA platforms."
                fontSize={12}
                color={Colors.DARK_CHARCOAL_OPACITY}
                lineHeight={22}
                mb={25}
                px={25}
              />

              <View style={styles.exportRow}>
                {/* <ButtonView style={styles.exportPill} onPress={handleExport} disabled={isSupervisor}>
                  <AppText text="Export" fontSize={14} type="Medium" color={Colors.BLACK} />
                </ButtonView> */}
                <AppButton borderRadius={10} fontSize={14} style={styles.exportPill} title='Export' variant='primary' onPress={handleExport} disabled={isSupervisor} />
              </View>

              <BasicCard title="Property Tour" onPress={() => handleEditPhotosVideos()}>
                <View style={{ marginBottom: 15 }}>
                  <OverlappingImages images={firstCategoryImages} />
                </View>
                <AppText text={dynamicTourSubtitle} />
              </BasicCard>

              <BasicCard title="Property Title" subtitle={propertyData.title || 'Untitled'} onPress={() => handleEditSection('HouseDetails')} />

              <BasicCard title="Property Description" subtitle={propertyData.houseDetails?.description || 'No description provided.'} onPress={() => handleEditSection('HouseDetails')} />

              <BasicCard title="Location"
              // onPress={() => handleEditSection('Address')}
              >
                <View style={styles.mapContainer} pointerEvents="none">
                  <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={{
                      latitude: latitude,
                      longitude: longitude,
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

              <IconCard title="Amenities" subtitle={getAmenitiesPreview() || 'None added'} icon="heart" onPress={() => handleEditSection('PlaceInfo')} />

              <IconCard title="Property Policies" subtitle="Smoking, Parties, +2 More" icon="alarmLight" onPress={() => handleEditSection('Guidelines')} />

              <IconCard title="Arrival Guide" subtitle={propertyData.guidelines?.arrivalGuide || 'Not provided'} icon="wavingHand" onPress={() => handleEditSection('Guidelines')} />

              <IconCard title="Property Guidelines" subtitle="House Rules, Check-out Instructions" icon="clipboardCheck" onPress={() => handleEditSection('Guidelines')} />

              <IconCard title="Booking Details" subtitle={`Booking Type, Check-in, Check-out`} icon="calendarDate" onPress={() => handleEditSection('BookingDetails')} />

              <IconCard title="Booking Rules" subtitle={`Min Nights: ${propertyData.placeInfo?.minNights || 'N/A'}`} icon="direct" onPress={() => handleEditSection('BookingDetails')} />

              <IconCard title="Cancel Policies" subtitle="Airbnb, Gathern, Booking.com" icon="closeCircle" onPress={() => handleEditSection('CancelPolicies')} />

              <IconCard title="Wifi & Door Lock" subtitle="Wifi Details, Smart Door Lock" icon="deviceDatabaseEncryption" onPress={() => handleEditSection('HouseDetails')} />

              <IconCard title="Property Disclosure Details" subtitle="Exterior Security Camera, + 2 More" icon="cctvCamera" onPress={() => handleEditSection('Disclosure')} />

              <IconCard title="Ownership License Documents" subtitle="Property Document, + 2 More" icon="fileDoc" onPress={() => handleEditSection('Documents')} />
            </>
          ) : (
            <>
              <IconCard title="Pricing" subtitle="Weekday, Weekend Base, + 3 More" icon="adr" onPress={() => handleEditSection('Pricing')} />

              {/* <IconCard title="Discounts" subtitle="Weekly, Monthly, + 2 More" icon="discountPercentCoupon" onPress={() => handleEditSection('Pricing')} /> */}

              <IconCard title="AI Dynamic Pricing" subtitle={propertyData.aiPricing?.pricingMode === 1 ? 'Conservative Mode' : 'Aggressive Mode'} icon="rocket" onPress={() => handleEditSection('AIPricing')} />
            </>
          )}

        </RefreshableScrollView>

        <Modal
          visible={bottomSheetVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setBottomSheetVisible(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setBottomSheetVisible(false)}>
            <Pressable style={styles.bottomSheet} onPress={(e) => e.stopPropagation()}>
              <View style={styles.handleBar} />
              <AppText text="Select OTA Account" fontSize={20} type="SemiBold" color={Colors.PINE_FOREST} mb={20} />
              <View style={{
                paddingBottom: Metrics.verticalScale(30)
              }}>
                <DropdownField
                  name="ota_account"
                  control={otaControl}
                  errors={otaErrors}
                  label=""
                  data={listingOptions}
                  placeholder="Select Account"
                  dropdownPosition='top'
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
          {/* </BGImage> */}
        </Modal>

      </View>
    </BGImage>
  );
};

const optionsStyles = {
  optionsContainer: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    width: 200,
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
    marginTop: 20
  },
  // backButton: {
  //   width: 44,
  //   height: 44,
  //   borderRadius: 22,
  //   borderWidth: 1,
  //   borderColor: '#E5E5E5',
  //   backgroundColor: 'transparent',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  menuTriggerBtn: {
    padding: 10,
  },
  titleSection: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  tabSwitcher: {
    flexDirection: 'row',
    padding: 6,
    borderRadius: 30,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    gap: 15,
    paddingHorizontal: Metrics.scale(18),
    paddingVertical: Metrics.verticalScale(14)
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  exportRow: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  exportPill: {
    paddingHorizontal: Metrics.scale(24),
    paddingVertical: 0,
    width: Metrics.scale(114),
    height: Metrics.verticalScale(40)
  },
  cardContainer: {
    backgroundColor: Colors.TRANSPARENT,
    borderRadius: 20,
    padding: Metrics.scale(20),
    marginBottom: Metrics.verticalScale(22),
  },
  basicCardContent: {
    width: '100%',
  },
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
    marginBottom: 0
  },
  iconCardTextCol: {
    flex: 1,
  },
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
  mapPlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: '#E8F3EB',
    borderRadius: 16,
    marginTop: 15,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  mapInnerPattern: {
    position: 'absolute',
    width: '150%',
    height: '150%',
    backgroundColor: '#D1E6D6',
    opacity: 0.3,
    transform: [{ rotate: '45deg' }],
  },
  pinCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00A68A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00A68A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  menuText: {
    flex: 1,
  },
  disabledMenuItem: {
    backgroundColor: '#FAFAFA',
    opacity: 0.6,
  },
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
  map: {
    ...StyleSheet.absoluteFillObject,
  },
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