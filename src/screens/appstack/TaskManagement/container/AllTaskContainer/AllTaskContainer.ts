import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import STORAGE_CONST from '@/constants/storage';
import { 
  getHostTaskList, 
  getTaskManagementListing, 
  getTaskManagementVendor ,
  getTaskDetail
} from '@/services/TaskManagementApi';
import { useTaskStore } from '@/store/taskStore';

const AllTaskContainer = () => {
  const { setTaskInfo } = useTaskStore();
  const STATUS_MAP: Record<string, string> = {
    'To-do': 'todo',
    'In Progress': 'inprogress',
    'Complete': 'completed',
    'Template': 'template',
  };

  const [activeTab, setActiveTab] = useState('To-do');
  const [page, setPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState({
    listings: [] as string[],
    assignees: [] as string[],
  });

  // 1. Fetch Task List (dependent on activeTab, page, and filters)
  const {
    data: taskResponse,
    isLoading: isLoadingTasks,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: [STORAGE_CONST.GET_HOST_TASK_LIST, activeTab, page, appliedFilters],
    queryFn: () =>
      getHostTaskList({
        page: page,
        per_page: 20,
        status: STATUS_MAP[activeTab],
        // Note: Backend might need these as comma-separated strings or specific logic
        listing_id: appliedFilters.listings.length > 0 ? Number(appliedFilters.listings[0]) : undefined,
        vendor_id: appliedFilters.assignees.length > 0 ? Number(appliedFilters.assignees[0]) : undefined,
      }),
  });
  console.log("taskResponse",taskResponse)

  // Global Check: Fetch with no status to see if the user has ANY tasks at all
  const { data: globalCheckResponse, isLoading: isLoadingGlobal } = useQuery({
    queryKey: [STORAGE_CONST.GET_HOST_TASK_LIST, 'account-total-check'],
    queryFn: () => getHostTaskList({ page: 1, per_page: 1 }), 
  });

  console.log("globalCheckResponse",globalCheckResponse)





  // 2. Fetch Listing Options for Filter
  const { data: rawListings = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_MANAGEMENT_LISTING],
    queryFn: getTaskManagementListing,
  });

  // 3. Fetch Vendor Options for Filter
  const { data: rawVendors = [] } = useQuery({
    queryKey: [STORAGE_CONST.GET_TASK_MANAGEMENT_VENDOR],
    queryFn: getTaskManagementVendor,
  });

  // Transform data for MultiSelectDropdown
  const listingOptions = useMemo(() => 
    rawListings?.map((item: any) => ({
      label: item.value,
      value: item.id.toString(),
    })) || [], [rawListings]);

  const assigneeOptions = useMemo(() => 
    rawVendors?.map((item: any) => ({
      label: item.name,
      value: item.id.toString(),
    })) || [], [rawVendors]);

  const handleLoadMore = () => {
    if (taskResponse?.meta?.current_page < taskResponse?.meta?.last_page) {
      setPage(prev => prev + 1);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
  };

  const applyFilters = (data: { listings: string[], assignees: string[] }) => {
    setAppliedFilters(data);
    setPage(1);
  };

  console.log("globalCheckResponse?.data?.length === 0ss",globalCheckResponse?.data?.length > 0)

  return {
    taskList: taskResponse?.data || [],
    isAccountEmpty: globalCheckResponse?.data?.length > 0,
    meta: {
      hasNextPage: taskResponse?.meta?.current_page < taskResponse?.meta?.last_page,
      isFetchingNextPage: isRefetching,
      fetchNextPage: handleLoadMore,
      refetch: refetch,
    },
    setTaskInfo,
    isLoading: isLoadingTasks,
    activeTab,
    handleTabChange,
    listingOptions,
    assigneeOptions,
    applyFilters,
  };
};

export default AllTaskContainer;