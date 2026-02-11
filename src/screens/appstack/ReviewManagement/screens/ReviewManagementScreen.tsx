import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@/theme/colors';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import ReviewCard from '../components/ReviewCard';
import useFetchReviews, { ReviewItem } from '../containers/useFetchReviews';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import ButtonView from '@/components/molecules/AppButton/ButtonView';

const ReviewManagementScreen = () => {
  const { allReviews, allReviewsLoading, refreshReviews } = useFetchReviews();

  const renderItem = ({ item }: { item: ReviewItem }) => (
    <ButtonView
      onPress={() => navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_DETAIL_SCREEN, { reviewData: item })}
      mb={15}
    >
      <ReviewCard
        item={item}
        onViewReview={() => navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_VIEW_SCREEN, { id: item.id })}
        onRateGuest={() => navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_GUEST_RATE_SCREEN, { name: 'Guest' })}
        onTalkToGuest={() => navigate(NavigationRoutes.APP_STACK.CHAT_DETAIL, { id:item.id })}
        onRequestRating={() => console.log('Request Rating')}
      />
    </ButtonView>
  );
  console.log("allReviews",allReviews)

  return (
    <View style={styles.container}>
      <FlatListSimpleHandler
        data={allReviews.reviews}
        isLoading={allReviewsLoading}
        renderItem={renderItem}
        onRefresh={refreshReviews}
        listEmptyText="No reviews found"
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  listContent: { padding: 20, paddingBottom: 40 },
});

export default ReviewManagementScreen;