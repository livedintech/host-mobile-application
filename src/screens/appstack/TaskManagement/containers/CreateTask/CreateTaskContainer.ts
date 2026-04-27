import i18n from '@/locales/i18n/i18n';
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

const CreateTaskContainer = (preSelectedListingId?: string | number, routeParams?: any) => {
  const { setDraft, isCleaningCategory } = useTaskDraftStore();

  console.log('routeParams::',routeParams?.copyText);
  

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<taskManagementCreateApiPayload>({
    defaultValues: {
      title: '',
      description: routeParams?.copyText,
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

  // --- API DATA FETCHING ---
  const { data: getTaskCategory = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_MANAGEMENT_CATEGORY],
    queryFn: getTaskManagementCategory,
  });

  const transformedCategory = getTaskCategory.map((item: any) => ({
    label: item.value,
    value: item.id.toString(),
  }));

  const { data: getTaskListing = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_MANAGEMENT_LISTING],
    queryFn: getTaskManagementListing,
  });

  const transformedListing = getTaskListing.map((item: any) => ({
    label: item.value,
    value: item.id.toString(),
  }));

  const { data: getTaskVendor = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_MANAGEMENT_VENDOR],
    queryFn: getTaskManagementVendor,
  });

  const transformedVendor = getTaskVendor.map((item: any) => ({
    label: item.name,
    value: item.id.toString(),
  }));

  // --- AUTO-FILL LOGIC ---

  useEffect(() => {
    // We only run this if we have an ID and the listing data has finally loaded
    if (preSelectedListingId && transformedListing.length > 0) {
      const targetId = preSelectedListingId.toString();

      // Verify the ID actually exists in the fetched list
      const itemExists = transformedListing.some(
        (listing: any) => listing.value === targetId,
      );

      if (itemExists) {
        console.log('SUCCESS: Auto-filling Listing ID:', targetId);
        setValue('listing_id', targetId);
      } else {
        console.log('ERROR: Listing ID not found in the list:', targetId);
      }
    }
  }, [preSelectedListingId, transformedListing, setValue]); // Runs when transformedListing updates

  // --- OTHER SYNC LOGIC ---

  useEffect(() => {
    if (selectedCategory) {
      setDraft({ category: selectedCategory });
      if (Number(selectedCategory) === 18) {
        setValue('start_date', '');
        setValue('start_time', '');
        setValue('end_time', '');
      }
    }
  }, [selectedCategory, setValue, setDraft]);

  useEffect(() => {
    const words = taskDescription
      ? taskDescription.trim().split(/\s+/).length
      : 0;
    setWordCount(words);
  }, [taskDescription]);

  // --- MUTATION ---
  const createTaskDraftMutation = useMutation<
    taskManagementCreateApiResponse,
    Error,
    taskManagementCreateApiPayload
  >({
    mutationFn: taskManagementCreateTaskDraft,
    onSuccess: async (draftData, variables) => {
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

      try {
        const checklistData = await getTaskChecklist(
          draftData.data.id,
          draftData.data.task_type,
        );
        setDraft({
          checklistApiData: checklistData,
          fromChat: routeParams?.fromChat || false,
          conversation_id: routeParams?.conversation_id || null,
        });
      } catch (error: any) {
        Toast.show({ type: 'error', text1: i18n.t('app.task_management.checklist_fetch_failed') });
      }
      navigate(NavigationRoutes.APP_STACK.CREATE_CHECKLIST);
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error.message || 'Error creating task',
      });
    },
  });

  const onSubmit = (data: taskManagementCreateApiPayload) => {
    const payload = { ...data };
    if (!isCleaningCategory) {
      // Date formatting logic...
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
    hasNoVendors: transformedVendor.length === 0,
  };
};

export default CreateTaskContainer;
