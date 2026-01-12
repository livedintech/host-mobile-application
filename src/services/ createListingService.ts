import { SERVICE_CONFIG_URLS } from "@/constants/api_urls";
import apiService from "./apiService";
import { CreateListingDetailsPayload } from "@/types/api/createListingTypes";

export const createListingDetailsApi = async (payload: CreateListingDetailsPayload) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.APP.CREATE_LISTING_DETAILS,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};