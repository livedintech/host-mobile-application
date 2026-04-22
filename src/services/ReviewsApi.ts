import { SERVICE_CONFIG_URLS } from '@/constants/api_urls';
import apiService from './apiService';
import { RateYourGuestPayload } from '@/types/api/reviewManagementTypes';


export const getAllReviews = async () => {
  const { ok, response, data } = await apiService.get(
    SERVICE_CONFIG_URLS.APP.GET_REVIEWS_ALL,
  );

  if (ok) {
    return data;
  }

  throw response.message;
};


export const getReviewByID = async (id: number | string) => {
  if (!id) {
    throw new Error('id is required');
  }

  const endpoint =
    SERVICE_CONFIG_URLS.APP.GET_REVIEW_BY_ID.replace('{id}', String(id));

  const { ok, response, data } = await apiService.get(endpoint);

  if (ok) {
    return data;
  }

  throw new Error(response?.message || 'Failed to fetch review');
};


export const hostReviewReply = async (
  payload: { review_id: number; content: string },
) => {
  const { ok, response, data } = await apiService.post(
    SERVICE_CONFIG_URLS.APP.HOST_REPLY_TO_GUEST,
    payload,
  );

  if (ok) {
    return data;
  }

  throw response;
};


export const rateYourGuest = async (
  payload: RateYourGuestPayload,
) => {
  const { ok, response, data } = await apiService.post(
    SERVICE_CONFIG_URLS.APP.RATE_YOUR_GUEST,
    payload,
  );

  if (ok) {
    return data;
  }

  throw response;
};

