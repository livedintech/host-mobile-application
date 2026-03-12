// import React, { useState } from 'react';
// import { StyleSheet, View, ActivityIndicator } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { s, vs } from 'react-native-size-matters';
// import { useRoute } from '@react-navigation/native';

// import useListingContainer from './container/ListingContainer';
// import SegmentedControl from '@/components/molecules/SegmentedControl/SegmentedControl';
// import ReservationCard from '@/components/molecules/ReservationCard/ReservationCard';
// import AppText from '@/components/molecules/AppText/AppText';
// import { BookingDetailsView } from '@/components/molecules/BookingDetailsView/BookingDetailsView';
// import { CalendarSection } from '@/components/molecules/CalendarSection/CalendarSection';
// import { ReservationHeader } from '@/components/molecules/ReservationHeader/ReservationHeader';
// import { FilterModalView } from '@/components/molecules/FilterModalView/FilterModalView';
// import { CreateBookingSheet } from '@/components/molecules/CreateBookingSheet/CreateBookingSheet';
// import { Colors } from '@/theme/colors';
// import { getOtaConfig } from '@/constants/ota_config';
// import { useAuthStore } from '@/store/useAuthStore';
// import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
// import { navigate } from '@/services/navigationService';
// import NavigationRoutes from '@/navigation/NavigationRoutes';
// import useManageBookingContainer from '../ManageBooking/ManageBookingContainer';
// import NoListing from './NoListing';

// const ListingScreen = () => {
//   // Fix for the Render Error
//   const authStore = useAuthStore();
//   const user = authStore?.user; 

//   const route = useRoute<any>();
//   const [selectedTab, setSelectedTab] = useState(0);
//   const [isModalVisible, setModalVisible] = useState(false);
//   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
//   const [selectedPropertyValues, setSelectedPropertyValues] = useState<string[]>([]);
//   const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

//   const { isOtaConnected } = useManageBookingContainer();

//   const {
//     control,
//     errors,
//     handleSubmit,
//     setValue,
//     selectedListingId,
//     listingOptions,
//     resLoading,
//     filteredReservations,
//     calendarDataMap,
//     defaultDailyPrice,
//     isFetchingDetails,
//     searchQuery,
//     setSearchQuery,
//     activeFilter,
//     setActiveFilter,
//     bookingType,
//     setBookingType,
//     setAppliedListingIds,
//     handleReservationPress,
//     onCreateBooking,
//     handleRefresh,
//     isRefreshing,
//     isBookingOpen,
//     setIsBookingOpen,
//     isLoading
//   } = useListingContainer(route.params?.listing_id, selectedTab);

//   // --- CONNECT ACCOUNT REDIRECT ---
//   const handleConnectAccount = () => {
//     navigate(NavigationRoutes.APP_STACK.MANAGE_BOOKING);
//   };

//   // --- EARLY RETURN FOR NO OTA ---
//   if (!isOtaConnected) {
//     return (
//       <SafeAreaView style={styles.container} edges={['top']}>
//         <NoListing onConnect={handleConnectAccount} />
//       </SafeAreaView>
//     );
//   }

//   const handleDayPress = (day: any) => {
//     const dateData = calendarDataMap[day.dateString];
//     const isBooked = selectedListingId
//       ? dateData?.type && dateData.type !== 'none'
//       : (dateData?.channels?.length ?? 0) > 0;

//     if (isBooked) {
//       const bookingCode = selectedListingId 
//         ? dateData.bookingData?.booking_id 
//         : dateData.bookings?.[0]?.booking_id;

//       if (bookingCode) {
//         setSelectedBookingId(bookingCode);
//         setIsDetailsOpen(true);
//       }
//     } else {
//       if (user?.role_key === 'supervisor') return;
//       setValue('start_date', day.dateString);
//       setIsBookingOpen(true);
//     }
//   };

