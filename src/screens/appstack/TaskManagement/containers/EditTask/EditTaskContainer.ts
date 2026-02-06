import { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import {
  getTaskDetail,
  getTaskChecklist,
  getTaskChecklistDetail,
  getTaskManagementVendor,
  vendorUpdate,
  editChecklistItem,
} from '@/services/TaskManagementApi';
import STORAGE_CONST from '@/constants/storage';
import { queryClient } from '@/services/api';

const EditTaskContainer = () => {
  const { params } = useRoute();
  const taskId = (params as any)?.taskId;
  const taskStatus = (params as any)?.taskStatus;
  const taskType = (params as any)?.taskType;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // -------------------------------
  // Task Detail
  // -------------------------------
  const { data: taskDetail, isLoading: isLoadingTaskDetail } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_DETAIL, taskId, taskStatus],
    queryFn: () => getTaskDetail(taskId, taskStatus),
    enabled: !!taskId && !!taskStatus,
  });

  // -------------------------------
  // Vendors
  // -------------------------------
  const { data: vendorsResponse } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_MANAGEMENT_VENDOR],
    queryFn: getTaskManagementVendor,
  });

  const vendors = vendorsResponse || [];

  const vendorDropdown = vendors.map((v: any) => ({
    label: v.name,
    value: v.id,
  }));

  useEffect(() => {
    if (taskDetail?.assigned_user?.id) {
      setValue('assignTask', taskDetail.assigned_user.id);
    }
  }, [taskDetail]);

  // -------------------------------
  // Vendor Update Mutation
  // -------------------------------
  const vendorMutation = useMutation({
    mutationFn: vendorUpdate,
    onSuccess: (data, variables, context) => {
      console.log('✅ Vendor Update Success:', data); // log full response
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.GET_TASK_DETAIL, taskId],
      });
    },
    onError: (error: any) => {
      console.log('❌ Vendor Update Error:', error?.message || error);
       Toast.show({ type: 'error', text1: error?.message });
    },
  });

  // -------------------------------
  // Checklist list
  // -------------------------------
  const { data: checklistResponse, isLoading: isLoadingChecklist } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_CHECKLIST, taskId, taskType],
    queryFn: () => getTaskChecklist(taskId, taskType),
    enabled: !!taskId && !!taskType,
  });

  const checklists = checklistResponse?.data?.tasks || [];

  // -------------------------------
  // Checklist detail
  // -------------------------------
  const [expandedId, setExpandedId] = useState<number | string | null>(null);

  const { data: checklistDetailResponse, isLoading: isLoadingChecklistDetail } =
    useQuery({
      queryKey: [STORAGE_CONST.GET_TASK_CHECKLIST_DETAIL, expandedId, taskType],
      queryFn: () => getTaskChecklistDetail(expandedId!, taskType),
      enabled: !!expandedId,
    });

  const checklistDetail = { items: checklistDetailResponse?.data || [] };

  const toggleExpand = (id: number | string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  // -------------------------------
  // NEW: selected checklist items
  // -------------------------------
  const [selectedChecklistIds, setSelectedChecklistIds] = useState<number[]>(
    [],
  );

  const toggleChecklistItem = (id: number) => {
    setSelectedChecklistIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  };

  // -------------------------------
  // Checklist Update Mutation
  // -------------------------------
  const checklistMutation = useMutation({
    mutationFn: editChecklistItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [STORAGE_CONST.GET_TASK_CHECKLIST_DETAIL, expandedId],
      });
    },
  });

  // -------------------------------
  // Save handler
  // -------------------------------
  const onSubmit = (formData: any) => {
    // 1️⃣ vendor update
    vendorMutation.mutate({
      taskId: taskId,
      vendor_id: formData.assignTask,
    });

    // 2️⃣ checklist update (only if items selected)
    if (selectedChecklistIds.length > 0) {
      checklistMutation.mutate({
        task_id: taskId,
        ids: selectedChecklistIds,
      });
    }
  };

  //   const onSubmit = (formData: any) => {
  //   const previousVendorId = taskDetail?.assigned_user?.id;
  //   const newVendorId = formData.assignTask;

  //   // 1️⃣ Vendor update ONLY if changed
  //   if (newVendorId && newVendorId !== previousVendorId) {
  //     vendorMutation.mutate({
  //       taskId: taskId,
  //       vendor_id: newVendorId,
  //     });
  //   }

  //   // 2️⃣ Checklist update ONLY if user selected items
  //   if (selectedChecklistIds.length > 0) {
  //     checklistMutation.mutate({
  //       task_id: taskId,
  //       ids: selectedChecklistIds,
  //     });
  //   }
  // };

  const capitalizeFirst = (value?: string) =>
    value ? value.charAt(0).toUpperCase() + value.slice(1) : '';

  return {
    taskDetail,
    isLoadingTaskDetail,
    control,
    errors,
    handleSave: handleSubmit(onSubmit),
    capitalizeFirst,

    checklists,
    isLoadingChecklist,
    checklistDetail,
    isLoadingChecklistDetail,
    expandedId,
    toggleExpand,
    taskStatus,
    vendorDropdown,

    // checkbox control
    selectedChecklistIds,
    toggleChecklistItem,

    // loading states
    isSavingVendor: vendorMutation.isPending,
    isSavingChecklist: checklistMutation.isPending,
  };
};

export default EditTaskContainer;
