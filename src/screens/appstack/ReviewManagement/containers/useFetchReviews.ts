// import STORAGE_CONST from '@/constants/storage';
// import { getAllReviews } from '@/services/ReviewsApi';
// import { useQuery } from '@tanstack/react-query';
// import { useState, useEffect, useCallback } from 'react';

// export interface ReviewItem {
//   id: string;
//   guestName: string;
//   platform: 'Airbnb' | 'Gathern' | 'Booking.com';
//   property: string;
//   date: string;
//   guestRating?: number;
//   myRating?: number;
//   hasGuestReviewed: boolean;
// }

// const useFetchReviews = () => {
//   const [reviews, setReviews] = useState<ReviewItem[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchReviews = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       // FIX: Explicitly call resolve() without arguments to satisfy TS
//       await new Promise<void>((resolve) => {
//         setTimeout(() => resolve(), 1500);
//       });

//       const mockData: ReviewItem[] = [
//         {
//           id: '1',
//           guestName: 'Ali Masood Ahmed',
//           platform: 'Airbnb',
//           property: 'Alpha House, Riyadh Street 4',
//           date: '21-25 January 2026',
//           guestRating: 4,
//           myRating: 4,
//           hasGuestReviewed: true,
//         },
//         {
//           id: '2',
//           guestName: 'Al Hammd Ali',
//           platform: 'Gathern',
//           property: 'Apartment Al jadda House, Riyadh Street 4',
//           date: '21 January 2026',
//           myRating: 4,
//           hasGuestReviewed: false,
//         },
//         {
//           id: '3',
//           guestName: 'Sufyan Bin Ahmed',
//           platform: 'Booking.com',
//           property: 'Apartment Al Fateh Apartment, Riyadh Street 10',
//           date: '21 January 2026',
//           hasGuestReviewed: false,
//         },
//       ];

//       setReviews(mockData);
//     } catch (err) {
//       setError('Failed to fetch reviews.');
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchReviews();
//   }, [fetchReviews]);

//   const refreshReviews = async () => {
//     await fetchReviews();
//   };


//     const { data: allReviews = [], isLoading: allReviewsLoading } = useQuery({
//     queryKey: [STORAGE_CONST.GET_REVIEWS_ALL],
//     queryFn: getAllReviews,
//   });
//   // console.log("allReviews",allReviews)

//   return { allReviews,allReviewsLoading, reviews, isLoading, error, refreshReviews };
// };

// export default useFetchReviews;


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
  thread_id ? : string
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