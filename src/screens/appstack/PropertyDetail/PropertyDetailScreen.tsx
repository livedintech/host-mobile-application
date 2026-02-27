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
import CustomSwitch from '@/components/molecules/CustomSwitch/CustomSwitch';

const PropertyDetailScreen = () => {
  const {
    propertyData,
    handleEditSection,
    handleMenuAction,
    refetch,
    isLoading,
    handleEditPhotosVideos,
    UserPermission,
  } = usePropertyDetailContainer();
  const isOwnership = propertyData?.documents?.ownership?.length > 0;
  const isLicense = propertyData?.documents?.authority_license?.length > 0;
  const isNational_id = propertyData?.documents?.national_id?.length > 0;

  const isSupervisor = UserPermission?.role_key === 'supervisor';

  const InfoCard = ({ title, icon, onEdit, children }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleWithIcon}>
          <AppText
            text={title}
            fontSize={18}
            type="Bold"
            color={Colors.BRUNSWICK_GREEN}
          />
          <Svgicons
            path={icon}
            size={20}
            color={Colors.BRUNSWICK_GREEN}
            ml={8}
          />
        </View>
        {!isSupervisor && (
          <ButtonView onPress={onEdit}>
            <Svgicons path="editIcon" size={18} color={Colors.BLACK} />
          </ButtonView>
        )}
      </View>
      <View style={styles.cardContent}>{children}</View>
    </View>
  );

  const LabelValue = ({ label, value }: { label: string; value: any }) => {
    const hasValue =
      value !== null &&
      value !== undefined &&
      value !== '' &&
      !(Array.isArray(value) && value.length === 0);

    if (!hasValue) return null;

    const formatValue = () => {
      if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
      }
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      return String(value);
    };

    return (
      <View style={styles.row}>
        <AppText
          text={`${label}: `}
          type="Bold"
          color={Colors.BRUNSWICK_GREEN}
          fontSize={14}
        />
        <AppText
          text={formatValue()}
          color={Colors.BRUNSWICK_GREEN}
          fontSize={14}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with Menu Dots */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <AppText
            text={propertyData?.title}
            fontSize={28}
            lineHeight={28}
            type="Bold"
            color={Colors.BRUNSWICK_GREEN}
          />
        </View>
        <Menu>
          <MenuTrigger>
            <View style={{ padding: 5 }}>
              <Svgicons
                path="menuDotsIcon"
                size={24}
                color={Colors.BRUNSWICK_GREEN}
              />
            </View>
          </MenuTrigger>

          <MenuOptions customStyles={optionsStyles}>
            {/* Channel - Disabled for Supervisor */}
            <MenuOption
              disabled={isSupervisor}
              onSelect={() => handleMenuAction('channel')}
              style={[styles.menuItem, isSupervisor && styles.disabledMenuItem]}
            >
              <AppText
                text="Channel"
                fontSize={16}
                color={isSupervisor ? Colors.DISABLED_GREY : Colors.BLACK}
                style={styles.menuText}
              />
              <Svgicons
                path="channelIcon"
                size={20}
                color={
                  isSupervisor ? Colors.DISABLED_GREY : Colors.BRUNSWICK_GREEN
                }
              />
            </MenuOption>

            {/* Task - ALWAYS ENABLED */}
            <MenuOption
              onSelect={() => handleMenuAction('task')}
              style={styles.menuItem}
            >
              <AppText
                text="Task"
                fontSize={16}
                color={Colors.BLACK}
                style={styles.menuText}
              />
              <Svgicons
                path="taskIcon"
                size={20}
                color={Colors.BRUNSWICK_GREEN}
              />
            </MenuOption>

            {/* Calendar - Disabled for Supervisor */}
            <MenuOption
              disabled={isSupervisor}
              onSelect={() => handleMenuAction('calendar')}
              style={[styles.menuItem, isSupervisor && styles.disabledMenuItem]}
            >
              <AppText
                text="Calendar"
                fontSize={16}
                color={isSupervisor ? Colors.DISABLED_GREY : Colors.BLACK}
                style={styles.menuText}
              />
              <Svgicons
                path="calendarGridIcon"
                size={20}
                color={
                  isSupervisor ? Colors.DISABLED_GREY : Colors.BRUNSWICK_GREEN
                }
              />
            </MenuOption>

            {/* Delete - Disabled for Supervisor */}
            <MenuOption
              disabled={isSupervisor}
              onSelect={() => handleMenuAction('delete')}
              style={[styles.menuItem, isSupervisor && styles.disabledMenuItem]}
            >
              <AppText
                text="Delete Property"
                fontSize={16}
                color={isSupervisor ? Colors.DISABLED_GREY : Colors.INDIAN_RED}
                style={styles.menuText}
              />
              <Svgicons
                path="deleteIcon"
                size={20}
                color={isSupervisor ? Colors.DISABLED_GREY : Colors.INDIAN_RED}
              />
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>

      <RefreshableScrollView
        isLoading={isLoading}
        onRefresh={refetch}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Address Card */}
        <InfoCard
          title="Address"
          icon="pinLocationIcon"
          onEdit={() => handleEditSection('Address')}
        >
          <AppText
            text={propertyData.address}
            color={Colors.BRUNSWICK_GREEN}
            lineHeight={20}
          />
        </InfoCard>

        {/* Place Information Card */}
        <InfoCard
          title="Place Information"
          icon="infoIcon"
          onEdit={() => handleEditSection('PlaceInfo')}
        >
          <LabelValue
            label="Size"
            value={
              propertyData.placeInfo.size
                ? `${propertyData.placeInfo.size} SQM`
                : ''
            }
          />
          <LabelValue
            label="Number of Bedrooms"
            value={propertyData.placeInfo.bedrooms}
          />
          <LabelValue
            label="Number of Bed"
            value={propertyData.placeInfo.beds}
          />
          <LabelValue label="Kitchen" value={propertyData.placeInfo.kitchen} />
          <LabelValue label="Pool" value={propertyData.placeInfo.pool} />
          <LabelValue
            label="Long term Stay?"
            value={propertyData.placeInfo.longTermStay}
          />
          <LabelValue
            label="Minimum Gap Night"
            value={propertyData.placeInfo.minGapNight}
          />
          <LabelValue
            label="Minimum Night Stay"
            value={propertyData.placeInfo.minNights}
          />
          <LabelValue
            label="Maximum Night Stay"
            value={propertyData.placeInfo.maxNights}
          />
          <LabelValue
            label="Other House Features"
            value={propertyData.placeInfo.features}
          />
        </InfoCard>

        {/* Property Images */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.titleWithIcon}>
              <AppText
                text="Property Images"
                fontSize={18}
                type="Bold"
                color={Colors.BRUNSWICK_GREEN}
              />
              <Svgicons
                path="imageIcon"
                size={20}
                color={Colors.BRUNSWICK_GREEN}
                ml={8}
              />
            </View>
          </View>
          {Object.keys(propertyData?.photos || {}).map(category => {
            const images = propertyData.photos[category];
            const hasImages = Array.isArray(images) && images.length > 0;

            const getBgColor = () => {
              if (isSupervisor) return Colors.DISABLED_BG;
              return hasImages ? Colors.BRUNSWICK_GREEN : Colors.WHITE;
            };
            const getContentColor = () => {
              if (isSupervisor) return Colors.DISABLED_GREY;
              return hasImages ? Colors.WHITE : Colors.BLACK;
            };
            return (
              <ButtonView
                key={category}
                disabled={isSupervisor}
                style={[
                  styles.mediaButton,
                  { backgroundColor: getBgColor() },
                  isSupervisor && { borderColor: '#E8E8E8' },
                ]}
                onPress={() => handleEditPhotosVideos(category)}
              >
                <Svgicons
                  path={hasImages ? 'CheckboxCheckedIcon' : 'attachmentIcon'}
                  size={30}
                  stroke={getContentColor()}
                />
                <AppText
                  text={
                    isSupervisor
                      ? `${category} Images`
                      : `Update ${category} Images`
                  }
                  ml={10}
                  color={getContentColor()}
                />
              </ButtonView>
            );
          })}
        </View>

        {/* House Details */}
        <InfoCard
          title="House Details"
          icon="homeIcon"
          onEdit={() => handleEditSection('HouseDetails')}
        >
          <AppText
            text="House Title: "
            type="Bold"
            color={Colors.BRUNSWICK_GREEN}
          />
          <AppText
            text={propertyData.title}
            color={Colors.BRUNSWICK_GREEN}
            mb={20}
          />
          {propertyData.houseDetails.description && (
            <>
              <AppText
                text="Description: "
                type="Bold"
                color={Colors.BRUNSWICK_GREEN}
              />
              <AppText
                text={propertyData.houseDetails.description}
                color={Colors.BRUNSWICK_GREEN}
                mb={15}
                lineHeight={20}
              />
            </>
          )}
          <LabelValue
            label="Wifi Username"
            value={propertyData.houseDetails.wifiUsername}
          />
          <LabelValue
            label="Wifi Password"
            value={propertyData.houseDetails.wifiPassword}
          />
          <LabelValue
            label="Door Lock Code"
            value={propertyData.houseDetails.doorLockCode}
          />
        </InfoCard>

        {/* Booking Details */}
        <InfoCard
          title="Booking Details"
          icon="homeIcon"
          onEdit={() => handleEditSection('BookingDetails')}
        >
          <LabelValue
            label="Booking Type"
            value={propertyData.bookingDetails.bookingType}
          />
          <LabelValue
            label="Guest Eligibility"
            value={propertyData.bookingDetails.guestEligibility}
          />
          <LabelValue
            label="Check-in Time"
            value={propertyData.bookingDetails.checkIn}
          />
          <LabelValue
            label="Check-out Time"
            value={propertyData.bookingDetails.checkOut}
          />
        </InfoCard>

        {/* House Guidelines */}
        {(propertyData.guidelines.arrivalGuide ||
          propertyData.guidelines.houseRules ||
          propertyData.guidelines.checkoutInstructions) && (
          <InfoCard
            title="House Guidelines"
            icon="bookIcon"
            onEdit={() => handleEditSection('Guidelines')}
          >
            {propertyData.guidelines.arrivalGuide && (
              <>
                <AppText
                  text="Arrival Guide:"
                  type="Bold"
                  color={Colors.BRUNSWICK_GREEN}
                  mb={5}
                />
                <AppText
                  text={propertyData.guidelines.arrivalGuide}
                  color={Colors.BRUNSWICK_GREEN}
                  mb={15}
                  lineHeight={20}
                />
              </>
            )}
            {propertyData.guidelines.houseRules && (
              <>
                <AppText
                  text="House Rules:"
                  type="Bold"
                  color={Colors.BRUNSWICK_GREEN}
                  mb={5}
                />
                <AppText
                  text={propertyData.guidelines.houseRules}
                  color={Colors.BRUNSWICK_GREEN}
                  mb={15}
                  lineHeight={20}
                />
              </>
            )}
            {propertyData.guidelines.checkoutInstructions && (
              <>
                <AppText
                  text="Checkout Instructions:"
                  type="Bold"
                  color={Colors.BRUNSWICK_GREEN}
                  mb={5}
                />
                <AppText
                  text={propertyData.guidelines.checkoutInstructions}
                  color={Colors.BRUNSWICK_GREEN}
                  lineHeight={20}
                />
              </>
            )}
          </InfoCard>
        )}

        {/* Booking Cancel Policies */}
        {(propertyData.cancelPolicies.airbnb ||
          propertyData.cancelPolicies.gathern ||
          propertyData.cancelPolicies.booking) && (
          <InfoCard
            title="Booking Cancel Policies"
            icon="clipboardIcon"
            onEdit={() => handleEditSection('CancelPolicies')}
          >
            <LabelValue
              label="Cancel Policy Airbnb"
              value={propertyData.cancelPolicies?.airbnb?.title}
            />
            <LabelValue
              label="Cancel Policy Gathern"
              value={propertyData.cancelPolicies?.gathern?.title}
            />
            <LabelValue
              label="Cancel Policy Booking.com"
              value={propertyData.cancelPolicies?.booking?.title}
            />
          </InfoCard>
        )}

        {/* AI Dynamic Pricing */}
        <InfoCard
          title="AI Dynamic Pricing"
          icon="cardIcon"
          onEdit={() => handleEditSection('AIPricing')}
        >
          <AppText
            text={
              propertyData.aiPricing.pricingMode === 1
                ? 'Conservative Mode'
                : 'Aggressive Mode'
            }
            color={Colors.PINE_FOREST}
            fontSize={16}
          />
          {/* <LabelValue label="Conservative Mode" value={propertyData.aiPricing.pricingMode === 1 ? 'Conservative Mode' : 'Aggressive Mode'} /> */}
        </InfoCard>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AppText
              text={'Manual Price Override'}
              fontSize={18}
              type="Bold"
              color={Colors.BRUNSWICK_GREEN}
            />
            {!isSupervisor && (
              <CustomSwitch
                value={propertyData?.aiPricing?.manualOverride}
                onToggle={() => handleEditSection('AIPricing')}
              />
            )}
          </View>
        </View>

        {/* Pricing */}
        <InfoCard
          title="Pricing"
          icon="cardIcon"
          onEdit={() => handleEditSection('Pricing')}
        >
          <LabelValue
            label="Weekday Base Price"
            value={propertyData.pricing.weekday}
          />
          <LabelValue
            label="Weekend Base Price"
            value={propertyData.pricing.weekend}
          />
          <LabelValue label="Discount" value={propertyData.discounts} />
          <LabelValue label="Tax(VAT)" value={propertyData.pricing.tax} />
          <LabelValue
            label="Markup Price"
            value={propertyData.pricing.markup}
          />
          <LabelValue
            label="Cleaning Fee"
            value={propertyData.pricing.cleaning}
          />
          <LabelValue
            label="Airbnb Discount"
            value={propertyData.pricing.airbnbDiscount}
          />
          <LabelValue
            label="Gathern Discount"
            value={propertyData.pricing.gathernDiscount}
          />
          <LabelValue
            label="Booking.com Discount"
            value={propertyData.pricing.bookingDiscount}
          />
          <LabelValue
            label="Extra Guest Fee"
            value={propertyData.pricing.extraGuestFee}
          />
        </InfoCard>

        {/* Property Disclosure Details */}
        {(propertyData.disclosure.cameras ||
          propertyData.disclosure.weapons ||
          propertyData.disclosure.noise) && (
          <InfoCard
            title="Property Disclosure Details"
            icon="bookIcon"
            onEdit={() => handleEditSection('Disclosure')}
          >
            <LabelValue
              label="Exterior Security Camera"
              value={propertyData.disclosure.cameras}
            />
            <LabelValue
              label="Noise Hidden Monitor"
              value={propertyData.disclosure.noise}
            />
            <LabelValue
              label="Weapon on Property"
              value={propertyData.disclosure.weapons}
            />
          </InfoCard>
        )}

        {/* Ownership Documents */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.titleWithIcon}>
              <AppText
                text="Ownership Documents"
                fontSize={18}
                type="Bold"
                color={Colors.BRUNSWICK_GREEN}
              />
              <Svgicons
                path="docIcon"
                size={20}
                color={Colors.BRUNSWICK_GREEN}
                ml={8}
              />
            </View>
          </View>

          {/* Property Ownership Doc */}
          <ButtonView
            disabled={isSupervisor}
            style={[
              styles.docButton,
              isOwnership && {
                backgroundColor: isSupervisor
                  ? Colors.DISABLED_BG
                  : Colors.BRUNSWICK_GREEN,
              },
              isSupervisor && { borderColor: '#E8E8E8' },
            ]}
            onPress={() => handleEditSection('Documents')}
          >
            {isOwnership && (
              <Svgicons
                path="CheckboxCheckedIcon"
                size={30}
                stroke={isSupervisor ? Colors.DISABLED_GREY : undefined}
              />
            )}
            <AppText
              text={
                isSupervisor
                  ? 'Property Ownership Doc'
                  : 'Update Property Ownership Doc'
              }
              color={
                isOwnership && !isSupervisor
                  ? Colors.WHITE
                  : isSupervisor
                  ? Colors.DISABLED_GREY
                  : Colors.BLACK
              }
            />
          </ButtonView>

          {/* Authority License */}
          <ButtonView
            disabled={isSupervisor}
            style={[
              styles.docButton,
              isLicense && {
                backgroundColor: isSupervisor
                  ? Colors.DISABLED_BG
                  : Colors.BRUNSWICK_GREEN,
              },
              isSupervisor && { borderColor: '#E8E8E8' },
            ]}
            onPress={() => handleEditSection('Documents')}
          >
            {isLicense && (
              <Svgicons
                path="CheckboxCheckedIcon"
                size={30}
                stroke={isSupervisor ? Colors.DISABLED_GREY : undefined}
              />
            )}
            <AppText
              text={
                isSupervisor ? 'Authority License' : 'Update Authority License'
              }
              color={
                isLicense && !isSupervisor
                  ? Colors.WHITE
                  : isSupervisor
                  ? Colors.DISABLED_GREY
                  : Colors.BLACK
              }
            />
          </ButtonView>

          {/* Aqama/National ID */}
          <ButtonView
            disabled={isSupervisor}
            style={[
              styles.docButton,
              isNational_id && {
                backgroundColor: isSupervisor
                  ? Colors.DISABLED_BG
                  : Colors.BRUNSWICK_GREEN,
              },
              isSupervisor && { borderColor: '#E8E8E8' },
            ]}
            onPress={() => handleEditSection('Documents')}
          >
            {isNational_id && (
              <Svgicons
                path="CheckboxCheckedIcon"
                size={30}
                stroke={isSupervisor ? Colors.DISABLED_GREY : undefined}
              />
            )}
            <AppText
              text={
                isSupervisor ? 'Aqama/National ID' : 'Update Aqama/National ID'
              }
              color={
                isNational_id && !isSupervisor
                  ? Colors.WHITE
                  : isSupervisor
                  ? Colors.DISABLED_GREY
                  : Colors.BLACK
              }
            />
          </ButtonView>
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
  scrollContent: {
    paddingHorizontal: Metrics.baseMargin,
    paddingBottom: Metrics.verticalScale(50),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: Metrics.baseMargin,
  },
  card: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    backgroundColor: Colors.WHITE,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
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
    flexDirection: 'row',
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
  disabledMenuItem: {
    backgroundColor: '#FAFAFA',
  },
  disabledBtn: {
    backgroundColor: Colors.DISABLED_BG,
    borderColor: '#E8E8E8',
  },
});

export default PropertyDetailScreen;
