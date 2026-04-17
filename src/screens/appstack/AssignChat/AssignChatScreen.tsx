import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Pressable, Platform, Modal } from 'react-native';
import AppText from '@/components/molecules/AppText/AppText';
import { Colors } from '@/theme/colors';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import Metrics from '@/utility/Metrics';
import useAssignChatContainer from './AssignChatContainer';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import { goBack } from '@/services/navigationService';
import ConfirmAction from '@/components/molecules/ConfirmAction/ConfirmAction';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import { useRoute } from '@react-navigation/native';
import BGImage from '@/components/molecules/BGImage/BGImage';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import AppButton from '@/components/molecules/AppButton/AppButton';

const AssignChatScreen = () => {
  const route = useRoute<any>();
  const params = route?.params;
  const assignedIds = params?.assigned_to_ids || [];
  const listing_id = params?.listing_id;
  const propertyName = params?.propertyName;
  const guestName = params?.guestName || 'Oasis Tower, Al Riyadh';
  const [isModalVisible, setModalVisible] = useState(false);


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
  const handleConfirmAction = async () => {
    await confirm();
    setModalVisible(false); // Action ke baad close
  };

  const onPressUser = (item: any) => {
    handleAssignUser(item);
    setModalVisible(true); // Modal open karein
  };

  const filteredUserManagement = useMemo(() => {
    if (!listing_id) return userManagement;
    return userManagement.filter((u: any) => {
      const userListingIds = u?.listing_scope?.listing_ids || [];
      return userListingIds.some((id: any) => Number(id) === Number(listing_id));
    });
  }, [userManagement, listing_id]);

  const isSelectedUserAssigned =
    selectedUser &&
    assignedIds.some((id: any) => Number(id) === Number(selectedUser.id));

  const renderUserItem = ({ item }: { item: any }) => {
    const isAssigned = assignedIds.some(
      (id: any) => Number(id) === Number(item.id),
    );
    const isSupervisor = user?.role_key === 'supervisor';

    return (
      <Pressable
        disabled={isSupervisor}
        onPress={() => onPressUser(item)}
      >
        <GlassCard
          width="100%"
          style={[
            styles.glassCardOverride,
            isAssigned && styles.assignedGlassCard
          ]}
        >
          <View style={styles.cardContent}>
            <View>
              <AppText
                text={item.name}
                fontSize={18}
                type="Bold"
                color={isAssigned ? Colors.BLACK : Colors.BLACK}
              />
              <AppText
                text={item.role_namwe || item.role}
                fontSize={14}
                color={isAssigned ? Colors.BLACK : Colors.BLACK}
              />
            </View>
            {isAssigned && (
              <Svgicons
                path="CheckboxCheckedIcon"
                size={22}
                color={Colors.WHITE}
              />
            )}
          </View>
        </GlassCard>
      </Pressable>
    );
  };

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <GradientBorder borderRadius={16} borderWidth={1} style={styles.arrowCircleInner}>
            <Pressable style={styles.arrowCircleInner} onPress={() => goBack()}>
              <Svgicons path="arrowLeftIcon" size={26} />
            </Pressable>
          </GradientBorder>
   {/* <AppText
            text={guestName}
            fontSize={16}
            color={Colors.BLACK}
            mt={4}
            numberOfLines={2}
          />
          
          <View style={styles.menuIconPlaceholder}>
            <Svgicons path="menu" size={28} color={Colors.CHARCOAL} />
          </View> */}
        </View>

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <AppText
            text="Assign chat to users"
            fontSize={28}
            type="Medium"
            color={Colors.BLACK}
            mb={20}
          />
          <AppText
            text={propertyName}
            fontSize={16}
            color={Colors.BLACK}
            mt={4}
            numberOfLines={2}
          />
        </View>

        <FlatListSimpleHandler
          data={filteredUserManagement}
          renderItem={renderUserItem}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContainer}
          isLoading={isLoading}
          onRefresh={refetch}
          listEmptyText="No users found for this listing"
        />

        {/* <ConfirmAction
          ref={removeSheetRef}
          content={
            isSelectedUserAssigned
              ? `Do you want to unassigned ${selectedUser?.name} from this chat?`
              : `Do you want to assigned this chat to ${selectedUser?.name}?`
          }
          confirmText={isSelectedUserAssigned ? 'Unassigned' : 'Assigned'}
          closeText="Cancel"
          onConfirm={confirm}
          isLoading={isLoadingRemoved}
        /> */}
        <Modal
          transparent
          visible={isModalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <AppText
                text={isSelectedUserAssigned ? "Unassign User" : `Assign this chat to ${selectedUser?.name}?`}
                fontSize={17}
                type="Bold"
                textAlign="center"
                mb={15}
              />
              <AppText
                text={
                  isSelectedUserAssigned
                    // ? `Do you want to unassign ${selectedUser?.name} from this chat?`
                    ? `Are you sure you want to unassign ${selectedUser?.name} from this task/chat?`
                    : `Are you sure you want to assign this task/chat to ${selectedUser?.name}?`
                }
                fontSize={16}
                textAlign="center"
                mb={25}
              />
              <View style={styles.modalButtons}>
                <AppButton title='Cancel' onPress={() => setModalVisible(false)} variant='secondary' style={{ width: Metrics.scale(160) }} />
                <AppButton title={isLoadingRemoved ? "Wait..." : (isSelectedUserAssigned ? 'Unassign' : 'Confirm')} onPress={handleConfirmAction} style={{ width: Metrics.scale(160) }} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 20
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 37,
  },
  arrowCircleInner: {
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE
  },
  menuIconPlaceholder: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    paddingHorizontal: 25,
    marginBottom: 40,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  glassCardOverride: {
    marginBottom: 12,
    borderRadius: 24, // Matches the rounded look in design
    padding: 20,
  },
  assignedGlassCard: {
    // backgroundColor: Colors.TEAL_PRIMARY_ALT,
    // borderColor: Colors.TEAL_PRIMARY_ALT,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Background dhundla karne ke liye
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCancel: {
    backgroundColor: '#F0F0F0',
  },
  btnConfirm: {
    backgroundColor: Colors.BLACK, // Ya jo apka primary color ho
  },
});

export default AssignChatScreen;