//   const onBookingSubmit = async (data: any) => {
//     const success = await onCreateBooking(data);
//     if (success) setIsBookingOpen(false);
//   };

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       <BookingDetailsView
//         isVisible={isDetailsOpen}
//         onClose={() => {
//           setIsDetailsOpen(false);
//           setSelectedBookingId(null);
//         }}
//         bookingId={selectedBookingId}
//         onCardPress={handleReservationPress}
//       />

//       {isFetchingDetails && (
//         <View style={styles.overlayLoader}>
//           <ActivityIndicator size="large" color={Colors.BRUNSWICK_GREEN} />
//         </View>
//       )}

//       {!isDetailsOpen && (
//         <>
//           <View style={styles.headerFixed}>
//             <View style={styles.segmentedWrapper}>
//               <SegmentedControl
//                 options={['Calendar', 'Reservation']}
//                 selectedIndex={selectedTab}
//                 onChange={setSelectedTab}
//               />
//             </View>
//             {selectedTab === 1 && (
//               <ReservationHeader
//                 searchQuery={searchQuery}
//                 setSearchQuery={setSearchQuery}
//                 onFilterPress={() => setModalVisible(true)}
//                 activeFilter={activeFilter}
//                 setActiveFilter={setActiveFilter}
//               />
//             )}
//           </View>

//           {selectedTab === 0 ? (
//             <CalendarSection
//               control={control}
//               errors={errors}
//               listingOptions={listingOptions}
//               selectedListingId={selectedListingId || ''}
//               markedDates={calendarDataMap}
//               onDayPress={handleDayPress}
//               defaultPrice={defaultDailyPrice}
//               isLoading={isRefreshing}
//               onRefresh={handleRefresh}
//             />
//           ) : (
//             <View style={{ flex: 1 }}>
//               {resLoading ? (
//                 <View style={styles.centerContainer}>
//                   <ActivityIndicator size="large" color={Colors.BRUNSWICK_GREEN} />
//                 </View>
//               ) : (
//                 <FlatListSimpleHandler
//                   showsVerticalScrollIndicator={false}
//                   isLoading={isRefreshing}
//                   onRefresh={handleRefresh}
//                   data={filteredReservations}
//                   keyExtractor={item => item.id}
//                   contentContainerStyle={styles.listContent}
//                   ListEmptyComponent={
//                     <View style={styles.centerContainer}>
//                       <AppText text="No reservations found" color="#999" />
//                     </View>
//                   }
//                   renderItem={({ item }) => {
//                     const config = getOtaConfig(item.source);
//                     return (
//                       <ReservationCard
//                         id={item.booking_id || item.id}
//                         guestName={item.guest}
//                         platform={item.source_type === 'livedin' ? 'Livedin' : config.label}
//                         property={item.listing_title || 'Property'}
//                         endDate={item.end_date}
//                         startDate={item.start_date}
//                         checkIn={item?.checkIn || '04:00 PM'}
//                         checkOut={item?.checkOut || '12:00 AM'}
//                         platformColor={config.color}
//                         onPress={handleReservationPress}
//                       />
//                     );
//                   }}
//                 />
//               )}
//             </View>
//           )}
//         </>
//       )}

//       <FilterModalView
//         isVisible={isModalVisible}
//         onClose={() => setModalVisible(false)}
//         initialSelectedValues={selectedPropertyValues}
//         onApply={f => {
//           setSelectedPropertyValues(f);
//           setAppliedListingIds(f.join(','));
//           setModalVisible(false);
//         }}
//         onReset={() => {
//           setSelectedPropertyValues([]);
//           setAppliedListingIds('');
//         }}
//         actualProperties={(listingOptions || []).filter(
//           (opt: any) =>
//             opt.value !== '' &&
//             !(opt.label || '').toLowerCase().includes('all listing'),
//         )}
//       />
      
