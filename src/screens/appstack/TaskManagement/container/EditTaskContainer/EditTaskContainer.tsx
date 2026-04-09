import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query'; // Import useQueryClient
import { deleteTaskManagement, getTaskManagementVendor, vendorUpdate } from '@/services/TaskManagementApi';
import { goBack, navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import STORAGE_CONST from '@/constants/storage'; // Import your constants
import { Alert } from 'react-native';

const EditTaskContainer = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const onDeleteTask = async (taskId: number | string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteTaskManagement(taskId);

              // 1. Invalidate all task-related queries 
              // This clears the cache for the tabs AND the 'account-total-check'
              await queryClient.invalidateQueries({
                queryKey: [STORAGE_CONST.GET_HOST_TASK_LIST],
              });

              // 2. Navigate back
              // navigate(NavigationRoutes.APP_STACK.TASK);
              goBack();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete task');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  };


  const onUpdateAssignee = async (taskId: number | string, vendorId: string) => {
    try {
      setIsSaving(true);
      await vendorUpdate({
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

      Alert.alert('Success', 'Assignee updated successfully');
      goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update vendor');
    } finally {
      setIsSaving(false);
    }
  };


    // 3. Fetch Vendor Options for Filter
  const { data: rawVendors = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_MANAGEMENT_VENDOR],
    queryFn: getTaskManagementVendor,
  });



  const assigneeOptions = useMemo(() => 
    rawVendors?.map((item: any) => ({
      label: item.name,
      value: item.id.toString(),
    })) || [], [rawVendors]);

  return {
    onDeleteTask,
    onUpdateAssignee,
    isDeleting,
    assigneeOptions
  };
};

export default EditTaskContainer;