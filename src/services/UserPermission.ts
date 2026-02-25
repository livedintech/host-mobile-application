import { SERVICE_CONFIG_URLS } from '@/constants/api_urls';
import apiService from './apiService';

//Get User Management
export const getUser = async () => {
  const { ok, response, data } = await apiService.get(
    SERVICE_CONFIG_URLS.APP.GET_USER,
  );

  if (ok) {
    return data.data;
  }

  throw response.message;
};
