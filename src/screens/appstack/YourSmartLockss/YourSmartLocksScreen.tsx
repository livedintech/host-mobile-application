// import React from 'react';
// import { StyleSheet, View, ActivityIndicator, Pressable } from 'react-native';
// import AppText from '@/components/molecules/AppText/AppText';
// import { Colors } from '@/theme/colors';
// import Svgicons from '@/components/atoms/Svgicons/Svgicons';
// import Metrics from '@/utility/Metrics';
// import DropdownField from '@/components/molecules/Input/DropdownField';
// import AppButton from '@/components/molecules/AppButton/AppButton';
// import useYourSmartLockssContainer from './YourSmartLockssContainer';
// import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
// import SmartLockScreen from '../SmartLock/SmartLockScreen';
// import BGImage from '@/components/molecules/BGImage/BGImage';
// import GlassCard from '@/components/molecules/GlassCard/GlassCard';
// import useActiveCodesContainer from '../ActiveCodes/ActiveCodesContainer';
// import ButtonView from '@/components/molecules/AppButton/ButtonView';

// // Your custom components

// export interface SmartLock {
//   lock_id: number;
//   alias: string;
//   lp_name: string | null;
//   listing_id: number | null;
//   battery_percentage: string;
//   battery_status: string;
//   ttlock_date: string;
// }

// const YourSmartLocksScreen = () => {
//   const {
//     locksData,
//     LISTING_OPTIONS,
//     control,
//     errors,
//     getBatteryColor,
//     handleConnectNewAccount,
//     isLoading,
//     refetch,
//     goToScreen,
//     selectDropdown,
//   } = useYourSmartLockssContainer();

//   const renderLockCard = ({ item }: { item: SmartLock }) => {
//     const batteryValue = Number(item.battery_percentage?.replace('%', ''));

//     return (
//       <GlassCard width="100%" style={styles.glassCard}>
//         <Pressable onPress={() => goToScreen(item?.lock_id)}>
//           {/* Lock Title */}
//           <AppText
//             text={item.alias}
//             fontSize={20}
//             type="Bold"
//             color={Colors.BLACK}
//             mb={8}
//           />

//           <View style={styles.infoSection}>
//             {/* Account Info - Assumed from Figma image */}
//             <View style={styles.rowSmall}>
//               <AppText text="TT Account: " fontSize={14} color={Colors.BLACK} />
//               <AppText
//                 text="accountali@gmail.com"
//                 fontSize={14}
//                 color={Colors.BLACK}
//               />
//             </View>

//             {/* Lock Number/ID */}
//             <View style={styles.rowSmall}>
//               <AppText
//                 text="Lock Number: "
//                 fontSize={14}
//                 color={Colors.BLACK}
//               />
//               <AppText
//                 text={item.lock_id.toString()}
//                 fontSize={14}
//                 color={Colors.BLACK}
//               />
//             </View>

//             {/* Battery Level */}
//             <View style={styles.rowSmall}>
//               <AppText
//                 text="Battery Level: "
//                 fontSize={14}
//                 color={Colors.BLACK}
//               />
//               <AppText
//                 text={item.battery_percentage}
//                 fontSize={14}
//                 type="Bold"
//                 color={getBatteryColor(batteryValue)}
//               />
//             </View>
//           </View>
//         </Pressable>

//         <View style={{ marginTop: 25 }}>
//           {/* Dropdown Section */}
//           <DropdownField
//             name={`lock_${item.lock_id}_listing`}
//             control={control}
//             errors={errors}
//             data={LISTING_OPTIONS}
//             placeholder="Select Property"
//             dropdownPosition="bottom"
//             onSelect={value => selectDropdown(value?.value, item.lock_id)}
//             extraPayload={item?.lock_id}
//             label="Assign Listing"
//           />
//         </View>
//       </GlassCard>
//     );
//   };

//   const hasData = locksData && locksData.length > 0;

//   return (
//     <BGImage source={require('@/assets/img/background/linearBG.png')}>
//       <View style={styles.container}>
//         <View style={{ flex: 1 }}>
//           {hasData && (
//             <View style={styles.titleContainer}>
//               <AppText
//                 text="Your Smart Locks"
//                 fontSize={32}
//                 type="Bold"
//                 color={Colors.BLACK}
//               />
//             </View>
//           )}

//           {isLoading ? (
//             <View style={styles.loaderContainer}>
//               <ActivityIndicator size="large" color={Colors.BRUNSWICK_GREEN} />
//             </View>
//           ) : (
//             <FlatListSimpleHandler
//               data={locksData}
//               // data={[]}
//               keyExtractor={item => item.lock_id.toString()}
//               renderItem={renderLockCard}
//               onRefresh={refetch}
//               ListEmptyComponent={ <SmartLockScreen />}
//               listEmptyText="No Data Found"
//               isLoading={false}
//               contentContainerStyle={styles.listContent}
//             />
//           )}
//         </View>