//       {isBookingOpen && (
//         <CreateBookingSheet
//           isVisible={isBookingOpen}
//           onClose={() => setIsBookingOpen(false)}
//           bookingType={bookingType}
//           setBookingType={setBookingType}
//           control={control}
//           errors={errors}
//           listingOptions={listingOptions}
//           selectedListingId={selectedListingId || ''}
//           onSubmit={handleSubmit(onBookingSubmit)}
//           isLoading={isLoading}
//         />
//       )} 
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#FFF' },
//   headerFixed: {
//     paddingHorizontal: s(16),
//     backgroundColor: '#FFF',
//     zIndex: 10,
//   },
//   segmentedWrapper: { alignItems: 'center', paddingVertical: vs(8) },
//   listContent: { padding: s(16), flexGrow: 1 },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: vs(100),
//   },
//   overlayLoader: {
//     ...StyleSheet.absoluteFill,
//     backgroundColor: 'rgba(255,255,255,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 999,
//   },
// });

// export default ListingScreen;

import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { s, vs } from 'react-native-size-matters';
import { useRoute } from '@react-navigation/native';

import useListingContainer from './container/ListingContainer';
import SegmentedControl from '@/components/molecules/SegmentedControl/SegmentedControl';
import ReservationCard from '@/components/molecules/ReservationCard/ReservationCard';
import AppText from '@/components/molecules/AppText/AppText';
import { BookingDetailsView } from '@/components/molecules/BookingDetailsView/BookingDetailsView';
import { CalendarSection } from '@/components/molecules/CalendarSection/CalendarSection';
import { ReservationHeader } from '@/components/molecules/ReservationHeader/ReservationHeader';
import { FilterModalView } from '@/components/molecules/FilterModalView/FilterModalView';
import { CreateBookingSheet } from '@/components/molecules/CreateBookingSheet/CreateBookingSheet';
import { Colors } from '@/theme/colors';
import { getOtaConfig } from '@/constants/ota_config';
import { useAuthStore } from '@/store/useAuthStore';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import useManageBookingContainer from '../ManageBooking/ManageBookingContainer';
import NoListing from './NoListing';
import BGImage from '@/components/molecules/BGImage/BGImage';

