import i18n from '@/locales/i18n/i18n';
import { useMutation, useQuery } from '@tanstack/react-query';
import STORAGE_CONST from '@/constants/storage';
import {
  getTaskChecklist,
  getTaskManagementCategory,
  getTaskManagementListing,
  getTaskManagementVendor,
  taskManagementCreateTask,
  getTaskManagementListingCleaning
} from '@/services/TaskManagementApi';
import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import Toast from 'react-native-toast-message';
import { useTaskStore } from '@/store/taskStore';
import { convertTo24Hour } from '@/utility/helpers';

const CreateTaskContainer = () => {
  // Use the new setCreatedTask action
  const { taskId, setCreatedTask, setTaskInfo } = useTaskStore();

  const { data: getTaskListing = [], isLoading: isLoadingListing, isFetching: isFetchingListing, refetch: refetchListing } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_MANAGEMENT_LISTING],
    queryFn: getTaskManagementListing,
  });
  const { data: getTaskListingCleaning = [], isLoading: isLoadingListingCleaning, isFetching: isFetchingListingCleaning, refetch: refetchListingCleaning } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_MANAGEMENT_LISTING_CLEANING],
    queryFn: getTaskManagementListingCleaning,
  });

  const { data: getTaskVendor = [], isLoading: isLoadingVendor, isFetching: isFetchingVendor, refetch: refetchVendor } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_MANAGEMENT_VENDOR],
    queryFn: getTaskManagementVendor,
  });

  const { data: getTaskCategory = [], refetch: refetchCategory } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_MANAGEMENT_CATEGORY],
    queryFn: getTaskManagementCategory,
  });

  const createTaskMutation = useMutation({
    mutationFn: taskManagementCreateTask,
    onSuccess: async res => {

      const { id, task_type, status, description } = res.data;

      // 1. Save the primary Task Info (ID, Type, Status, Description) to the store
      setTaskInfo(id, task_type, status , description );

      try {
        const checklistRes = await getTaskChecklist(id, task_type);
        // Save everything to store in one go
        setCreatedTask(id, task_type, checklistRes.data.tasks);
        navigate(NavigationRoutes.APP_STACK.VIEW_CHECKLIST_ALL);
      } catch (error) {
        Toast.show({ type: 'error', text1: i18n.t('app.task_management.checklist_fetch_failed') });
      }
    },
    onError: (error: any) => {
      Toast.show({ type: 'error', text1: error.message || 'Task creation failed' });
    },
  });

  const onRefresh = () => {
    refetchListing();
    refetchVendor();
  };

  const onNextStep = (formData: any) => {
    // If taskId exists, it means we already created it and came back.
    // Jump straight to the checklist without re-calling APIs.
    if (taskId) {
      navigate(NavigationRoutes.APP_STACK.VIEW_CHECKLIST_ALL);
      return;
    }

    const payload: any = {
      listing_id: formData.listing,
      vendor_id: formData.assignUser,
      task_type_id: formData.category || '18',
    };
    if (formData.date) payload.start_date = formData.date;
    if (formData.startTime) payload.start_time = convertTo24Hour(formData.startTime);
    if (formData.endTime) payload.end_time = convertTo24Hour(formData.endTime);

    createTaskMutation.mutate(payload);
  };

  return {
    transformedListing: getTaskListing?.map((item: any) => ({ label: item.value, value: item.id.toString() })) || [],
    transformedListingCleaning: getTaskListingCleaning?.map((item: any) => ({ label: item.value, value: item.id.toString() })) || [],
    transformedVendor: getTaskVendor?.map((item: any) => ({ label: item.name, value: item.id.toString() })) || [],
    transformedCategory: getTaskCategory?.map((item: any) => ({ label: item.value, value: item.id.toString() })) || [],
    isLoading: isLoadingListing || isLoadingVendor || createTaskMutation.isPending,
    isLoadingCleaning: isLoadingListingCleaning || isLoadingVendor || createTaskMutation.isPending,
    isRefreshing: isFetchingListing || isFetchingVendor,
    isRefreshingCleaning: isFetchingListingCleaning || isFetchingVendor,
    onRefresh,
    onNextStep,
  };
};

export default CreateTaskContainer;