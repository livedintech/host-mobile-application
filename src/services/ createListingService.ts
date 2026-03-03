import { SERVICE_CONFIG_URLS } from "@/constants/api_urls";
import apiService from "./apiService";
import { createEditAmenitiesPayloadType, CreateListingDetailsPayload, CreateListingExportPayloadType, CreateListingPayload, createListingPricingPayload, getTransactionHistoryPayloadType } from "@/types/api/createListingTypes";
import Utils from "@/utility/Utils";
import { CreateEditlistingCitiesPayloadType, CreateEditlistingDistrictsPayloadType, CreateEditlistingStatePayloadType, DeleteListingPayloadType, getManageListingDetailByIdApiTypePayload, getUserListingsByUserID } from "@/types/api/bookingManagementTypes";

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

// Manage Listing Details By ID
export const getManageListingDetailById = async (
  payload: getManageListingDetailByIdApiTypePayload,
) => {
  // replace only PATH param
  let url = Utils.createDynamicUrl(
    SERVICE_CONFIG_URLS.APP.GET_MANAGE_YOUR_LISTING_DETAIL,
    { listing_id: payload.listing_id },
  );

  // append QUERY param
  if (payload.user_id) {
    url += `?user_id=${payload.user_id}`;
  }

  const { ok, response, data } = await apiService.get(url);

  if (ok) {
    return data;
  }

  throw new Error(response.message || 'Failed to fetch listing details');
};

export const editListingApi = async (payload: CreateListingDetailsPayload) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.APP.EDIT_MANAGE_YOUR_LISTING_DETAIL,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};

export const editListingPriceApi = async (payload: createListingPricingPayload) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.APP.EDIT_MANAGE_YOUR_LISTING_DETAIL_PRICE,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};

// Transaction History
export const getTransactionHistoryApi = async (payload: getTransactionHistoryPayloadType) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.TRANSACTION_HISTORY,
        { host_id: payload.host_id },
    );

    const { ok, response, data } = await apiService.get(url);
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};

// Create Listing 
export const createNewListingApi = async (payload: getUserListingsByUserID) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.CREATE_LISTINGS_BEFORE,
        { user_id: payload.user },
    );

    const { ok, response, data } = await apiService.get(url);
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};


//Get Amunities 
export const getAmenitiesApi = async () => {
    const { ok, response, data } = await apiService.get(
        SERVICE_CONFIG_URLS.APP.GET_AMENITIES
    );

    if (ok) {
        return data.data;
    }

    throw response.message;
};

//Post/Put Amenities
export const CreateUpdateAmenitiesApi = async (payload: createEditAmenitiesPayloadType) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.APP.CREATE_EDIT_AMENITIES,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};

//Country 
export const getListingCountriesApi = async () => {
    const { ok, response, data } = await apiService.get(
        SERVICE_CONFIG_URLS.APP.COUNTRIES
    );

    if (ok) {
        return data.data;
    }

    throw response.message;
};

//State
export const getListingStateApi = async (payload: CreateEditlistingStatePayloadType) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.STATES,
        { country_id: payload.country_id },
    );

    const { ok, response, data } = await apiService.get(url);
    if (ok) {
        return data?.data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};

//City
export const getListingCityApi = async (payload: CreateEditlistingCitiesPayloadType) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.CITIES,
        { state_id: payload.state_id },
    );

    const { ok, response, data } = await apiService.get(url);
    if (ok) {
        return data?.data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};

//District
export const getListingDistrictsApi = async (payload: CreateEditlistingDistrictsPayloadType) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.DISTRICTS,
        { city_id: payload.city_id },
    );

    const { ok, response, data } = await apiService.get(url);
    if (ok) {
        return data?.data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};

// Delete
export const deleteListingApi = async (payload: DeleteListingPayloadType) => {
    const url = Utils.createDynamicUrl(
        SERVICE_CONFIG_URLS.APP.DELETE_PROPERTY,{}, //URL
    );

    const { ok, response, data } = await apiService.delete(url, {...payload}); // body
    if (ok) {
        return data;
    }
    throw new Error(response.message || 'Failed to fetch sub-categories');
};

export const createListingExportApi = async (payload: CreateListingExportPayloadType) => {
    const { ok, response, data } = await apiService.post(
        SERVICE_CONFIG_URLS.APP.CREATE_LISTING_EXPORT,
        payload,
    );
    if (ok) {
        return data;
    }
    throw response;
};