import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@/theme/colors';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import ReviewCard from '../components/ReviewCard';
import useFetchReviews from '../containers/useFetchReviews';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

const ReviewManagementScreen = () => {
  // Using your hook logic
  const { reviews, isLoading, refreshReviews } = useFetchReviews();

  const renderItem = ({ item }: { item: any }) => (
    <ButtonView
      onPress={() => navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_DETAIL_SCREEN, { reviewData: item })}
      mb={15}
    >
      <ReviewCard
        item={item}
        onViewReview={() => navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_VIEW_SCREEN, { id: item.id })}
        onRateGuest={() => navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_GUEST_RATE_SCREEN, { name: item.guestName })}
        onTalkToGuest={() => console.log('Talk to Guest')}
        onRequestRating={() => console.log('Request Rating')}
      />
    </ButtonView>
  );

  return (
    <View style={styles.container}>
      <FlatListSimpleHandler
        data={reviews}
        isLoading={isLoading}
        renderItem={renderItem}
        onRefresh={refreshReviews}
        listEmptyText="No reviews found"
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
});

export default ReviewManagementScreen;