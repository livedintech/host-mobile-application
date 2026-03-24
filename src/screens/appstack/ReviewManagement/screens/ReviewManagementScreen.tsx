import React from 'react';
import { StyleSheet, View, Platform, ActivityIndicator } from 'react-native';
import { vs, s, ms } from 'react-native-size-matters';

import { Colors } from '@/theme/colors';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import ReviewCard from '../components/ReviewCard';
import useFetchReviews, { ReviewItem } from '../containers/useFetchReviews';
import FlatListSimpleHandler from '@/components/molecules/FlatListSimpleHandler/FlatListSimpleHandler';
import AppText from '@/components/molecules/AppText/AppText';
import BGImage from '@/components/molecules/BGImage/BGImage';
import NoReviewScreen from './NoReviewScreen';

const ReviewManagementScreen = () => {
  const { allReviews, allReviewsLoading, refreshReviews } = useFetchReviews();

  const reviewsData = allReviews?.reviews || [];

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
        
        {!allReviewsLoading && reviewsData.length > 0 && (
          <View style={styles.header}>
            <AppText text="Review" fontSize={32} type="Bold" color={Colors.BLACK} />
            <AppText text="Management" fontSize={32} type="Bold" color={Colors.BLACK} />
          </View>
        )}

        {allReviewsLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={Colors.PRIMARY_TEAL} />
          </View>
        ) : reviewsData.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <NoReviewScreen 
              onManageListing={() => navigate(NavigationRoutes.APP_STACK.MANAGE_BOOKING)} 
            />
          </View>
        ) : (
          <FlatListSimpleHandler
            data={reviewsData}
            isLoading={allReviewsLoading}
            renderItem={renderItem}
            onRefresh={refreshReviews}
            contentContainerStyle={styles.listContent}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>
    </BGImage>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? vs(60) : vs(30),
    paddingHorizontal: s(20),
    marginBottom: vs(20),
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyWrapper: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? vs(50) : vs(20),
  },
  listContent: {
    paddingHorizontal: s(20),
    paddingBottom: vs(40),
  },
});

export default ReviewManagementScreen;