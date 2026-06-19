import AppPressable from '@/components/atoms/AppPressable/AppPressable';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, Image } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useManageListingContainer from './ManageListingContainer';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import Metrics from '@/utility/Metrics';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import NoListingScreen from '../NoListingScreen/NoListingScreen';
import { useAuthStore } from '@/store/useAuthStore';
import ManageListingSkeleton from '@/components/Skeletons/ManageListingSkeleton';

const ManageListingScreen = () => {
  const { t } = useTranslation();
  const {
    listings,
    onCreateNew,
    onCreateNewListing,
    goToPropertyDetail,
    isLoading,
    refetch,
    UserPermission,
  } = useManageListingContainer();


  const { user } = useAuthStore();
  // if (!user?.has_listing) {
  //   return <NoListingScreen />;
  // }
  const data = listings?.data ?? [];
  const isSupervisor = UserPermission?.role_key === 'supervisor';

  const renderProperty = ({ item }: any) => {
    const fullAddress = [
      item?.country?.name,
      item?.state?.name,
      item?.city?.name,
      item?.district?.name,
    ]
      .filter(Boolean)
      .join(', ');

    const img = item?.images?.[0]

    return (
      <AppPressable onPress={() => item?.channel_type === 'Bookings.com' ? null : goToPropertyDetail(item)}>
        <GlassCard width="100%" style={styles.cardWrapper}>
          <View style={styles.imageContainer}>
            {item?.channel_type === 'Bookings.com' ? (
              <Image
                source={require('@/assets/img/bookingComImg.png')}
                style={styles.propertyImg}
              />
            ) : img ? (
              <Image
                source={{ uri: img }}
                style={styles.propertyImg}
              />
            ) : (
              <View style={styles.noImg}>
                <AppText
                  text={t('app.manage_listing_screen.no_image')}
                  textAlign='center'
                  type='Bold'
                />
              </View>
            )}
            {item?.channel_type !== 'Local'  && (
            <GlassCard style={styles.logo}>
              <Svgicons path={item?.channel_type == 'Bookings.com' ? 'bookingCom' : 'airbnb'} size={15} />
            </GlassCard>
              )}
            {item?.is_sync === 'sync_all' && (
              <View style={styles.badge}>
                <View style={styles.badgeDot} />
                <AppText text={t('app.manage_listing_screen.listed')} fontSize={12} type="SemiBold" color={Colors.BRUNSWICK_GREEN} />
              </View>
            )}
            {/* Percentage Badge */}
            {item?.listing_steps !== 'completed' && item?.channel_type !== 'Bookings.com' && (
              <GlassCard style={styles.percentageBadge}>
                <AppText
                  text={t('app.manage_listing_screen.completed_percentage', {
                    percentage: item?.completion_percentage,
                  })}
                  fontSize={10}
                  type="Bold"
                  color={Colors.BRUNSWICK_GREEN}
                />
              </GlassCard>
            )}
          </View>

          <GlassCard width={'100%'} style={styles.detailsContainer}>
            <View style={styles.titleRow}>
              {item?.name && (
                <AppText
                  text={item?.name}
                  type="SemiBold"
                  color={Colors.BLACK}
                  fontSize={16}
                  style={styles.titleText}
                  numberOfLines={1}
                />
              )}
              {item?.channel_type !== 'Bookings.com' && (
                <Svgicons path="editIconUserManagement" size={18} stroke={Colors.BLACK} />
              )}
            </View>


            {fullAddress && (
              <View style={styles.addressRow}>
                <Svgicons path="pinLocationIcon" size={14} style={{
                }} />
                <AppText
                  text={fullAddress}
                  color={Colors.DARK_CHARCOAL}
                  fontSize={12}
                  style={styles.addressText}
                  numberOfLines={2}
                />
              </View>
            )}
          </GlassCard>
        </GlassCard>
      </AppPressable>
    );
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')} style={styles.bgContainer}>
      <View style={styles.container}>

        <View style={styles.header}>
          <AppText
            text={t('app.task_management.your_listings')}
            fontSize={32}
            type="Bold"
            color={Colors.BLACK}
            mt={20}
          />
          <AppText
            text={t('app.task_management.your_listings_desc')}
            fontSize={14}
            color="#6B6B6B"
            mt={10}
            lineHeight={22}
          />
        </View>

        <FlatListSimpleHandler
          data={data}
          isLoading={isLoading}
          renderSkeleton={() => <ManageListingSkeleton />}
          renderItem={renderProperty}
          listEmptyText={t('app.manage_listing_screen.no_listings')}
          onRefresh={refetch}
          keyExtractor={(item: any) => item.id?.toString()}
          contentContainerStyle={[styles.scrollContent, data.length === 0 && { flex: 1 }]}
        />

        <View style={styles.footer}>
          <AppButton
            title={t('app.manage_listing_screen.add_listing')}
            onPress={onCreateNewListing}
            disabled={isSupervisor}
            fontSize={16}
            mb={15}
            variant='secondary'
          />
          <AppButton
            title={t('app.manage_listing_screen.create_listing')}
            onPress={onCreateNew}
            disabled={isSupervisor}
            fontSize={16}
          />
        </View>
      </View>
    </BGImage>
  );
};

export default ManageListingScreen;

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  cardWrapper: {
    padding: 12,
    borderRadius: 24,
    marginBottom: 20,
    backgroundColor: Colors.TRANSPARENT
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: Metrics.verticalScale(20),
  },
  propertyImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    bottom: Metrics.scale(20),
    right: Metrics.scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B3AEA6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.WHITE,
  },
  logo: {
    position: 'absolute',
    top: Metrics.scale(20),
    left: Metrics.scale(20),
    alignItems: 'center',
    backgroundColor: Colors.GRAY_HINT,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 100,
    width:Metrics.scale(30),
    height:Metrics.scale(30),
    justifyContent:'center'
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.BRUNSWICK_GREEN,
    marginRight: 6,
  },
  detailsContainer: {
    backgroundColor: Colors.TRANSPARENT,
    borderRadius: 16,
    paddingHorizontal: Metrics.scale(20),
    paddingVertical: Metrics.verticalScale(18)
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleText: {
    flex: 1,
    marginRight: 10,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  addressText: {
    flex: 1,
    marginLeft: 6,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
  },
  percentageBadge: {
    backgroundColor: '#B3AEA6', // Image wala greyish shade
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: Metrics.scale(20),
    right: Metrics.scale(20),
    width: Metrics.scale(120),
    height: Metrics.verticalScale(28),
    padding: 0
  },
  noImg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.WHITE,
  }
});