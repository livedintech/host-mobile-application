import { useMutation } from '@tanstack/react-query';
import { taskCreateStatusUpdate } from '@/services/TaskManagementApi';
import { useTaskStore } from '@/store/taskStore';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import Toast from 'react-native-toast-message';
import { queryClient } from '@/services/api';
import STORAGE_CONST from '@/constants/storage';

const useStaffNotesContainer = () => {
  const { taskId, resetTaskStore } = useTaskStore();

  const updateStatusMutation = useMutation({
    mutationFn: (description: string) =>
      taskCreateStatusUpdate({
        task_id: taskId!,
        is_draft: 0,
        description: description,
      }),
    onSuccess: (data:any) => {
      // Navigate to the next screen (e.g., Task Success or Task List)
      resetTaskStore();
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.GET_HOST_TASK_LIST],
      });

      // navigate(NavigationRoutes.APP_STACK.TASK);
      navigate(NavigationRoutes.APP_STACK.ROOT_STACK, {
        screen: NavigationRoutes.APP_STACK.TASK,
      });
      Toast.show({
        type: 'success',
        text1: data?.message ,
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error?.message || 'Failed to update task status',
      });
    },
  });

  const onSubmitNotes = (data: { specialInstructions: string }) => {
    updateStatusMutation.mutate(data.specialInstructions);
  };

  return {
    onSubmitNotes,
    isLoading: updateStatusMutation.isPending,
  };
};

export default useStaffNotesContainer;
