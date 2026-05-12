import { SERVICE_CONFIG_URLS } from "@/constants/api_urls";
import apiService from "./apiService";

export const UpdateLanguageApi = async (payload: any) => {
  const { ok, response, data } = await apiService.post(
    SERVICE_CONFIG_URLS.APP.UPDATE_LANGUAGE,
    payload
  );

  if (ok) {
    return data;
  }
  throw response;
};