const ListingScreen = () => {
  const authStore = useAuthStore();
  const user = authStore?.user; 

  const route = useRoute<any>();
  const [selectedTab, setSelectedTab] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPropertyValues, setSelectedPropertyValues] = useState<string[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const { isOtaConnected } = useManageBookingContainer();

  const {
    control,
    errors,
    handleSubmit,
    setValue,
    selectedListingId,
    listingOptions,
    resLoading,
    filteredReservations,
    calendarDataMap,
    defaultDailyPrice,
    isFetchingDetails,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    bookingType,
    setBookingType,
    setAppliedListingIds,
    handleReservationPress,
    onCreateBooking,
    handleRefresh,
    isRefreshing,
    isBookingOpen,
    setIsBookingOpen,
    isLoading
  } = useListingContainer(route.params?.listing_id, selectedTab);

  const handleConnectAccount = () => {
    navigate(NavigationRoutes.APP_STACK.MANAGE_BOOKING);
  };

  if (!isOtaConnected) {
    return (
      <BGImage source={require('@/assets/img/background/linearBG.png')}>
        <SafeAreaView style={styles.transparentContainer} edges={['top']}>
          <NoListing onConnect={handleConnectAccount} />
        </SafeAreaView>
      </BGImage>
    );
  }

  const handleDayPress = (day: any) => {
    const dateData = calendarDataMap[day.dateString];
    const isBooked = selectedListingId
      ? dateData?.type && dateData.type !== 'none'
      : (dateData?.channels?.length ?? 0) > 0;

    if (isBooked) {
      const bookingCode = selectedListingId 
        ? dateData.bookingData?.booking_id 
        : dateData.bookings?.[0]?.booking_id;

      if (bookingCode) {
        setSelectedBookingId(bookingCode);
        setIsDetailsOpen(true);
      }
    } else {
      if (user?.role_key === 'supervisor') return;
      setValue('start_date', day.dateString);
      setIsBookingOpen(true);
    }
  };

  const onBookingSubmit = async (data: any) => {
    const success = await onCreateBooking(data);
    if (success) setIsBookingOpen(false);
  };

  return (
    <BGImage source={require('@/assets/img/background/statsCardBG.png')}>
      <SafeAreaView style={styles.transparentContainer} edges={['top']}>
        <StatusBar barStyle="dark-content" />
        <BookingDetailsView
          isVisible={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedBookingId(null);
          }}
          bookingId={selectedBookingId}
          onCardPress={handleReservationPress}
        />

        {isFetchingDetails && (
          <View style={styles.overlayLoader}>
            <ActivityIndicator size="large" color={Colors.BRUNSWICK_GREEN} />
          </View>
        )}

        {!isDetailsOpen && (
          <>
            <View style={styles.headerFixed}>
              <View style={styles.segmentedWrapper}>
                <SegmentedControl
                  options={['Calendar', 'Reservation']}
                  selectedIndex={selectedTab}
                  onChange={setSelectedTab}
                />
              </View>
              {selectedTab === 1 && (
                <ReservationHeader
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onFilterPress={() => setModalVisible(true)}
                  activeFilter={activeFilter}
                  setActiveFilter={setActiveFilter}
                />
              )}
            </View>

            {selectedTab === 0 ? (
              <CalendarSection
                control={control}
                errors={errors}
                listingOptions={listingOptions}
                selectedListingId={selectedListingId || ''}
                markedDates={calendarDataMap}
                onDayPress={handleDayPress}
                defaultPrice={defaultDailyPrice}
                isLoading={isRefreshing}
                onRefresh={handleRefresh}
              />
            ) : (
              <View style={{ flex: 1 }}>
                {resLoading ? (
                  <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={Colors.BRUNSWICK_GREEN} />
                  </View>
                ) : (
                  <FlatListSimpleHandler
                    showsVerticalScrollIndicator={false}
                    isLoading={isRefreshing}
                    onRefresh={handleRefresh}
                    data={filteredReservations}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                      <View style={styles.centerContainer}>
                        <AppText text="No reservations found" color="#999" />
                      </View>
                    }
                    renderItem={({ item }) => {
                      const config = getOtaConfig(item.source);
                      return (
                        <ReservationCard
                          id={item.booking_id || item.id}
                          guestName={item.guest}
                          platform={item.source_type === 'livedin' ? 'Livedin' : config.label}
                          property={item.listing_title || 'Property'}
                          endDate={item.end_date}
                          startDate={item.start_date}
                          checkIn={item?.checkIn || '04:00 PM'}
                          checkOut={item?.checkOut || '12:00 AM'}
                          platformColor={config.color}
                          onPress={handleReservationPress}
                        />
                      );
                    }}
                  />
                )}
              </View>
            )}
          </>
        )}

        <FilterModalView
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          initialSelectedValues={selectedPropertyValues}
          onApply={f => {
            setSelectedPropertyValues(f);
            setAppliedListingIds(f.join(','));
            setModalVisible(false);
          }}
          onReset={() => {
            setSelectedPropertyValues([]);
            setAppliedListingIds('');
          }}
          actualProperties={(listingOptions || []).filter(
            (opt: any) =>
              opt.value !== '' &&
              !(opt.label || '').toLowerCase().includes('all listing'),
          )}
        />
        
        {isBookingOpen && (
          <CreateBookingSheet
            isVisible={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
            bookingType={bookingType}
            setBookingType={setBookingType}
            control={control}
            errors={errors}
            listingOptions={listingOptions}
            selectedListingId={selectedListingId || ''}
            onSubmit={handleSubmit(onBookingSubmit)}
            isLoading={isLoading}
          />
        )} 
      </SafeAreaView>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  transparentContainer: { flex: 1, backgroundColor: 'transparent' },
  headerFixed: {
    paddingHorizontal: s(16),
    backgroundColor: 'transparent', // Make header transparent to show BG
    zIndex: 10,
  },
  segmentedWrapper: { alignItems: 'center', paddingVertical: vs(8) },
  listContent: { padding: s(16), flexGrow: 1 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: vs(100),
  },
  overlayLoader: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});

export default ListingScreen;