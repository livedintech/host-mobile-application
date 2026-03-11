import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskManagementAddChecklist, getTaskChecklist, taskCreateStatusUpdate } from '@/services/TaskManagementApi';
import { useTaskStore } from '@/store/taskStore';
import Toast from 'react-native-toast-message';
import STORAGE_CONST from '@/constants/storage';

const useViewChecklistAllContainer = () => {
  const queryClient = useQueryClient();
  const { taskId, taskType, setChecklistData, checklistData } = useTaskStore();

  const { isLoading: isFetching, refetch, data: remoteData } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_CHECKLIST, taskId],
    queryFn: () => getTaskChecklist(taskId!, taskType!),
    enabled: !!taskId,
    staleTime: 0, 
  });

  useEffect(() => {
    if (remoteData?.data?.tasks) {
      setChecklistData(remoteData.data.tasks);
    }
  }, [remoteData, setChecklistData]);

  useEffect(() => {
    return () => {
      setChecklistData([]); 
    };
  }, [taskId, setChecklistData]);

  const addSectionMutation = useMutation({
    mutationFn: (sectionName: string) =>
      taskManagementAddChecklist({
        task_id: taskId!,
        section_name: sectionName,
        checklist_names: ["livedin_section"], 
      }),
    onSuccess: async () => {
      Toast.show({ type: 'success', text1: 'Section added successfully' });
      await queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_TASK_CHECKLIST, taskId] });
      refetch();
    },
    onError: (error: any) => {
      Toast.show({ type: 'error', text1: error?.message || 'Failed to add section' });
    },
  });

  return {
    checklistData: checklistData || [],
    isLoading: isFetching || addSectionMutation.isPending,
    onRefresh: refetch,
    addSection: (name: string) => addSectionMutation.mutate(name),
  };
};

export default useViewChecklistAllContainer;