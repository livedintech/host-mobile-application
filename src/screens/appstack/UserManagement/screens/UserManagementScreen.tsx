import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import GradientBorder from '@/components/atoms/GradientBorder/GradientBorder';
import AppButton from '@/components/molecules/AppButton/AppButton';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import useUserManagementContainer from '../containers/UserManagementContainer';

const UserManagementScreen = () => {
  const {
    users,
    handleCreateUser,
    handleEditUser,
    handleDeleteUser,
  } = useUserManagementContainer();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
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

        {/* User Cards */}
        {users.map(user => (
          <GradientBorder
            key={user.id}
            borderRadius={16}
            borderWidth={1}
            style={styles.cardWrapper}
          >
            <View style={styles.cardInner}>
              <View style={styles.cardHeader}>
                <AppText
                  text={user.name}
                  fontSize={20}
                  type="Bold"
                  color={Colors.PINE_FOREST}
                />

                <View style={styles.actionRow}>
                  {/* Delete */}
                  <ButtonView
                    mr={15}
                    onPress={() => handleDeleteUser(user.id)}
                  >
                    <Svgicons path="TrashFull" size={20} />
                  </ButtonView>

                  {/* Edit */}
                  <ButtonView onPress={() => handleEditUser(user.id)}>
                    <Svgicons path="editIconUserManagement" size={20} />
                  </ButtonView>
                </View>
              </View>

              <View style={styles.infoRow}>
                <AppText
                  text={user.role}
                  fontSize={18}
                  color={Colors.PINE_FOREST}
                  mr={8}
                />
                <Svgicons path="roleIcon" size={18} />
              </View>

              <View style={[styles.infoRow, { marginTop: 19 }]}>
                <AppText
                  text={`Listing Access: ${user.access}`}
                  fontSize={14}
                  color={Colors.PINE_FOREST}
                  mr={8}
                />
                <Svgicons path="buildingIcon" size={24} />
              </View>
            </View>
          </GradientBorder>
        ))}
      </ScrollView>

      {/* Create Button */}
      <View style={styles.footer}>
        <AppButton
          title="Create New User"
          onPress={handleCreateUser}
          backgroundColor={Colors.WHITE}
          borderColor={Colors.ARGENT}
          color={Colors.PINE_FOREST}
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
