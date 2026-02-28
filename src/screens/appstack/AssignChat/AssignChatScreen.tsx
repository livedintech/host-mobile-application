// import React from 'react';
// import { StyleSheet, View, FlatList, SafeAreaView, Pressable } from 'react-native';
// import AppText from '@/components/molecules/AppText/AppText';
// import { Colors } from '@/theme/colors';
// import Svgicons from '@/components/atoms/Svgicons/Svgicons';
// import Metrics from '@/utility/Metrics';
// import ButtonView from '@/components/molecules/AppButton/ButtonView';
// import useAssignChatContainer from './AssignChatContainer';
// import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
// import {
//     Menu,
//     MenuOptions,
//     MenuOption,
//     MenuTrigger,
// } from 'react-native-popup-menu';
// import { goBack } from '@/services/navigationService';
// import ConfirmAction from '@/components/molecules/ConfirmAction/ConfirmAction';
// import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
// import { useRoute } from '@react-navigation/native';
// import { useAuthStore } from '@/store/useAuthStore';

// const AssignChatScreen = () => {
//     const {params} = useRoute();
//     console.log('paramss',params?.guestName);
//     const {user} = useAuthStore();
//     console.log(user?.role_key === 'supervisor')
//     const { userManagement, handleAssignUser, confirm, isLoadingRemoved, removeSheetRef, selectedUser,isLoading,refetch } = useAssignChatContainer();
//     const renderUserItem = ({ item }: { item: any }) => (
//         <ButtonView
//             style={styles.userCard}
//             onPress={() => handleAssignUser(item)}
//         >
//             <AppText
//                 text={item.name}
//                 fontSize={20}
//                 type="Bold"
//                 color={Colors.BRUNSWICK_GREEN}
//             />
//             <AppText
//                 text={item.role_namwe}
//                 fontSize={15}
//                 color={Colors.BRUNSWICK_GREEN}
//             />
//         </ButtonView>
//     );

//     return (
//         <View style={styles.container}>
//             {/* Header */}
//             <View style={styles.header}>
//                 <GradientBorder
//                     borderRadius={16}
//                     borderWidth={1}
//                     style={styles.arrowCircleInner}
//                 >
//                     <Pressable style={styles.arrowCircleInner} onPress={() => goBack()}>
//                         <Svgicons path="arrowLeftIcon" size={26} />
//                     </Pressable>
//                 </GradientBorder>
//                 <AppText
//                     text={params?.guestName}
//                     fontSize={18}
//                     type="Bold"
//                     color={Colors.MIDNIGHT}
//                 />

//                 {/* <Menu>
//                     <MenuTrigger customStyles={{ triggerWrapper: styles.menuTrigger }}>
//                         <Svgicons path="menu" size={28} color={Colors.CHARCOAL} />
//                     </MenuTrigger>
//                     <MenuOptions customStyles={{ optionsContainer: styles.popupMenu }}>
//                         <MenuOption style={styles.menuItem}>
//                             <AppText
//                                 text="View Listing Calendar"
//                                 fontSize={14}
//                                 color={Colors.CHARCOAL}
//                             />
//                             <Svgicons path="listingCalendar" size={24} />
//                         </MenuOption>
//                         <MenuOption style={styles.menuItem}>
//                             <AppText
//                                 text="Reservation Details"
//                                 fontSize={14}
//                                 color={Colors.CHARCOAL}
//                             />
//                             <Svgicons path="reservationDetail" size={24} />
//                         </MenuOption>
//                         <MenuOption style={styles.menuItem}>
//                             <AppText
//                                 text="Assign Chat To User"
//                                 fontSize={14}
//                                 color={Colors.CHARCOAL}
//                             />
//                             <Svgicons path="expandIcon" size={24} />
//                         </MenuOption>
//                         <MenuOption style={[styles.menuItem, { borderBottomWidth: 0 }]}>
//                             <AppText
//                                 text="Add Internal Notes"
//                                 fontSize={14}
//                                 color={Colors.CHARCOAL}
//                             />
//                             <Svgicons path="note" size={24} />
//                         </MenuOption>
//                     </MenuOptions>
//                 </Menu> */}
//                 <View/>
//             </View>

