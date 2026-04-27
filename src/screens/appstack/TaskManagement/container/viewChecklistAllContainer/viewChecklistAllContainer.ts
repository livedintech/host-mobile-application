import { useEffect } from 'react';
import i18n from '@/locales/i18n/i18n';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskManagementAddChecklist, getTaskChecklist } from '@/services/TaskManagementApi';
import { useTaskStore } from '@/store/taskStore';
import Toast from 'react-native-toast-message';
import STORAGE_CONST from '@/constants/storage';

interface ContainerProps {
  taskId?: number; // From Navigation Props (Edit Screen)
  taskType?: string;
}

const useViewChecklistAllContainer = ({ taskId: propTaskId, taskType }: ContainerProps) => {
  const queryClient = useQueryClient();
  
  // Rename the store taskId to avoid conflict with the propTaskId
  const { setChecklistData, checklistData, taskId: storeTaskId } = useTaskStore();

  /**
   * Scenario Handler:
   * Priority 1: propTaskId (Passed from Edit Screen)
   * Priority 2: storeTaskId (From Zustand after Creation)
   */
  const effectiveTaskId = propTaskId || storeTaskId;

  console.log("Using Task ID:", effectiveTaskId, propTaskId ? "(from props)" : "(from store)");

  const { isLoading: isFetching, refetch, data: remoteData } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_CHECKLIST, effectiveTaskId],
    queryFn: () => getTaskChecklist(effectiveTaskId!, taskType || 'cleaning'),
    enabled: !!effectiveTaskId, // Query only runs if we have an ID from either source
    staleTime: 0, 
    refetchOnWindowFocus: true,
  });

  // Sync remote data to store whenever it changes
  useEffect(() => {
    if (remoteData?.data?.tasks) {
      setChecklistData(remoteData.data.tasks);
    }
  }, [remoteData, setChecklistData]);

  // Cleanup store when leaving
  useEffect(() => {
    return () => {
      setChecklistData([]); 
    };
  }, [setChecklistData]);

  const addSectionMutation = useMutation({
    mutationFn: (sectionName: string) =>
      taskManagementAddChecklist({
        task_id: effectiveTaskId!,
        section_name: sectionName,
        checklist_names: ["livedin_section"], 
      }),
    onSuccess: async () => {
      Toast.show({ type: 'success', text1: i18n.t('app.task_management.section_added') });
      await queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_TASK_CHECKLIST, effectiveTaskId] });
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