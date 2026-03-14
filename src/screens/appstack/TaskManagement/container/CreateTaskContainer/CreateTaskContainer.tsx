import { useMutation, useQuery } from '@tanstack/react-query';
import STORAGE_CONST from '@/constants/storage';
import {
  getTaskChecklist,
  getTaskManagementCategory,
  getTaskManagementListing,
  getTaskManagementVendor,
  taskManagementCreateTask,
} from '@/services/TaskManagementApi';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import Toast from 'react-native-toast-message';
import { useTaskStore } from '@/store/taskStore';
import { convertTo24Hour } from '@/utility/helpers';

const CreateTaskContainer = () => {
  const { setTaskInfo, setChecklistData } = useTaskStore();

  // Fetch Dropdown Data
  const { data: getTaskListing = [], isLoading: isLoadingListing } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_MANAGEMENT_LISTING],
    queryFn: getTaskManagementListing,
  });

  const { data: getTaskVendor = [], isLoading: isLoadingVendor } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_MANAGEMENT_VENDOR],
    queryFn: getTaskManagementVendor,
  });

  const { data: getTaskCategory = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_MANAGEMENT_CATEGORY],
    queryFn: getTaskManagementCategory,
  });

  // API 1: Create Task Mutation
  const createTaskMutation = useMutation({
    mutationFn: taskManagementCreateTask,
    onSuccess: async res => {
      const { id, task_type } = res.data;
      setTaskInfo(id, task_type);

      try {
        const checklistRes = await getTaskChecklist(id, task_type);
        setChecklistData(checklistRes.data.tasks);
        navigate(NavigationRoutes.APP_STACK.VIEW_CHECKLIST_ALL);
      } catch (error) {
        Toast.show({ type: 'error', text1: 'Failed to fetch checklist' });
      }
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error.message || 'Task creation failed',
      });
    },
  });

  const onNextStep = (formData: any) => {
    // Construct payload
    // task_type_id: '18' for Non-Cleaning (Plumbing/Maintenance etc)
    const payload: any = {
      listing_id: formData.listing,
      vendor_id: formData.assignUser,
      task_type_id: formData.category || '18',
    };

    // Add extra fields if they exist (Non-Cleaning Flow)
    if (formData.date) payload.start_date = formData.date;
    if (formData.startTime) {
      payload.start_time = convertTo24Hour(formData.startTime);
    }
    if (formData.endTime) {
      payload.end_time = convertTo24Hour(formData.endTime);
    }

    createTaskMutation.mutate(payload);
  };

  return {
    transformedListing:
      getTaskListing?.map((item: any) => ({
        label: item.value,
        value: item.id.toString(),
      })) || [],
    transformedVendor:
      getTaskVendor?.map((item: any) => ({
        label: item.name,
        value: item.id.toString(),
      })) || [],
    transformedCategory:
      getTaskCategory?.map((item: any) => ({
        label: item.value,
        value: item.id.toString(),
      })) || [],
    isLoading:
      isLoadingListing || isLoadingVendor || createTaskMutation.isPending,
    onNextStep,
  };
};

export default CreateTaskContainer;
