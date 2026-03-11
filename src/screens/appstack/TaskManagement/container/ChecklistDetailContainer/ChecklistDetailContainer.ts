import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getTaskChecklistDetail, 
  taskManagementInsertChecklist, 
  updateSingleChecklistItem,
  filterChecklistItem
} from '@/services/TaskManagementApi';
import { useTaskStore } from '@/store/taskStore';
import Toast from 'react-native-toast-message';
import STORAGE_CONST from '@/constants/storage';

const useChecklistDetailContainer = (sectionId: number) => {
  const queryClient = useQueryClient();
  const { taskId, taskType } = useTaskStore();
  const [localItems, setLocalItems] = useState<any[]>([]);

  // 1. Fetch Checklist Items
  const { isLoading, refetch, data: remoteData } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_CHECKLIST_DETAIL, sectionId, taskId],
    queryFn: () => getTaskChecklistDetail(sectionId, taskType!, taskId!),
    enabled: !!sectionId && !!taskId,
    staleTime: 0,
  });

  // 2. Initialize items (All checked by default)
  useEffect(() => {
    if (remoteData?.data) {
      const initialized = remoteData.data.map((item: any) => ({ 
        ...item, 
        isChecked: true 
      }));
      setLocalItems(initialized);
    }
  }, [remoteData]);

  // 3. Mutation: Add New Item
  const insertItemMutation = useMutation({
    mutationFn: (itemName: string) =>
      taskManagementInsertChecklist({
        task_id: taskId!,
        task_checklist_detail_id: sectionId,
        checklist_names: [itemName],
      }),
    onSuccess: async () => {
      Toast.show({ type: 'success', text1: 'Item added successfully' });
      await queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_TASK_CHECKLIST_DETAIL, sectionId] });
      refetch();
    },
  });

  // 4. Mutation: Update Existing Item Name
  const updateItemMutation = useMutation({
    mutationFn: (payload: { id: number; checklist_name: string }) =>
      updateSingleChecklistItem(payload),
    onSuccess: async () => {
      Toast.show({ type: 'success', text1: 'Item updated successfully' });
      await queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_TASK_CHECKLIST_DETAIL, sectionId] });
      refetch();
    },
  });

  // 5. Mutation: Filter (Save Checked Items)
  const filterMutation = useMutation({
    mutationFn: (selectedIds: number[]) => 
      filterChecklistItem({
        task_id: taskId!,
        ids: selectedIds,
      }),
    onError: (err: any) => {
      Toast.show({ type: 'error', text1: err.message || 'Failed to save selection' });
    }
  });

  const toggleItem = (id: number) => {
    setLocalItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isChecked: !item.isChecked } : item))
    );
  };

  const saveAndContinue = async () => {
    const selectedIds = localItems
      .filter((item) => item.isChecked)
      .map((item) => item.id);
    
    // Returns a promise so the UI can wait for success before navigating
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