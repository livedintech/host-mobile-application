import Utils from '@/utility/Utils';
import apiService from './apiService';
import { SERVICE_CONFIG_URLS } from '@/constants/api_urls';
import {
  GetAnalyticSummaryParams,
  GetAnalyticPerformanceParams,
} from '@/types/api/AnalyticsTypes';

//Get Listings
export const getListings = async () => {
  const { ok, response, data } = await apiService.get(
    SERVICE_CONFIG_URLS.APP.GET_USER_MANAGEMENT_LISTING,
  );

  if (ok) {
    return data.data;
  }

  throw response.message;
};

export const getChannelsUserbyId = async (user_id: number) => {
  const url = Utils.createDynamicUrl(
    SERVICE_CONFIG_URLS.APP.GET_CHANNEX_ACCOUNT,
    { user_id: user_id },
  );

  const { ok, response, data } = await apiService.get(url);

  if (ok) {
    return data;
  }

  throw new Error(response?.message || 'Failed to fetch channels');
};

export const getAnalyticSummary = async ({
  listing_ids,
  channels,
  start_date,
  end_date,
  range,
}: GetAnalyticSummaryParams) => {
  const queryParams = new URLSearchParams();

  if (listing_ids) queryParams.append('listing_ids', listing_ids);
  if (channels) queryParams.append('channels', channels);
  if (start_date) queryParams.append('start_date', start_date);
  if (end_date) queryParams.append('end_date', end_date);
  if (range) queryParams.append('range', range);

  const { ok, data, response } = await apiService.get(
    `${
      SERVICE_CONFIG_URLS.APP.GET_ANALYTICS_SUMMARY
    }?${queryParams.toString()}`,
  );

  if (ok) {
    return data;
  }

  throw new Error(response?.message || 'Failed to fetch analytics summary');
};

// export const getListingPerformance = async ({
//   listing_ids,
//   channels,
//   start_date,
//   end_date,
//   range,
// }: GetAnalyticPerformanceParams) => {
//   const queryParams = new URLSearchParams();

//   if (listing_ids) queryParams.append('listing_ids', listing_ids);
//   if (channels) queryParams.append('channels', channels);
//   if (start_date) queryParams.append('start_date', start_date);
//   if (end_date) queryParams.append('end_date', end_date);
//   if (range) queryParams.append('range', range);

//   const { ok, data, response } = await apiService.get(
//     `${
//       SERVICE_CONFIG_URLS.APP.GET_LISTING_ANALYTICS
//     }?${queryParams.toString()}`,
//   );

//   if (ok) {
//     return data;
//   }

//   throw new Error(response?.message || 'Failed to fetch analytics summary');
// };

export const getListingPerformance = async () => {
  const { ok, data, response } = await apiService.get(
    `${SERVICE_CONFIG_URLS.APP.GET_LISTING_ANALYTICS_PERFORMANCE}`,
  );

  if (ok) {
    return data;
  }

  throw new Error(response?.message || 'Failed to fetch analytics summary');
};

export const getAnalyticsChannel = async ({
  listing_ids,
  range,
}: {
  listing_ids?: string;
  range?:string
}) => {
  const queryParams = new URLSearchParams();

  if (listing_ids) queryParams.append('listing_ids', listing_ids);
  if (range) queryParams.append('range', range);

  const { ok, data, response } = await apiService.get(
    `${
      SERVICE_CONFIG_URLS.APP.GET_ANALYTICS_CHANNEL
    }?${queryParams.toString()}`,
  );

  if (ok) {
    return data;
  }

  throw new Error(response?.message || 'Failed to fetch analytics Channel');
};
