import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query'; // Import useQueryClient
import {
  deleteTaskManagement,
  getTaskManagementVendor,
  vendorUpdate,
} from '@/services/TaskManagementApi';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import STORAGE_CONST from '@/constants/storage'; // Import your constants
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';

const EditTaskContainer = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const onDeleteTask = async (taskId: number | string) => {
    try {
      setIsDeleting(true);

      // 1. Execute deletion directly without confirmation
      const result = await deleteTaskManagement(taskId);

      // 2. Invalidate task-related queries
      await queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.GET_HOST_TASK_LIST],
      });

      // 3. Show success toast (optional but recommended for UX)
      Toast.show({
        type: 'success',
        text1: result?.message || 'Task deleted successfully',
      });

      // 4. Navigate back
      goBack();
    } catch (error: any) {
      // 5. Use Toast for errors instead of Alert
      Toast.show({
        type: 'error',
        text1: error.message || 'Failed to delete task',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const onUpdateAssignee = async (
    taskId: number | string,
    vendorId: string,
  ) => {
    try {
      setIsSaving(true);
      const result = await vendorUpdate({
        taskId,
        vendor_id: Number(vendorId),
      });

      // Refresh the specific task detail in the cache
      await queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.GET_TASK_DETAIL, taskId],
      });
      await queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.GET_HOST_TASK_LIST],
      });

      // Alert.alert('Success', 'Assignee updated successfully');
      Toast.show({
        type: 'success',
        text1: result?.message || 'Assignee updated successfully',
      });
      goBack();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message || 'Failed to update vendor',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Fetch Vendor Options for Filter
  const { data: rawVendors = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_MANAGEMENT_VENDOR],
    queryFn: getTaskManagementVendor,
  });

  const assigneeOptions = useMemo(
    () =>
      rawVendors?.map((item: any) => ({
        label: item.name,
        value: item.id.toString(),
      })) || [],
    [rawVendors],
  );

  return {
    onDeleteTask,
    onUpdateAssignee,
    isDeleting,
    assigneeOptions,
  };
};

export default EditTaskContainer;
