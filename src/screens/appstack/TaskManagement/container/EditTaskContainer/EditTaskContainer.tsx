import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteTaskManagement,
  getTaskManagementVendor,
  vendorUpdate,
} from '@/services/TaskManagementApi';
import { goBack } from '@/services/navigationService';
import STORAGE_CONST from '@/constants/storage';
import Toast from 'react-native-toast-message';

const EditTaskContainer = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const onDeleteTask = async (taskId: number | string) => {
    try {
      setIsDeleting(true);
      const result = await deleteTaskManagement(taskId);
      await queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_HOST_TASK_LIST] });
      Toast.show({ type: 'success', text1: result?.message || 'Task deleted successfully' });
      goBack();
    } catch (error: any) {
      Toast.show({ type: 'error', text1: error.message || 'Failed to delete task' });
    } finally {
      setIsDeleting(false);
    }
  };

  const onUpdateAssignee = async (
    taskId: number | string,
    updateData: {
      vendor_id: number;
      description: string;
      start_date: string;
      start_time: string;
      end_time: string;
    },
  ) => {
    try {
      setIsSaving(true);
      const result = await vendorUpdate({ taskId, ...updateData });

      await queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_TASK_DETAIL, taskId] });
      await queryClient.invalidateQueries({ queryKey: [STORAGE_CONST.GET_HOST_TASK_LIST] });

      Toast.show({ type: 'success', text1: result?.message || 'Task updated successfully' });
      goBack();
    } catch (error: any) {
      Toast.show({ type: 'error', text1: error.message || 'Failed to update task' });
    } finally {
      setIsSaving(false);
    }
  };

  const { data: rawVendors = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_MANAGEMENT_VENDOR],
    queryFn: getTaskManagementVendor,
  });

  const assigneeOptions = useMemo(
    () => rawVendors?.map((item: any) => ({ label: item.name, value: item.id.toString() })) || [],
    [rawVendors],
  );

  return { onDeleteTask, onUpdateAssignee, isDeleting, isSaving, assigneeOptions };
};

export default EditTaskContainer;