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

const ManageListingScreen = () => {
  const {
    listings,
    onCreateNew,
    onCreateNewListing,
    goToPropertyDetail,
    isLoading,
    refetch,
  } = useManageListingContainer();

  const data = listings?.data ?? [];

  const renderProperty = ({ item }: ManageListingMapItem) => (
    <GradientBorder borderRadius={16} style={styles.cardWrapper}>
      <View style={styles.cardInner}>
        <View style={styles.cardInfo}>
          <View style={styles.infoRow}>
            <AppText
              text="Property Name: "
              type="Bold"
              color={Colors.BRUNSWICK_GREEN}
              fontSize={14}
            />
            <View style={{ flex: 1 }}>
              <AppText
                text={item?.name}
                color={Colors.PINE_FOREST}
                fontSize={14}
                numberOfLines={1}
              />
            </View>
          </View>
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
                  item?.apt,
                  item?.state,
                  item?.city,
                ]
                  .filter(Boolean)
                  .join(', ')
                }
                color={Colors.PINE_FOREST}
                fontSize={14}
                numberOfLines={1}
              />
            </View>
          </View>
        </View>

        {/* Arrow */}
        <GradientBorder borderRadius={20} borderWidth={1} style={styles.arrowCircle}>
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

  return (
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
        contentContainerStyle={styles.scrollContent}
      />
      <View style={styles.footer}>
        <AppButton
          title="Create New Listing"
          onPress={onCreateNew}
          mt={20}
        />
        <AppButton
          title="Add New Listing"
          onPress={onCreateNewListing}
          mt={15}
        />
      </View>
    </View>
  );
};

export default ManageListingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
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
});
