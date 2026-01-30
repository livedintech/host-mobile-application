import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import AppButton from '@/components/molecules/AppButton/AppButton';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import useUserManagementContainer from '../containers/UserManagementContainer';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';

const UserManagementScreen = () => {
  const {
    handleCreateUser,
    handleEditUser,
    handleDeleteUser,
    userManagement,
    isLoading,
    refetch, // 👈 assuming tum container se de sakte ho
  } = useUserManagementContainer();

  const users = userManagement?.users ?? [];

  const renderUser = ({ item }: any) => (
    <GradientBorder
      borderRadius={16}
      borderWidth={1}
      style={styles.cardWrapper}
    >
      <View style={styles.cardInner}>
        <View style={styles.cardHeader}>
          <AppText
            text={item.name}
            fontSize={20}
            type="Bold"
            color={Colors.PINE_FOREST}
          />

          <View style={styles.actionRow}>
            {/* Delete */}
            <ButtonView mr={15} onPress={() => handleDeleteUser(item.id)}>
              <Svgicons path="TrashFull" size={20} />
            </ButtonView>

            {/* Edit */}
            <ButtonView onPress={() => handleEditUser(item)}>
              <Svgicons path="editIconUserManagement" size={20} />
            </ButtonView>
          </View>
        </View>

        <View style={styles.infoRow}>
          <AppText
            text={item.role_name}
            fontSize={18}
            color={Colors.PINE_FOREST}
            mr={8}
          />
          <Svgicons path="roleIcon" size={18} />
        </View>
      </View>
    </GradientBorder>
  );

  return (
    <View style={styles.container}>
      <FlatListSimpleHandler
        data={users}
        isLoading={isLoading}
        renderItem={renderUser}
        listEmptyText="No users found"
        onRefresh={refetch}
        contentContainerStyle={styles.scrollContent}
        HeaderComponent={
          <View style={styles.titleRow}>
            <AppText
              text="User Management"
              fontSize={23}
              type="Bold"
              color={Colors.PINE_FOREST}
              mr={10}
            />
            <Svgicons path="userManagementIcon" size={30} />
          </View>
        }
      />

      {/* Create Button */}
      <View style={styles.footer}>
        <AppButton
          title="Create New User"
          onPress={handleCreateUser}
          backgroundColor={Colors.WHITE}
          borderColor={Colors.ARGENT}
          color={Colors.PINE_FOREST}
          loading={isLoading}
        />
      </View>
    </View>
  );
};

export default UserManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 120,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  cardWrapper: {
    marginBottom: 20,
  },
  cardInner: {
    backgroundColor: Colors.WHITE,
    padding: 20,
    borderRadius: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 30,
    paddingBottom: 40,
    backgroundColor: Colors.WHITE,
  },
});
