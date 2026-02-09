import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { navigate } from '@/services/navigationService';
import NavigationRoutes from '@/navigation/NavigationRoutes';

import {
  getHostTaskList,
  getTaskManagementListing,
  getTaskManagementVendor,
} from '@/services/TaskManagementApi';

import useInfiniteListData from '@/hooks/useInfiniteListData';
import { Task } from '@/types/api/taskManagentType';
import STORAGE_CONST from '@/constants/storage';

const TaskListContainer = () => {
  const [isFilterVisible, setFilterVisible] = useState(false);

  /**
   * 🔥 store filters (single values)
   */
  const [appliedFilters, setAppliedFilters] = useState<{
    listing_id?: number;
    vendor_id?: number;
    status?: string;
  }>({});

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      listings: [],
      assignee: [],
      status: [],
    },
  });

  /**
   * ======================================
   * LISTING QUERY
   * ======================================
   */
  const listingQuery = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_MANAGEMENT_LISTING],
    queryFn: getTaskManagementListing,
  });

  /**
   * ======================================
   * VENDOR QUERY
   * ======================================
   */
  const vendorQuery = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_MANAGEMENT_VENDOR],
    queryFn: getTaskManagementVendor,
  });

  /**
   * ======================================
   * TASK LIST QUERY WITH FILTER
   * ======================================
   */
  const taskQuery = useInfiniteQuery({
    queryKey: ['GET_HOST_TASK_LIST', appliedFilters],

    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      getHostTaskList({
        page: pageParam,
        per_page: 24,
        listing_id: appliedFilters?.listing_id,
        vendor_id: appliedFilters?.vendor_id,
        status: appliedFilters?.status,
      }),

    getNextPageParam: lastPage => {
      const current = lastPage?.meta?.current_page;
      const last = lastPage?.meta?.last_page;

      return current < last ? current + 1 : undefined;
    },
  });

  /**
   * ======================================
   * NORMALIZE PAGINATION
   * ======================================
   */
  const tasks = useInfiniteListData<Task>(taskQuery?.data?.pages);

  /**
   * ======================================
   * DROPDOWN MAPPING
   * ======================================
   */
  const listingDropdown =
    listingQuery?.data?.map((item: any) => ({
      label: item?.value,
      value: item?.id,
    })) || [];

  const vendorDropdown =
    vendorQuery?.data?.map((item: any) => ({
      label: item?.name,
      value: item?.id,
    })) || [];

  /**
   * ======================================
   * NAVIGATION
   * ======================================
   */
  const handleCreateTask = () => {
    navigate(NavigationRoutes.APP_STACK.CREATE_TASK);
  };

  const handleEditTask = (task: Task) => {
    navigate(NavigationRoutes.APP_STACK.EDIT_TASK, {
      taskId: task?.id,
      taskStatus: task?.status,
      taskType: task?.task_type,
    });
  };

  /**
   * ======================================
   * FILTER HANDLERS
   * ======================================
   */
  const onApplyFilter = (data: any) => {
    setAppliedFilters({
      listing_id: data?.listings?.[0],
      vendor_id: data?.assignee?.[0],
      status: data?.status?.[0],
    });

    toggleFilterModal();
  };

  const onResetFilter = () => {
    reset();
    setAppliedFilters({});
  };

  const toggleFilterModal = () => setFilterVisible(prev => !prev);

  /**
   * ======================================
   * RETURN
   * ======================================
   */
  return {
    tasks,
    taskQuery,

    listingDropdown,
    vendorDropdown,

    handleCreateTask,
    handleEditTask,

    control,
    errors,
    handleSubmit,
    onApplyFilter,
    onResetFilter,

    isFilterVisible,
    toggleFilterModal,
  };
};

export default TaskListContainer;
