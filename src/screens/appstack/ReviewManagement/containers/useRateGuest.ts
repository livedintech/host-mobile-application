import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';
import { rateYourGuest } from '@/services/ReviewsApi';
import { RateYourGuestPayload } from '@/types/api/reviewManagementTypes';
import { useMutation } from '@tanstack/react-query';

export const useRateGuest = () => {
  const mutation = useMutation({
    mutationFn: (payload: RateYourGuestPayload) => rateYourGuest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.RATE_YOUR_GUEST],
      });
    },
  });

  return {
    submitReply: mutation.mutate,
    isSubmitting: mutation.isPending,
  };
};