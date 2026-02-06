import { getHostTaskList } from '@/services/TaskManagementApi';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useGetHostTaskList = () => {
  return useInfiniteQuery({
    queryKey: ['GET_HOST_TASK_LIST'],

    queryFn: ({ pageParam = 1 }) =>
      getHostTaskList({
        page: pageParam,
        per_page: 24,
      }),

    getNextPageParam: lastPage => {
      const current = lastPage?.meta?.current_page;
      const last = lastPage?.meta?.last_page;

      if (current < last) return current + 1;
      return undefined;
    },
  });
};
