import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Colors } from '@/theme/colors';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import ReviewCard from '../components/ReviewCard'; // Adjust path
import useFetchReviews, { ReviewItem } from '../containers/useFetchReviews';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import AppText from '@/components/molecules/AppText/AppText';
import AppButton from '@/components/molecules/AppButton/AppButton';
import BGImage from '@/components/molecules/BGImage/BGImage';

const ReviewManagementScreen = () => {
  const { allReviews, allReviewsLoading, refreshReviews } = useFetchReviews();

const renderItem = ({ item }: { item: ReviewItem }) => (
  <ReviewCard
    item={item}
    hostRating={item.overall_score === 5 ? 5.0 : null} 
   onPress={() => 
      navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_DETAIL_SCREEN, { 
        booking_id: item.booking_id, 
        id: item.id 
      })
    }
    onViewReview={() =>
      navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_VIEW_SCREEN, { id: item.id })
    }
    onTalkToGuest={() =>
      navigate(NavigationRoutes.APP_STACK.CHAT_DETAIL, { conversation_id: item.thread_id })
    }
    onRateGuest={() =>
      navigate(NavigationRoutes.APP_STACK.REVIEW_MANAGEMENT_GUEST_RATE_SCREEN, { id: item.id })
    }
    onRequestRating={() => console.log('Requesting Rating...')}
  />
);

  return (
     <BGImage source={require('@/assets/img/background/linearBG.png')}>
      <View style={styles.container}>
        <View style={styles.header}>
  
          <AppText text="Review" fontSize={32} type="Bold" color={Colors.BLACK} mt={0} />
          <AppText text="Managment" fontSize={32} type="Bold" color={Colors.BLACK} />
        </View>

        <FlatListSimpleHandler
          data={allReviews?.reviews || []}
          isLoading={allReviewsLoading}
          renderItem={renderItem}
          onRefresh={refreshReviews}
          listEmptyText="No reviews found"
          contentContainerStyle={styles.listContent}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});

export default ReviewManagementScreen;