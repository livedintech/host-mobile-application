import { SERVICE_CONFIG_URLS } from "@/constants/api_urls";
import apiService from "./apiService";
import { CreateListingDetailsPayload, CreateListingPayload, createListingPricingPayload } from "@/types/api/createListingTypes";
import Utils from "@/utility/Utils";
import { getUserListingsByUserID } from "@/types/api/bookingManagementTypes";

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

// Manage Your Listings
export const getManageYourListings = async (payload: getUserListingsByUserID) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.GET_MANAGE_YOUR_LISTINGS,
        { user: payload.user },
    );

    const { ok, response, data } = await apiService.get(url);
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};