import { SERVICE_CONFIG_URLS } from "@/constants/api_urls";
import apiService from "./apiService";
import { CreateListingDetailsPayload, CreateListingPayload, createListingPricingPayload } from "@/types/api/createListingTypes";

export const createListingApi = async (payload: CreateListingPayload) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.APP.CREATE_LISTING,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};

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

export const createListingPricingApi = async (payload: createListingPricingPayload) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.APP.CREATE_LISTING_PRICING,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};