//             <View style={styles.titleSection}>
//                 <View style={styles.titleWrapper}>
//                     <AppText text="Assign Chat To User" fontSize={22} type="Bold" color={Colors.BRUNSWICK_GREEN} />
//                     <Svgicons path="expandIcon" size={18} color={Colors.BRUNSWICK_GREEN} ml={8} />
//                 </View>
//             </View>

//             {/* <FlatList
//                 data={users}
//                 renderItem={renderUserItem}
//                 keyExtractor={item => item.id}
//                 contentContainerStyle={styles.listContainer}
//                 showsVerticalScrollIndicator={false}
//             /> */}

//             <FlatListSimpleHandler
//                 data={userManagement}
//                 renderItem={renderUserItem}
//                 keyExtractor={item => item.id}
//                 contentContainerStyle={styles.listContainer}
//                 showsVerticalScrollIndicator={false}
//                 isLoading={isLoading}
//                 onRefresh={refetch}
//             />
//             <ConfirmAction
//                 ref={removeSheetRef}
//                 title={selectedUser?.name}
//                 content="Are you sure you want to assign this chat?"
//                 confirmText="Confirm"
//                 closeText="Cancel"
//                 onConfirm={confirm}
//                 isLoading={isLoadingRemoved}
//             />

//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: Colors.WHITE
//     },
//     headerContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: Metrics.scale(20),
//         paddingVertical: Metrics.verticalScale(15),
//     },
//     backBtn: {
//         padding: Metrics.scale(8),
//         borderWidth: 1,
//         borderColor: Colors.SMOOTH_GREY,
//         borderRadius: 100
//     },
//     titleSection: {
//         alignItems: 'center',
//         marginVertical: Metrics.verticalScale(25),
//     },
//     titleWrapper: {
//         flexDirection: 'row',
//         alignItems: 'center'
//     },
//     listContainer: {
//         paddingHorizontal: Metrics.scale(25),
//         paddingBottom: Metrics.verticalScale(20)
//     },
//     userCard: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: Colors.SMOOTH_GREY,
//         borderRadius: 15,
//         paddingHorizontal: Metrics.scale(20),
//         paddingVertical: Metrics.verticalScale(22),
//         marginBottom: Metrics.verticalScale(15),
//         backgroundColor: Colors.WHITE,
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: 15,
//         paddingVertical: 12,
//         borderBottomWidth: 1,
//         borderBottomColor: '#F0F0F0',
//     },
//     arrowCircleInner: {
//         width: 32,
//         height: 32,
//         borderRadius: 16,
//         backgroundColor: Colors.WHITE,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     menuTrigger: {
//         padding: 8,
//     },
//     popupMenu: {
//         borderRadius: 12,
//         backgroundColor: Colors.WHITE,
//         padding: 5,
//         marginTop: 20,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.15,
//         shadowRadius: 8,
//         elevation: 10,
//     },
//     menuItem: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 6,
//         paddingVertical: 12,
//     },
// });

// export default AssignChatScreen;

import React, { useMemo } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import useAssignChatContainer from './AssignChatContainer';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { goBack } from '@/services/navigationService';
import ConfirmAction from '@/components/molecules/ConfirmAction/ConfirmAction';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import { useRoute } from '@react-navigation/native';