//         {/* Styled Connect Button */}
//         {hasData && (
//           <View style={styles.footer}>
//             <AppButton
//               title="Connect New Account"
//               onPress={handleConnectNewAccount}
//               backgroundColor={Colors.PRIMARY_TEAL} // Teal color from image
//               color={Colors.WHITE}
//             />
//           </View>
//         )}
//       </View>
//     </BGImage>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   headerTop: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     paddingHorizontal: Metrics.scale(20),
//     paddingTop: Metrics.verticalScale(10),
//   },
//   filterIcon: {
//     padding: 5,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//   },
//   viewLogsBtn: {
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.5)',
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   titleContainer: {
//     paddingHorizontal: Metrics.scale(25),
//     paddingTop: Metrics.verticalScale(30),
//     paddingBottom: Metrics.verticalScale(20),
//   },
//   listContent: {
//     paddingHorizontal: Metrics.scale(25),
//     paddingBottom: Metrics.verticalScale(120),
//   },
//   glassCard: {
//     padding: Metrics.scale(20),
//     marginBottom: Metrics.verticalScale(20),
//   },
//   infoSection: {
//     marginBottom: Metrics.verticalScale(10),
//   },
//   rowSmall: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   footer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     paddingHorizontal: Metrics.scale(25),
//     paddingBottom: Metrics.verticalScale(40),
//   },
// });

// export default YourSmartLocksScreen;




import React from 'react';
import { StyleSheet, View, ActivityIndicator, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import DropdownField from '@/components/molecules/Input/DropdownField';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useYourSmartLockssContainer from './YourSmartLockssContainer';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import SmartLockScreen from '../SmartLock/SmartLockScreen';

import ButtonView from '@/components/molecules/AppButton/ButtonView';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { navigate, goBack } from '@/services/navigationService';
import NoListingScreen from '../NoListingFoundOnSmartLock/NoListingScreen';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import BGImage from '@/components/molecules/BGImage/BGImage';

const YourSmartLocksScreen = () => {
  const {
    locksData,
    listingsData,
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

  // Condition Checks
  const hasListings = listingsData && listingsData.length > 0;
  const hasLocks = locksData && locksData.length > 0;

  // 1. Loading State
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY_TEAL} />
      </View>
    );
  }

  // 2. No Listings (Properties) - Show Property Fallback
  if (hasListings) {
    return <NoListingScreen />;
  }

  // 3. Has Listings but No Locks - Show Lock Fallback
  if (!hasLocks) {
    return <SmartLockScreen />;
  }

  // 4. Final State: Show List
  const renderLockCard = ({ item }: { item: any }) => {
    const batteryValue = Number(item.battery_percentage?.replace('%', ''));
    return (
      <GlassCard width="100%" style={styles.glassCard}>
        <Pressable onPress={() => goToScreen(item?.lock_id)}>
          <AppText text={item.alias} fontSize={20} type="Bold" color={Colors.BLACK} mb={8} />
          <View style={styles.infoSection}>
            <View style={styles.rowSmall}>
              <AppText text="TT Account: " fontSize={14} color={Colors.BLACK} />
              <AppText text="accountali@gmail.com" fontSize={14} color={Colors.BLACK} />
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
            data={LISTING_OPTIONS}
            placeholder="Select Property"
            onSelect={value => selectDropdown(value?.value, item.lock_id)}
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
            <AppText text="Your Smart Locks" fontSize={32} type="Bold" color={Colors.BLACK} />
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
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: Metrics.scale(20), 
    paddingTop: Metrics.verticalScale(10) 
  },
  backButton: { 
    width: 40, height: 40, borderRadius: 20, 
    backgroundColor: 'rgba(255,255,255,0.5)', 
    justifyContent: 'center', alignItems: 'center', 
    borderWidth: 1, borderColor: '#E0E0E0' 
  },
  viewLogsBtn: { 
    paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, 
    backgroundColor: 'rgba(255,255,255,0.5)', 
    borderWidth: 1, borderColor: '#E0E0E0' 
  },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titleContainer: { paddingHorizontal: Metrics.scale(25), paddingTop: Metrics.verticalScale(30), paddingBottom: Metrics.verticalScale(20) },
  listContent: { paddingHorizontal: Metrics.scale(25), paddingBottom: Metrics.verticalScale(120) },
  glassCard: { padding: Metrics.scale(20), marginBottom: Metrics.verticalScale(20) },
  infoSection: { marginBottom: Metrics.verticalScale(10) },
  rowSmall: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: Metrics.scale(25), paddingBottom: Metrics.verticalScale(40) },
});

export default YourSmartLocksScreen;