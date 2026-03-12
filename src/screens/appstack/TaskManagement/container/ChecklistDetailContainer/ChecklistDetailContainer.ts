import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getTaskChecklistDetail,
  taskManagementInsertChecklist,
  updateSingleChecklistItem,
  filterChecklistItem,
} from '@/services/TaskManagementApi';
import { useTaskStore } from '@/store/taskStore';
import Toast from 'react-native-toast-message';
import STORAGE_CONST from '@/constants/storage';
import { goBack } from '@/services/navigationService';

const useChecklistDetailContainer = (sectionId: number, propTaskId?: number) => {
  const queryClient = useQueryClient();
  const { taskId: storeTaskId, taskType: storeTaskType } = useTaskStore();

  const effectiveTaskId = propTaskId || storeTaskId;
  const effectiveTaskType = storeTaskType || 'maintenance';

  const [localItems, setLocalItems] = useState<any[]>([]);

  // 1. Fetch Checklist Items
  const { isLoading, refetch, data: remoteData } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_CHECKLIST_DETAIL, sectionId, effectiveTaskId],
    queryFn: () => getTaskChecklistDetail(sectionId, effectiveTaskType, effectiveTaskId!),
    enabled: !!sectionId && !!effectiveTaskId,
    staleTime: 0,
  });



    useEffect(() => {
    if (remoteData?.data) {
      const initialized = remoteData.data.map((item: any) => ({ 
        ...item, 
        isChecked: true 
      }));
      setLocalItems(initialized);
    }
  }, [remoteData]);

  // 3. Mutation: Add Item
  const insertItemMutation = useMutation({
    mutationFn: (name: string) =>
      taskManagementInsertChecklist({
        task_id: effectiveTaskId!,
        checklist_name: name,
        section_id: sectionId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_TASK_CHECKLIST_DETAIL] });
      Toast.show({ type: 'success', text1: 'Item added successfully' });
    },
  });

  // 4. Mutation: Update Item Name
  const updateItemMutation = useMutation({
    mutationFn: (payload: { id: number; checklist_name: string }) =>
      updateSingleChecklistItem(payload.id, payload.checklist_name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_TASK_CHECKLIST_DETAIL] });
      Toast.show({ type: 'success', text1: 'Item updated successfully' });
    },
  });

  // 5. Mutation: Save Selection
  const filterMutation = useMutation({
    mutationFn: (selectedIds: number[]) =>
      filterChecklistItem({
        task_id: effectiveTaskId!,
        section_id: sectionId,
        ids: selectedIds, // Ensure this matches your API param (ids or checklist_ids)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_TASK_CHECKLIST_DETAIL] });
      Toast.show({ type: 'success', text1: 'Checklist saved' });
      goBack();
    },
    onError: (error) => {
      console.error("Filter Mutation Error:", error);
      Toast.show({ type: 'error', text1: 'Failed to save checklist' });
    }
  });

  const toggleItem = (id: number) => {
    setLocalItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item,
      ),
    );
  };

  const saveAndContinue = async () => {
    const selectedIds = localItems
      .filter(item => item.isChecked)
      .map(item => item.id);

    return filterMutation.mutateAsync(selectedIds);
  };

  return {
    localItems,
    isLoading: isLoading || insertItemMutation.isPending || updateItemMutation.isPending || filterMutation.isPending,
    toggleItem,
    addItem: (name: string) => insertItemMutation.mutate(name),
    updateItem: (id: number, name: string) => updateItemMutation.mutate({ id, checklist_name: name }),
    saveAndContinue,
    onRefresh: refetch,
  };
};

export default useChecklistDetailContainer;