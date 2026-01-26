import React from 'react';
import { StyleSheet, View } from 'react-native';
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

const PropertyDetailScreen = () => {
  const { propertyData, handleEditSection, handleMenuAction, refetch, isLoading } = usePropertyDetailContainer();

  const InfoCard = ({ title, icon, onEdit, children }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleWithIcon}>
          <AppText text={title} fontSize={18} type="Bold" color={Colors.BRUNSWICK_GREEN} />
          <Svgicons path={icon} size={20} color={Colors.BRUNSWICK_GREEN} ml={8} />
        </View>
        <ButtonView onPress={onEdit}>
          <Svgicons path="editIcon" size={18} color={Colors.BLACK} />
        </ButtonView>
      </View>
      <View style={styles.cardContent}>{children}</View>
    </View>
  );

  const LabelValue = ({ label, value }: { label: string; value: any }) => (
    <View style={styles.row}>
      <AppText text={`${label}: `} type="Bold" color={Colors.BRUNSWICK_GREEN} fontSize={14} />
      <AppText text={value} color={Colors.BRUNSWICK_GREEN} fontSize={14} />
    </View>
  );

  return (
    <View style={styles.container}>
      <RefreshableScrollView
        isLoading={isLoading}
        onRefresh={refetch} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header with Menu Dots */}
        <View style={styles.header}>
          <AppText text={propertyData.title} fontSize={28} type="Bold" color={Colors.BRUNSWICK_GREEN} />

          <Menu>
            <MenuTrigger>
              <View style={{ padding: 5 }}>
                <Svgicons path="menuDotsIcon" size={24} color={Colors.BRUNSWICK_GREEN} />
              </View>
            </MenuTrigger>

            <MenuOptions customStyles={optionsStyles}>
              <MenuOption onSelect={() => handleMenuAction('channel')} style={styles.menuItem}>
                <AppText text="Channel" fontSize={16} color={Colors.BLACK} style={styles.menuText} />
                <Svgicons path="channelIcon" size={20} color={Colors.BRUNSWICK_GREEN} />
              </MenuOption>

              <MenuOption onSelect={() => handleMenuAction('task')} style={styles.menuItem}>
                <AppText text="Task" fontSize={16} color={Colors.BLACK} style={styles.menuText} />
                <Svgicons path="taskIcon" size={20} color={Colors.BRUNSWICK_GREEN} />
              </MenuOption>

              <MenuOption onSelect={() => handleMenuAction('calendar')} style={styles.menuItem}>
                <AppText text="Calendar" fontSize={16} color={Colors.BLACK} style={styles.menuText} />
                <Svgicons path="calendarGridIcon" size={20} color={Colors.BRUNSWICK_GREEN} />
              </MenuOption>

              <MenuOption onSelect={() => handleMenuAction('delete')} style={styles.menuItem}>
                <AppText text="Delete Property" fontSize={16} color={Colors.INDIAN_RED} style={styles.menuText} />
                <Svgicons path="deleteIcon" size={20} color={Colors.INDIAN_RED} />
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>

        {/* Address Card */}
        <InfoCard title="Address" icon="pinLocationIcon" onEdit={() => handleEditSection('Address')}>
          <AppText text={propertyData.address} color={Colors.BRUNSWICK_GREEN} lineHeight={20} />
        </InfoCard>

        {/* Place Information Card */}
        <InfoCard title="Place Information" icon="infoIcon" onEdit={() => handleEditSection('PlaceInfo')}>
          <LabelValue label="Size" value={propertyData.placeInfo.size} />
          <LabelValue label="Number of Bedrooms" value={propertyData.placeInfo.bedrooms} />
          <LabelValue label="Number of Bed" value={propertyData.placeInfo.beds} />
          <LabelValue label="Kitchen" value={propertyData.placeInfo.kitchen} />
          <LabelValue label="Pool" value={propertyData.placeInfo.pool} />
          <LabelValue label="Long Term Stay" value={propertyData.placeInfo.longTerm} />
          <LabelValue label="Minimum Day Stay" value={propertyData.placeInfo.minStay} />
          <LabelValue label="Other Features" value={propertyData.placeInfo.features} />
        </InfoCard>

        {/* Property Images Update */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.titleWithIcon}>
              <AppText text="Property Images" fontSize={18} type="Bold" color={Colors.BRUNSWICK_GREEN} />
              <Svgicons path="imageIcon" size={20} color={Colors.BRUNSWICK_GREEN} ml={8} />
            </View>
          </View>
          <ButtonView style={styles.mediaButton} onPress={() => handleEditSection('Interior')}>
            <Svgicons path="attachmentIcon" size={18} />
            <AppText text="Update Interior Images" ml={10} />
          </ButtonView>
          <ButtonView style={styles.mediaButton} onPress={() => handleEditSection('Exterior')}>
            <Svgicons path="attachmentIcon" size={18} />
            <AppText text="Update Exterior Images" ml={10} />
          </ButtonView>
          <ButtonView style={styles.mediaButton} onPress={() => handleEditSection('Bathroom')}>
            <Svgicons path="attachmentIcon" size={18} />
            <AppText text="Update Bathroom Images" ml={10} />
          </ButtonView>
        </View>

        {/* House Details */}
        <InfoCard title="House Details" icon="homeIcon" onEdit={() => handleEditSection('HouseDetails')}>
          <AppText text="House Title: " type="Bold" color={Colors.BRUNSWICK_GREEN} />
          <AppText text={propertyData.title} color={Colors.BRUNSWICK_GREEN} mb={20} />
          <AppText text="Description: " type="Bold" color={Colors.BRUNSWICK_GREEN} />
          <AppText text={propertyData.houseDetails.description} color={Colors.BRUNSWICK_GREEN} mb={15} lineHeight={20} />
          <LabelValue label="Booking Type" value={propertyData.houseDetails.bookingType} />
          <LabelValue label="Guest Eligibility" value={propertyData.houseDetails.guestEligibility} />
          <LabelValue label="Check-in Time" value={propertyData.houseDetails.checkIn} />
          <LabelValue label="Check-out Time" value={propertyData.houseDetails.checkOut} />
        </InfoCard>

        {/* Pricing */}
        <InfoCard title="Pricing" icon="cardIcon" onEdit={() => handleEditSection('Pricing')}>
          <LabelValue label="Weekday Base Price" value={propertyData.pricing.weekday} />
          <LabelValue label="Weekend Base Price" value={propertyData.pricing.weekend} />
          <LabelValue label="Discount" value={propertyData.pricing.discount} />
          <LabelValue label="Tax(VAT)" value={propertyData.pricing.tax} />
          <LabelValue label="Markup Price" value={propertyData.pricing.markup} />
          <LabelValue label="Cleaning Fee" value={propertyData.pricing.cleaning} />
        </InfoCard>

        {/* Disclosure */}
        <InfoCard title="Property Disclosure Details" icon="bookIcon" onEdit={() => handleEditSection('Disclosure')}>
          <LabelValue label="Exterior Security Camera" value={propertyData.disclosure.cameras} />
          <LabelValue label="Noise Decibel Monitor" value={propertyData.disclosure.noiseMonitor} />
          <LabelValue label="Weapon on Property" value={propertyData.disclosure.weapons} />
        </InfoCard>

        {/* Ownership Documents */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.titleWithIcon}>
              <AppText text="Ownership Documents" fontSize={18} type="Bold" color={Colors.BRUNSWICK_GREEN} />
              <Svgicons path="docIcon" size={20} color={Colors.BRUNSWICK_GREEN} ml={8} />
            </View>
          </View>
          <ButtonView style={styles.docButton} onPress={() => handleEditSection('Documents')}><AppText text="Update Property Ownership Doc" /></ButtonView>
          <ButtonView style={styles.docButton} onPress={() => handleEditSection('Documents')}><AppText text="Update Authority License" /></ButtonView>
          <ButtonView style={styles.docButton} onPress={() => handleEditSection('Documents')}><AppText text="Update Aqama/National ID" /></ButtonView>
        </View>
      </RefreshableScrollView>
    </View>
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
    marginTop: Metrics.verticalScale(40),
  },
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  scrollContent: { padding: 20, paddingBottom: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  card: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    backgroundColor: Colors.WHITE,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  titleWithIcon: { flexDirection: 'row', alignItems: 'center' },
  cardContent: { marginTop: 5 },
  row: { flexDirection: 'row', marginBottom: 6, flexWrap: 'wrap' },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 25,
    height: 48,
    marginTop: 10,
  },
  docButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 25,
    height: 48,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  menuText: {
    flex: 1,
  },
  menuSeparator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 4,
  }
});

export default PropertyDetailScreen;