const AssignChatScreen = () => {
  const route = useRoute<any>();
  const params = route?.params;
  const assignedIds = params?.assigned_to_ids || [];
  const listing_id = params?.listing_id;
  
  console.log("assinflisting_id", listing_id);

  const {
    userManagement,
    handleAssignUser,
    confirm,
    isLoadingRemoved,
    removeSheetRef,
    selectedUser,
    isLoading,
    refetch,
    user,
  } = useAssignChatContainer();

  // FILTER LOGIC: Filter users whose listing_scope includes the listing_id from params
  const filteredUserManagement = useMemo(() => {
    if (!listing_id) return userManagement; 
    
    return userManagement.filter((u: any) => {
      // Access the listing_ids array inside listing_scope
      const userListingIds = u?.listing_scope?.listing_ids || [];
      // Match the ID (using Number to ensure type safety)
      return userListingIds.some((id: any) => Number(id) === Number(listing_id));
    });
  }, [userManagement, listing_id]);

  console.log("filteredUserManagement", filteredUserManagement);

  const isSelectedUserAssigned =
    selectedUser &&
    assignedIds.some((id: any) => Number(id) === Number(selectedUser.id));

  const renderUserItem = ({ item }: { item: any }) => {
    const isAssigned = assignedIds.some(
      (id: any) => Number(id) === Number(item.id),
    );
    const isSupervisor = user?.role_key === 'supervisor';

    const metallicColors = ['#808080', '#FFFFFF', '#808080'];
    const metallicLocations = [0, 0.49, 1];
    const assignedColors = [Colors.BRUNSWICK_GREEN, '#5D8A82'];
    const assignedLocations = [0, 1];

    return (
      <GradientBorder
        borderRadius={14}
        borderWidth={1}
        colors={isAssigned ? assignedColors : metallicColors}
        locations={isAssigned ? assignedLocations : metallicLocations}
        style={styles.cardWrapper}
      >
        <ButtonView
          style={[styles.userCard, isAssigned && styles.highlightedCard]}
          disabled={isSupervisor}
          onPress={() => handleAssignUser(item)}
        >
          <View style={styles.cardInner}>
            <AppText
              text={item.name}
              fontSize={18}
              type="Bold"
              color={isAssigned ? Colors.WHITE : Colors.BRUNSWICK_GREEN}
            />
            <AppText
              text={item.role_namwe}
              fontSize={14}
              color={isAssigned ? Colors.WHITE : Colors.BRUNSWICK_GREEN}
            />
          </View>
          {isAssigned && (
            <Svgicons
              path="CheckboxCheckedIcon"
              size={20}
              color={Colors.WHITE}
            />
          )}
        </ButtonView>
      </GradientBorder>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <GradientBorder borderRadius={16} borderWidth={1} style={styles.arrowCircleInner}>
          <Pressable style={styles.arrowCircleInner} onPress={() => goBack()}>
            <Svgicons path="arrowLeftIcon" size={26} />
          </Pressable>
        </GradientBorder>
        <AppText
          text={params?.guestName || 'Assign Chat'}
          fontSize={18}
          type="Bold"
          color={Colors.MIDNIGHT}
        />
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.titleSection}>
        <View style={styles.titleWrapper}>
          <AppText
            text={user?.role_key === 'supervisor' ? 'Assigned Chat Users' : 'Assign Chat To User'}
            fontSize={22}
            type="Bold"
            color={Colors.BRUNSWICK_GREEN}
          />
          <Svgicons path="expandIcon" size={24} color={Colors.BRUNSWICK_GREEN} />
        </View>
      </View>

      <FlatListSimpleHandler
        data={filteredUserManagement} 
        renderItem={renderUserItem}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.listContainer}
        isLoading={isLoading}
        onRefresh={refetch}
      />

      <ConfirmAction
        ref={removeSheetRef}
        // title={selectedUser?.name}
        content={
          isSelectedUserAssigned
            ? `Do you want to unassigned ${selectedUser?.name} from this chat?`
            : `Do you want to assigned this chat to ${selectedUser?.name}?`
        }
        confirmText={isSelectedUserAssigned ? 'Unassigned' : 'Assigned'}
        closeText="Cancel"
        onConfirm={confirm}
        isLoading={isLoadingRemoved}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  arrowCircleInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
  },
  titleSection: {
    alignItems: 'center',
    marginVertical: Metrics.verticalScale(25),
  },
  titleWrapper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  listContainer: {
    paddingHorizontal: Metrics.scale(25),
    paddingBottom: Metrics.verticalScale(20),
  },
  cardWrapper: { marginBottom: Metrics.verticalScale(12) },
  userCard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 15,
    paddingHorizontal: Metrics.scale(20),
    paddingVertical: Metrics.verticalScale(20),
    backgroundColor: Colors.WHITE,
  },
  cardInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  highlightedCard: { backgroundColor: Colors.BRUNSWICK_GREEN },
});

export default AssignChatScreen;