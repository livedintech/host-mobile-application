import STORAGE_CONST from '@/constants/storage';
import NavigationRoutes from '@/navigation/NavigationRoutes';
import { queryClient } from '@/services/api';
import { navigate } from '@/services/navigationService';
import {
  getTaskManagementCategory,
  getTaskManagementListing,
  getTaskManagementVendor,
  taskManagementCreateTaskDraft,
  getTaskChecklist,
} from '@/services/TaskManagementApi';
import { useTaskDraftStore } from '@/store/taskDraftStore';
import {
  taskManagementCreateApiPayload,
  taskManagementCreateApiResponse,
} from '@/types/api/taskManagentType';
import { convertTo24Hour } from '@/utility/helpers';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';

const CreateTaskContainer = () => {
  const { setDraft, isCleaningCategory } = useTaskDraftStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<taskManagementCreateApiPayload>({
    defaultValues: {
      title: '',
      description: '',
      task_type_id: '',
      listing_id: '',
      vendor_id: '',
      start_date: '',
      start_time: '',
      end_time: '',
    },
    mode: 'onBlur',
  });

  const [wordCount, setWordCount] = useState(0);

  const taskDescription = watch('description');
  const selectedCategory = watch('task_type_id');

  // 🔹 Sync category → store
  useEffect(() => {
    if (selectedCategory) {
      setDraft({ category: selectedCategory });
      console.log(typeof selectedCategory, 'tetetet');

      // auto-clear date/time when cleaning
      if (Number(selectedCategory) == 18) {
        setValue('start_date', '');
        setValue('start_time', '');
        setValue('end_time', '');
      }
    }
  }, [selectedCategory]);

  // 🔹 Word count
  useEffect(() => {
    const words = taskDescription
      ? taskDescription.trim().split(/\s+/).length
      : 0;
    setWordCount(words);
  }, [taskDescription]);

  //GET CATGEORY
  const { data: getTaskCategory = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_MANAGEMENT_CATEGORY],
    queryFn: getTaskManagementCategory,
  });

  const transformedCategory = getTaskCategory.map(
    (item: { value: string; id: string }) => ({
      label: item.value,
      value: item.id,
    }),
  );

  //GET LISTING
  const { data: getTaskListing = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_MANAGEMENT_LISTING],
    queryFn: getTaskManagementListing,
  });

  const transformedListing = getTaskListing.map(
    (item: { value: string; id: string }) => ({
      label: item.value,
      value: item.id,
    }),
  );
  console.log("transformedListing",transformedListing)

  //GET VENDOR
  const { data: getTaskVendor = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_MANAGEMENT_VENDOR],
    queryFn: getTaskManagementVendor,
  });

  const transformedVendor = getTaskVendor.map(
    (item: { name: string; business_name: string; id: string }) => ({
      label: item.name,
      value: item.id,
    }),
  );
  console.log("transformedVendor",transformedVendor)

  const createTaskDraftMutation = useMutation<
    taskManagementCreateApiResponse,
    Error,
    taskManagementCreateApiPayload
  >({
    mutationFn: taskManagementCreateTaskDraft,
    onSuccess: async (draftData, variables) => {
      // Toast.show({
      //   type: 'success',
      //   text1: draftData.message,
      // });

      console.log('draftDatadraftData', draftData);

      // Save draft in store
      setDraft({
        taskName: variables.title,
        taskDescription: variables.description,
        category: variables.task_type_id,
        listingSelection: variables.listing_id,
        assignTask: variables.vendor_id,
        selectDate: variables.start_date,
        selectStartTime: variables.start_time,
        selectEndTime: variables.end_time,
        taskType: draftData.data.task_type,
        taskId: Number(draftData.data.id),
      });

      // 🔹 Call getTaskChecklist after draft creation
      try {
        const checklistData = await getTaskChecklist(
          draftData.data.id,
          draftData.data.task_type,
        );
        console.log('Checklist Data:', checklistData);

        // setDraft(prev => ({
        //   ...prev,
        //   checklist: checklistData.data,
        // }));

        setDraft({
          checklistApiData: checklistData, // ⬅ RAW API
        });
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: error.message || 'Failed to fetch checklist',
        });
      }

      // Navigate to next screen
      navigate(NavigationRoutes.APP_STACK.CREATE_CHECKLIST);
    },
    onError: error => {
      Toast.show({
        type: 'error',
        text1: error.message || 'Something went wrong',
      });
    },
  });

const onSubmit = (data: taskManagementCreateApiPayload) => {
  const payload: taskManagementCreateApiPayload = {
    title: data.title,
    description: data.description,
    task_type_id: data.task_type_id,
    listing_id: data.listing_id,
    vendor_id: data.vendor_id,
  };

  if (!isCleaningCategory) {
    if (data.start_date) {
      // Create a date object safely
      const dateObj = new Date(data.start_date);

      // Check if the date is actually valid before formatting
      if (!isNaN(dateObj.getTime())) {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        payload.start_date = `${year}-${month}-${day}`;
      } else {
        // Fallback: If it's a string like "02/13/26", manual split
        const parts = data.start_date.split('/');
        if (parts.length === 3) {
          const m = parts[0].padStart(2, '0');
          const d = parts[1].padStart(2, '0');
          const y = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
          payload.start_date = `${y}-${m}-${d}`;
        }
      }
    }

    payload.start_time = convertTo24Hour(data.start_time);
    payload.end_time = convertTo24Hour(data.end_time);
  }

  createTaskDraftMutation.mutate(payload);
};

  return {
    control,
    errors,
    onSubmitForm: handleSubmit(onSubmit),
    categoryOptions: transformedCategory,
    listingOptions: transformedListing,
    userOptions: transformedVendor,
    isCleaningCategory,
    wordCount,
    isPending: createTaskDraftMutation.isPending,
  };
};

export default CreateTaskContainer;
