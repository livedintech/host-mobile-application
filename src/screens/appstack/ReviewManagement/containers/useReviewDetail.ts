import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReviewByID, hostReviewReply } from '@/services/ReviewsApi';
import STORAGE_CONST from '@/constants/storage';

const useReviewDetail = (id: string | number) => {
  const queryClient = useQueryClient();

  // Fetch Detail Data
  const { data: reviewDetail, isLoading, error } = useQuery({
    queryKey: [STORAGE_CONST.GET_REVIEWS_ALL, id],
    queryFn: () => getReviewByID(id),
    enabled: !!id,
  });

  // Reply Mutation
  const replyMutation = useMutation({
    mutationFn: hostReviewReply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_REVIEWS_ALL] });
    },
  });

  // Calculate rating (e.g., 3/2 = 1.5 or 10/2 = 5)
  const starRating = reviewDetail ? reviewDetail.overall_score / 2 : 0;

  return {
    reviewDetail,
    isLoading,
    error,
    starRating,
    submitReply: replyMutation.mutate,
    isSubmitting: replyMutation.isPending,
  };
};

export default useReviewDetail;