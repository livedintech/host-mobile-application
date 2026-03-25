import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@/theme/colors';
import AppText from '@/components/molecules/AppText/AppText';
import Svgicons from '@/components/atoms/Svgicons/Svgicons';
import AppButton from '@/components/molecules/AppButton/AppButton';
import useUserManagementContainer from '../containers/UserManagementContainer';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import GlassCard from '@/components/molecules/GlassCard/GlassCard';
import BGImage from '@/components/molecules/BGImage/BGImage';
import ButtonView from '@/components/molecules/AppButton/ButtonView';
import NoUserScreen from './NoUserScreen';

const UserManagementScreen = () => {
  const {
    handleCreateUser,
    handleEditUser,
    handleDeleteUser,
    userManagement,
    isLoading,
    isSubmitting,
    refetch,
    listings,
  } = useUserManagementContainer();

  // Logic to show "All Listings" or specific names
  const renderListingAccess = (item: any) => {
    if (item.is_all_listing) {
      return 'All Listings';
    }

    const ids = item.listing_scope?.listing_ids || [];
    if (ids.length === 0) return 'No Access';

    // Map IDs to Names from the listings query data
    const names = listings
      .filter((l: any) => ids.includes(Number(l.id)))
      .map((l: any) => l.name);

    return names.length > 0 ? names.join(', ') : 'No Access';
  };


  // Handling the Empty State
  if (!isLoading && userManagement?.length === 0) {
    return <NoUserScreen onCreateUser={handleCreateUser} />;
  }

  const renderUser = ({ item }: any) => (
    <GlassCard width="100%" style={styles.glassCardCustom}>
      <View style={styles.cardHeader}>
        <View>
          <AppText
            text={item.name}
            fontSize={20}
            type="Bold"
            color={Colors.BLACK}
          />
          <AppText
            text={item.role_namwe || 'User'}
            fontSize={14}
            color={Colors.BLACK}
          />
        </View>

        {/* Action Row containing Delete and Edit */}
        <View style={styles.actionRow}>
          <ButtonView
            style={[styles.actionButton, { marginRight: 8 }]}
            onPress={() => handleDeleteUser(item.id)}
            disabled={isSubmitting}
          >
            <Svgicons path="TrashFull" size={20} color={Colors.INDIAN_RED} />
          </ButtonView>

          <ButtonView
            style={styles.actionButton}
            onPress={() => handleEditUser(item)}
          >
            <Svgicons path="editIconUserManagement" size={20} />
          </ButtonView>
        </View>
      </View>

      <View style={styles.listingSection}>
        <AppText
          text="Listing Access"
          fontSize={14}
          type="Bold"
          color={Colors.BLACK}
        />
        {/* <AppText
          text={item.listing_scope?.display_name || 'All Listings'}
          fontSize={14}
          color={Colors.BLACK}
        /> */}
        <AppText
          text={renderListingAccess(item)} // Changed to use the helper function
          fontSize={14}
          color={Colors.DARK_CHARCOAL_OPACITY}
          // numberOfLines={2}
        />
      </View>
    </GlassCard>
  );

  return (
    <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <FlatListSimpleHandler
          data={userManagement}
          isLoading={isLoading}
          renderItem={renderUser}
          listEmptyText="No users found"
          onRefresh={refetch}
          keyExtractor={item => item?.id?.toString()}
          contentContainerStyle={styles.scrollContent}
          HeaderComponent={
            <View style={styles.headerContainer}>
              <AppText
                text="User Management"
                fontSize={28}
                type="Bold"
                color={Colors.BLACK}
              />
            </View>
          }
        />

        <View style={styles.footer}>
          <AppButton
            title="Create New User"
            onPress={handleCreateUser}
            backgroundColor={Colors.PRIMARY_TEAL}
            color={Colors.WHITE}
            loading={isSubmitting}
            style={{ height: 50, borderRadius: 25 }}
            textStyle={{ lineHeight: 25 }}
          />
        </View>
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  headerContainer: {
    marginTop: 40,
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  glassCardCustom: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 12,
  },
  listingSection: {
    marginTop: 15,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});

export default UserManagementScreen;