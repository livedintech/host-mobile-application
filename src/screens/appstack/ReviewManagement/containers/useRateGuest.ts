import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';
import { getAllReviews, rateYourGuest } from '@/services/ReviewsApi';
import { RateYourGuestPayload } from '@/types/api/reviewManagementTypes';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useRateGuest = () => {
  const mutation = useMutation({
    mutationFn: (payload: RateYourGuestPayload) => rateYourGuest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.RATE_YOUR_GUEST],
      });
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.GET_REVIEWS_ALL],
      });
    },
  });

  return {
    submitReply: mutation.mutate,
    isSubmitting: mutation.isPending,
  };
};