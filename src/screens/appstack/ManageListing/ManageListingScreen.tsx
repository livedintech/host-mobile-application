import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import useManageListingContainer from './ManageListingContainer';
import { ManageListingMapItem } from '@/types/api/createListingTypes';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import Metrics from '@/utility/Metrics';
import BGImage from '@/components/molecules/BGImage/BGImage';

const ManageListingScreen = () => {
  const {
    listings,
    onCreateNew,
    onCreateNewListing,
    goToPropertyDetail,
    isLoading,
    refetch,
    UserPermission,
  } = useManageListingContainer();

  const data = listings?.data ?? [];
  const isSupervisor = UserPermission?.role_key === 'supervisor';

  const renderProperty = ({ item }: ManageListingMapItem) => {
    const hasFullAddress =
      item?.country?.name &&
      item?.state?.name &&
      item?.city?.name &&
      item?.district?.name;
    return (
      <GradientBorder borderRadius={16} style={styles.cardWrapper}>
        <View style={styles.cardInner}>
          <View style={styles.cardInfo}>
            {item?.name && (
              <View style={styles.infoRow}>
                <AppText color={Colors.PINE_FOREST} fontSize={14} mb={2}>
                  <AppText text="Property Name: " type="Bold" color={Colors.BRUNSWICK_GREEN} fontSize={14} />
                  {item?.name}
                </AppText>
              </View>
            )}
            <View style={styles.infoRow}>
              <AppText
                text="Property ID: "
                type="Bold"
                color={Colors.BRUNSWICK_GREEN}
                fontSize={14}
              />
              <View style={{ flex: 1 }}>
                <AppText
                  text={item?.id?.toString()}
                  color={Colors.PINE_FOREST}
                  fontSize={14}
                />
              </View>
            </View>
            {hasFullAddress && (
              <View style={styles.infoRow}>
                <AppText
                  text="Address:"
                  type="Bold"
                  color={Colors.BRUNSWICK_GREEN}
                  fontSize={14}
                />
                <View style={{ flex: 1 }}>
                  <AppText
                    text={[
                      item?.country?.name,
                      item?.state?.name,
                      item?.city?.name,
                      item?.district?.name,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                    color={Colors.PINE_FOREST}
                    fontSize={14}
                    numberOfLines={1}
                  />
                </View>
              </View>
            )}
          </View>

          {/* Arrow */}
          <GradientBorder
            borderRadius={20}
            borderWidth={1}
            style={styles.arrowCircle}
          >
            <Pressable
              style={styles.arrowCircle}
              onPress={() => goToPropertyDetail(item)}
            >
              <Svgicons path="arrowRightIcon" size={22} />
            </Pressable>
          </GradientBorder>
        </View>
      </GradientBorder>
    );
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <AppText
          text="Manage Your Listings"
          fontSize={30}
          type="Bold"
          color={Colors.BRUNSWICK_GREEN}
          textAlign="center"
          mb={30}
        />
        <FlatListSimpleHandler
          data={data}
          isLoading={isLoading}
          renderItem={renderProperty}
          listEmptyText="No listings found"
          onRefresh={refetch}
          keyExtractor={item => item.id}
          contentContainerStyle={[styles.scrollContent, data.length === 0 && { flex: 1 }]}
        />
        <View style={styles.footer}>
          <AppButton
            title="Create New Listing"
            onPress={onCreateNew}
            mt={20}
            disabled={isSupervisor}
            style={StyleSheet.flatten([
              isSupervisor ? styles.disabledAppButton : undefined,
            ])}
          />
          <AppButton
            title="Add New Listing"
            onPress={onCreateNewListing}
            mt={15}
            disabled={isSupervisor}
            style={StyleSheet.flatten([
              isSupervisor ? styles.disabledAppButton : undefined,
            ])}
          />
        </View>
      </View>
    </BGImage>
  );
};

export default ManageListingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Metrics.baseMargin,
    paddingBottom: 40,
  },

  cardWrapper: {
    marginBottom: 20,
  },

  cardInner: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
  },

  propertyImg: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },

  cardInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },

  infoRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },

  arrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },

  footer: {
    marginTop: Metrics.verticalScale(10),
    paddingBottom: Metrics.verticalScale(20),
    paddingHorizontal: Metrics.baseMargin,
  },
  disabledAppButton: {
    backgroundColor: Colors.DISABLED_BG,
    opacity: 0.8,
    borderColor: '#E8E8E8',

  },
});
