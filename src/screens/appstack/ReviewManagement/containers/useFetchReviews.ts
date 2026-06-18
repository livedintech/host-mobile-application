import STORAGE_CONST from '@/constants/storage';
import { getAllReviews,getReviewByID,hostReviewReply } from '@/services/ReviewsApi';
import { useQuery } from '@tanstack/react-query';

export interface ReviewItem {
  id: number;
  listing_name: string;
  arrival_date: string;
  departure_date: string;
  overall_score: number;
  booking_platform: string;
  adult: number;
  // UI helper fields (if your API doesn't provide these, we default them)
  guest_name?: string | null;
  platform?: string;
  booking_id?: string;
  thread_id ? : string;
  host_review?: {
    total_rating: number;
  } | null;
}

const useFetchReviews = () => {
  const { 
    data: allReviews = [], 
    isLoading: allReviewsLoading, 
    refetch: refreshReviews 
  } = useQuery({
    queryKey: [STORAGE_CONST.GET_REVIEWS_ALL],
    queryFn: getAllReviews,
  });

  return { 
    allReviews, 
    allReviewsLoading, 
    refreshReviews 
  };
};

export default useFetchReviews;