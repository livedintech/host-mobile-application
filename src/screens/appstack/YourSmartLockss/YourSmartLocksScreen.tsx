import React from 'react';
import { StyleSheet, View, Pressable, ActivityIndicator } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import DropdownField from '@/components/molecules/Input/DropdownField';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useYourSmartLockssContainer from './YourSmartLockssContainer';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import SmartLockScreen from '../SmartLock/SmartLockScreen';

export interface SmartLock {
  lock_id: number;
  alias: string;
  lp_name: string | null;
  listing_id: number | null;
  battery_percentage: string;
  battery_status: string;
  ttlock_date: string;
}

const YourSmartLocksScreen = () => {
  const {
    locksData,
    LISTING_OPTIONS,
    control,
    errors,
    getBatteryColor,
    handleConnectNewAccount,
    isLoading,
    refetch,
    goToScreen,
    selectDropdown,
  } = useYourSmartLockssContainer();

  const renderLockCard = ({ item }: { item: SmartLock }) => {
    const batteryValue = Number(item.battery_percentage?.replace('%', ''));

    return (
      <Pressable style={styles.card} onPress={() => goToScreen(item?.lock_id)}>
        <View style={styles.row}>
          <Svgicons
            path="keyholeLock"
            size={18}
            color={Colors.BRUNSWICK_GREEN}
          />
          <AppText
            text={item.alias}
            fontSize={20}
            type="Bold"
            color={Colors.BRUNSWICK_GREEN}
            ml={10}
          />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.rowSmall}>
            <Svgicons path="keyIcon" size={16} color={Colors.BRUNSWICK_GREEN} />
            <AppText
              text="Lock ID: "
              fontSize={16}
              type="SemiBold"
              color={Colors.BRUNSWICK_GREEN}
              ml={8}
            />
            <AppText
              text={item.lock_id.toString()}
              fontSize={16}
              color={Colors.BRUNSWICK_GREEN}
            />
          </View>

          <View style={styles.rowSmall}>
            <Svgicons
              path="batteryIcon"
              size={16}
              color={Colors.BRUNSWICK_GREEN}
            />
            <AppText
              text="Battery: "
              fontSize={16}
              type="SemiBold"
              color={Colors.BRUNSWICK_GREEN}
              ml={8}
            />
            <AppText
              text={item.battery_percentage}
              fontSize={16}
              type="Bold"
              color={getBatteryColor(batteryValue)}
            />
          </View>
        </View>

        <DropdownField
          label="Assign Listing"
          name={`lock_${item.lock_id}_listing`}
          control={control}
          errors={errors}
          data={LISTING_OPTIONS}
          placeholder="Select Property"
          dropdownPosition="bottom"
          onSelect={value => {
            selectDropdown(value?.value, item.lock_id);
          }}
          extraPayload={item?.lock_id}
        />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Main Content Area */}
      <View style={{ flex: 1 }}>
        {locksData.length > 0 && (
          <View style={styles.titleContainer}>
            <AppText
              text="Your Smart Locks"
              fontSize={32}
              type="Bold"
              color={Colors.BRUNSWICK_GREEN}
            />
            <Svgicons
              path="lockInfoIcon"
              size={28}
              color={Colors.BRUNSWICK_GREEN}
              ml={10}
            />
          </View>
        )}

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.BRUNSWICK_GREEN} />
          </View>
        ) : (
          <FlatListSimpleHandler
            data={locksData}
            keyExtractor={item => item.lock_id.toString()}
            renderItem={renderLockCard}
            onRefresh={refetch}
            ListEmptyComponent={<SmartLockScreen />}
            listEmptyText="No Data Found"
            isLoading={false}
            // This padding ensures the last item isn't hidden by the absolute footer
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      {/* Absolute Footer */}
      {locksData.length > 0 && (
        <View style={styles.footer}>
          <AppButton
            title="Connect New Account"
            onPress={handleConnectNewAccount}
            backgroundColor={Colors.WHITE}
            color={Colors.BRUNSWICK_GREEN}
            borderColor={Colors.SMOOTH_GREY}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.WHITE 
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Metrics.verticalScale(20),
    paddingBottom: Metrics.verticalScale(10),
  },
  listContent: {
    paddingHorizontal: Metrics.scale(25),
    paddingTop: Metrics.verticalScale(10),
    // Extra padding at the bottom so the last card clears the footer
    paddingBottom: Metrics.verticalScale(120), 
  },
  card: {
    borderWidth: 1,
    borderColor: Colors.SMOOTH_GREY,
    borderRadius: 20,
    padding: Metrics.scale(20),
    marginBottom: Metrics.verticalScale(20),
    backgroundColor: Colors.WHITE,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowSmall: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoSection: { marginVertical: Metrics.verticalScale(15) },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: Metrics.scale(25),
    paddingTop: Metrics.verticalScale(10),
    paddingBottom: Metrics.verticalScale(30), // Adjust for safe area if needed
  },
});

export default YourSmartLocksScreen;