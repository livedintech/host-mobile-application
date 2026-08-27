import { useState, useMemo } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import STORAGE_CONST from '@/constants/storage';
import {
  getHostTaskList,
  getTaskManagementListing,
  getTaskManagementVendor,
  getTaskDetail,
} from '@/services/TaskManagementApi';
import { useTaskStore } from '@/store/taskStore';
import { PAGE_SIZE } from '@/services/api';
import useInfiniteListData from '@/hooks/useInfiniteListData';

const AllTaskContainer = (initialListingId?: string, initialTab?: string) => {
  const { setTaskInfo } = useTaskStore();
  const STATUS_MAP: Record<string, string> = {
    todo: 'todo',
    in_progress: 'inprogress',
    complete: 'completed',
    template: 'template',
  };

  const [activeTab, setActiveTab] = useState(initialTab || 'todo');
  const [appliedFilters, setAppliedFilters] = useState({
    listings: initialListingId ? [initialListingId] : ([] as string[]),
    assignees: [] as string[],
  });

  const dataQuery = useInfiniteQuery({
    queryKey: [STORAGE_CONST.GET_HOST_TASK_LIST, activeTab, appliedFilters],
    queryFn: ({ pageParam = 1 }) =>
      getHostTaskList(
        pageParam as number,
        PAGE_SIZE,
        STATUS_MAP[activeTab],
        appliedFilters.listings.length > 0
          ? Number(appliedFilters.listings[0])
          : undefined,
        appliedFilters.assignees.length > 0
          ? Number(appliedFilters.assignees[0])
          : undefined,
      ),
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage.current_page < lastPage.last_page
        ? lastPage.current_page + 1
        : undefined,
  });

  const { data: dataList, isLoading, isFetching } = dataQuery;

  const rawList = useInfiniteListData(dataList?.pages) as any[];

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
  const listingOptions = useMemo(
    () =>
      rawListings?.map((item: any) => ({
        label: item.value,
        value: item.id.toString(),
      })) || [],
    [rawListings],
  );

  const assigneeOptions = useMemo(
    () =>
      rawVendors?.map((item: any) => ({
        label: item.name,
        value: item.id.toString(),
      })) || [],
    [rawVendors],
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const applyFilters = (data: { listings: string[]; assignees: string[] }) => {
    setAppliedFilters(data);
  };

  return {
    setTaskInfo,
    activeTab,
    handleTabChange,
    listingOptions,
    assigneeOptions,
    applyFilters,
    rawList,
    dataQuery,
    isLoading,
    isFetching,
  };
};

export default AllTaskContainer;
