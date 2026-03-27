
import React from 'react';
import { StyleSheet, View, ActivityIndicator, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Metrics from '@/utility/Metrics';
import DropdownField from '@/components/molecules/Input/DropdownField';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useYourSmartLockssContainer from './YourSmartLockssContainer';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import SmartLockScreen from '../SmartLock/SmartLockScreen';
import NoListingScreen from '../NoListingScreen/NoListingScreen';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import BGImage from '@/components/molecules/BGImage/BGImage';

const YourSmartLocksScreen = () => {
  const {
    locksData,
    listingsData,
    control,
    errors,
    getBatteryColor,
    handleConnectNewAccount,
    isLoading,
    refetch,
    goToScreen,
    getOptionsForLock,
    handleSelect,
  } = useYourSmartLockssContainer();

  const hasListings = listingsData && listingsData.length > 0;
  const hasLocks = locksData && locksData.length > 0;

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY_TEAL} />
      </View>
    );
  }

  if (!hasListings) return <NoListingScreen />;
  if (!hasLocks) return <SmartLockScreen />;

  const renderLockCard = ({ item }: { item: any }) => {
    const batteryValue = Number(item.battery_percentage?.replace('%', ''));
    const dynamicOptions = getOptionsForLock(item);

    return (
      <GlassCard width="100%" style={styles.glassCard}>
        <Pressable onPress={() => goToScreen(item?.lock_id)}>
          <AppText text={item.alias} fontSize={20} type="Bold" color={Colors.BLACK} mb={8} />
          <View style={styles.infoSection}>
            <View style={styles.rowSmall}>
              <AppText text="TT Account: " fontSize={14} color={Colors.BLACK} />
              <AppText text={item.username} fontSize={14} color={Colors.BLACK} />
            </View>
            <View style={styles.rowSmall}>
              <AppText text="Lock Number: " fontSize={14} color={Colors.BLACK} />
              <AppText text={item.lock_id.toString()} fontSize={14} color={Colors.BLACK} />
            </View>
            <View style={styles.rowSmall}>
              <AppText text="Battery Level: " fontSize={14} color={Colors.BLACK} />
              <AppText text={item.battery_percentage} fontSize={14} type="Bold" color={getBatteryColor(batteryValue)} />
            </View>
          </View>
        </Pressable>
        <View style={{ marginTop: 25 }}>
          <DropdownField
            name={`lock_${item.lock_id}_listing`}
            control={control}
            errors={errors}
            data={dynamicOptions}
            placeholder="Select Property"
            // Pass the whole 'item' to handleSelect for internal checks
            onSelect={value => handleSelect(value?.value, item)}
            label="Assign Listing"
          />
        </View>
      </GlassCard>
    );
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <View style={styles.titleContainer}>
            <AppText text="Your Smart Locks" fontSize={28} type="Bold" color={Colors.BLACK} />
          </View>
          <FlatListSimpleHandler
            data={locksData}
            keyExtractor={item => item.lock_id.toString()}
            renderItem={renderLockCard}
            onRefresh={refetch}
            contentContainerStyle={styles.listContent}
            isLoading={false}
          />
        </View>

        <View style={styles.footer}>
          <AppButton
            title="Connect New Account"
            onPress={handleConnectNewAccount}
            backgroundColor={Colors.PRIMARY_TEAL}
            color={Colors.WHITE}
            borderRadius={25}
          />
        </View>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titleContainer: { paddingHorizontal: Metrics.scale(25), paddingTop: Metrics.verticalScale(30), paddingBottom: Metrics.verticalScale(20) },
  listContent: { paddingHorizontal: Metrics.scale(25), paddingBottom: Metrics.verticalScale(120) },
  glassCard: { padding: Metrics.scale(20), marginBottom: Metrics.verticalScale(20) },
  infoSection: { marginBottom: Metrics.verticalScale(10) },
  rowSmall: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: Metrics.scale(25), paddingBottom: Metrics.verticalScale(40) },
});

export default YourSmartLocksScreen;