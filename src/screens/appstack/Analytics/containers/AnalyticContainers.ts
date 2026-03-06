import React, { useState, useCallback } from 'react';
import STORAGE_CONST from '@/constants/storage';
import { 
  getListings, 
  getAnalyticSummary, 
  getListingPerformance, 
  getAnalyticsChannel 
} from '@/services/AnalyticsApis';
import { ListingOption } from '@/types/api/AnalyticsTypes';
import { useQuery } from '@tanstack/react-query';

const AnalyticContainers = () => {
  const [filters, setFilters] = useState({
    listings: [] as (string | number)[],
    channel: [] as string[],
    date: [] as string[],
  });

  const [chartListingIds, setChartListingIds] = useState<(string | number)[]>([]);

  const { data: listings = [], isLoading: listingsLoading } = useQuery({
    queryKey: [STORAGE_CONST.GET_USER_MANAGEMENT_LISTING],
    queryFn: getListings,
  });

  const listingOptions = listings?.map((item: ListingOption) => ({
    label: item?.name,
    value: item?.id,
  })) || [];

  const channelOptions = [
    { label: 'Airbnb', value: 'airbnb' },
    // { label: 'Bcom', value: 'bcom' },
    { label: 'Gathern', value: 'gathern' },
  ];

  const dateOptions = [
    { label: 'Today', value: 'today' },
    { label: 'Last 7 Days', value: '7days' },
    { label: 'Last 30 Days', value: '30days' },
  ];

  // STABLE HANDLERS
  const applyFilters = useCallback((values: any) => setFilters(values), []);
  const resetFilters = useCallback(() => {
    setFilters({ listings: [], channel: [], date: [] });
    setChartListingIds([]);
  }, []);

  const handleChartListingChange = useCallback((ids: (string | number)[]) => {
    setChartListingIds(ids);
  }, []);

  const { data: AnalyticsSummary, isLoading: isLoadingAnalytics, refetch: refetchSummary} = useQuery({
    queryKey: [STORAGE_CONST.GET_ANALYTICS_SUMMARY, filters],
    queryFn: () => getAnalyticSummary({
      listing_ids: filters.listings.join(','),
      channels: filters.channel.join(','),
      range: filters.date[0] || '30days',
    }),
  });

  const { data: AnalyticsPerformance, isLoading: isLoadingAnalyticsPerformance , refetch: refetchPerformance} = useQuery({
    queryKey: [STORAGE_CONST.GET_ANALYTICS_PERFORMANCE],
    queryFn: () => getListingPerformance(),
  });

  const { data: AnalyticChannelChartData, isLoading: isLoadingAnalyticsChannelChart } = useQuery({
    queryKey: [STORAGE_CONST.GET_ANALYTICS_CHANNEL, chartListingIds],
    queryFn: () => getAnalyticsChannel({
      listing_ids: chartListingIds.join(','), 
      // range: filters.date[0] || '30days',
      range : '30days'
    }),
  });

  console.log("AnalyticChannelChartDatadatabbb",AnalyticChannelChartData)

  return {
    listingOptions,
    channelOptions,
    dateOptions,
    filters,
    applyFilters,
    resetFilters,
    chartListingIds,
    handleChartListingChange,
    AnalyticsSummary,
    isLoadingAnalytics,
    refetchSummary,
    AnalyticsPerformance,
    isLoadingAnalyticsPerformance,
    AnalyticChannelChartData,
    isLoadingAnalyticsChannelChart,
    listingsLoading,
    refetchPerformance
  };
};

export default AnalyticContainers;